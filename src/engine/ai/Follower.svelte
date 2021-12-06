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

    const logScale = new LogScale(10, 20);

    let collisions = [];
    let colliders = [];
    let players = []
    let playerCollider;
    let vx = 0;
    let vy = 20;
    let vg = 20;
    $: isFallingOrJumping = (collisions.length == 0) || !_.find(collisions, (c) => (c.region == "top"));

    playerStore.subscribe((_players)=> {
        players = _players;
        if (!players.length) return;

    })

    const getClosestPlayer = (players) => {
        return _.sortBy(players, [(p) => (Math.abs(p.x - bot.x))])[0];
    };

    setInterval(() => {
        bot.isShooting = !bot.isShooting;
        if (bot.isShooting) bot.bullet = true;
    }, 3000);

    setInterval(() => {
        const player = getClosestPlayer(players);
        const playerX = (player?.x || bot.x)
        const V = 5;
        const onLeft = (playerX > (bot.x - 100));
        const onRight = (playerX < (bot.x + 100));

        vx = onLeft ? 1 : vx
        vx = onRight ? -1 : vx
        vx = (onLeft && onRight) ? 0 : vx
        vx *= V
        bot.xDirection = playerX > bot.x ? "right" : "left";
    }, 100);

    const dyUp = (x) => (-logScale.linearToLogarithmic(logScale.maxValue - x/10));
    const dyDown = (x) => (logScale.linearToLogarithmic(x/10));

    const jump = (peakHeight=0, index=0, isJumping=true) => {
        const V = isJumping ? dyUp(index) : dyDown(index)
        
        vy = (isFallingOrJumping || index == 0) ? V : 0;
        index += 1;
        if (isJumping) {
            isJumping = (bot.y - vy <= peakHeight) ? false : true
        }
        if (vy != 0 ) return setTimeout(jump.bind(this, peakHeight,index, isJumping), 100);
    }

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
        if (atRightEdge || atLeftEdge) {
            const { colliderAboveMe, colliderBelowMe } = findAlternativeCollider(groundCollider, atRightEdge);
            if (colliderAboveMe) jump(bot.y-50);
            if (!(colliderBelowMe || colliderAboveMe)) {
                bot.isRunning = false;
                return;
            }
        }

        bot.x += vx
    })


</script>

<svelte:component this={playerTypes["megaman"][1]}  player={bot} />
<BoxCollider 
    bind:this={playerCollider}
    showBoundaries={false}
    x1={bot.x}
    y1={bot.y}
    name={"follower"} 
    category={"player"}
    width={bot.width} 
    height={bot.height}>
</BoxCollider>
