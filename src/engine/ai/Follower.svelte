<script>
    import _ from "lodash";
    import Woodcutter from "src/engine/characters/woodcutter/Woodcutter.svelte"
    import Megaman from "src/engine/characters/megaman/Megaman.svelte";
    import WoodcutterOther from "src/engine/characters/woodcutter/WoodcutterOther.svelte"
    import MegamanOther from "src/engine/characters/megaman/MegamanOther.svelte"
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte"
    import Animation from "src/engine/Animation"
    import {renderable} from "src/stores/engine"
	import {players as playerStore} from "src/stores/socket"
    import LogScale from "log-scale"

    export let bot = {
        x: 0, 
        y: 0, 
        width: 100, 
        height: 100,
        isRunning: false,
        isShooting: false,
        isFallingOrJumping: false,
        xDirection: "left"
    };

    const playerTypes = {
		"megaman": [Megaman, MegamanOther],
		"woodcutter": [Woodcutter, WoodcutterOther]
	}

    const logScaleY = new LogScale(10, 20);
    const logScaleX = new LogScale(0,4);

    let collisions = [];
    let colliders = [];
    let players = []
    let playerCollider;
    let vx = 0;
    let vy = 20;
    let vg = 20;
    let beingPushed = false;
    let attack;
    $: isFallingOrJumping = (collisions.length == 0) || !_.find(collisions, (c) => (c.region == "top"));

    playerStore.subscribe((_players)=> {
        players = _players;
        if (!players.length) return;

    })

    const getClosestPlayer = (players) => {
        return _.sortBy(players, [(p) => (Math.abs(p.x - bot.x))])[0];
    };

    const getClosestPlatform = () => {
        const platforms = _.filter(colliders, (c) => ((c.category == "platform") && c.y1 > (bot.y + bot.height)));

        for (let platform of platforms) {
            if (bot.x > platform.x1 && bot.x < platform.x2) return bot.x;
        }

        const leftSides = _.map(platforms, (p) => p.x1);
        const rightSides = _.map(platforms, (p) => p.x2);

        return _.sortBy([...leftSides, ...rightSides], [(x) => (Math.abs(x - bot.x))])[0];
    }

    setInterval(() => {
        bot.isShooting = !bot.isShooting;
        bot.isGuarding = !bot.isShooting;
        if (bot.isShooting) bot.bullet = true;
    }, 1500);

    setInterval(() => {
        let targetX;
        let V = 5;
        if (beingPushed) {
            V = 3;
            targetX = getClosestPlatform();
        } else {
            targetX = getClosestPlayer(players)?.x || bot.x;
        }

        const onLeft = (targetX > (bot.x - 100));
        const onRight = (targetX < (bot.x + 100));

        if (onLeft) {
            vx = isFallingOrJumping ? vx + V : V;
        } else if (onRight) {
            vx = isFallingOrJumping ? vx - V : -V;
        }

        vx = (onLeft && onRight) ? 0 : vx

        bot.xDirection = targetX > bot.x ? "right" : "left";
    }, 500);

    const dyUp = (x) => (-logScaleY.linearToLogarithmic(logScaleY.maxValue - x/10));
    const dyDown = (x) => (logScaleY.linearToLogarithmic(x/10));

    const jump = (peakHeight=0, index=0, isJumping=true) => {
        const V = isJumping ? dyUp(index) : dyDown(index)
        
        vy = (isFallingOrJumping || index == 0) ? V : 0;
        index += 1;
        if (isJumping) {
            isJumping = (bot.y - vy <= peakHeight) ? false : true
        }
        if (vy != 0 ) return setTimeout(jump.bind(this, peakHeight,index, isJumping), 100);
    }

    const dyStart = (x) => (logScaleX.linearToLogarithmic(logScaleX.maxValue - x/10));
    const dyEnd = (x) => (logScaleX.linearToLogarithmic(x/10));

    const pushPlayer = () => {
        if (beingPushed) return;
        beingPushed = true;
        let interval;
        let index = 0;
        const stop = () => {
            beingPushed = false;
            clearInterval(interval);
            vx = 0;
        }

        jump(bot.y-bot.hits ** 0.7);

        interval = setInterval(() => {
            const V = (index < bot.hits ) ? dyStart(index) : dyEnd(bot.hits - index);

            index ++;
            let dv = V
            dv *= (attack.region == "left") ? -1 : 1;
            vx += dv;

            if (index > bot.hits ** 2) stop();
            if (V == 0) stop();
        }, 1)

    };

    function isAtRightEdgeOfPlatform(groundCollider) {
        return ((groundCollider?.x2 < bot.x+bot.width+vx) && (vx > 0));
    }

    function isAtLeftEdgeOfPlatform(groundCollider) {
        return ((groundCollider?.x1 > bot.x) && (vx < 0) );
    }

    function findAlternativeCollider(groundCollider, onRight) {
        let colliderBelowMe = _.find(colliders, c => {
                if (c.id == groundCollider.id) return false;
                if (c.category != "platform") return false;
                if (c.y1 < bot.y + bot.height) return false;
                return onRight ? (bot.x+vx < c.x1 ) : (bot.x+vx > c.x2 );
        });

        let colliderAboveMe = _.find(colliders, c => {
            if (c.id == groundCollider.id) return false;
            if (c.category != "platform") return false;
            if (c.y1 > bot.y) return false;
            return onRight ? (bot.x+vx < c.x1 ) : (bot.x+vx > c.x2 );
        });

        return {colliderBelowMe, colliderAboveMe}
    }

    renderable(async (props) => {
        let {canvas, context} = props;
        const collider = playerCollider.collider;
        colliders = props.colliders;
        collisions = collider ? Animation.checkCollisions(colliders, collider) : [];
        const newAttack = _.find(collisions, (c) => (c.category == "weapon"));
        if (newAttack) {
            attack = newAttack;
        }

        context.resetTransform();
        const ground = _.find(collisions, c => (c.region == "top"))
        const groundCollider = ground?.collider;

        if (isFallingOrJumping ||  vy < 0) {
            bot.y +=  vy || vg;
        } else {
            bot.y = ground?.y || bot.y;
        }

        let atRightEdge = isAtRightEdgeOfPlatform(groundCollider);
        let atLeftEdge = isAtLeftEdgeOfPlatform(groundCollider);

        bot.isRunning = (vx != 0);
        bot.isFallingOrJumping = isFallingOrJumping;

        if (newAttack) {
            if (!bot.isGuarding || bot.shieldHealth < 0) {
                bot.takingDamage = true
                bot.hits += 1;
                pushPlayer();
            }
        }

        if (atRightEdge || atLeftEdge) {
            const { colliderAboveMe, colliderBelowMe } = findAlternativeCollider(groundCollider, atRightEdge);
            if (colliderAboveMe) jump(bot.y-50);
            if (!(colliderBelowMe || colliderAboveMe)) {
                bot.isRunning = false;
                if (atRightEdge) bot.x -= vx;
                if (atLeftEdge) bot.x += vx;
            }
        }

        bot.x += (vx < 0) ? _.max([vx, -20]) : _.min([vx, 20])
    })


</script>

<svelte:component handleHits={true} this={playerTypes["megaman"][1]}  player={bot} />
<BoxCollider
    bind:this={playerCollider}
    showBoundaries={false}
    x1={bot.x}
    y1={bot.y}
    id={bot.id}
    name={"follower"} 
    category={"player"}
    width={bot.width} 
    height={bot.height}>
</BoxCollider>
