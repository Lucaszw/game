<script>
    import _ from "lodash";
    import Megaman from "src/engine/characters/megaman/Animation.svelte"
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte"
    import Animation from "src/engine/Animation"
    import {renderable} from "src/stores/engine"
	import {players as playerStore} from "src/stores/socket"

    import JumpingBehaviour from "src/engine/behaviours/jumping"
    import MovingBehaviour from "src/engine/behaviours/moving"

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
		"megaman": Megaman,
	}

    const jumpingBehaviour = new JumpingBehaviour(bot);
    jumpingBehaviour.vy = 20;

    const movingBehaviour = new MovingBehaviour(bot);

    let collisions = [];
    let colliders = [];
    let players = []
    let playerCollider;
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
        if (bot.isShooting) {
            bot.bullet = true;
        }
    }, 1000);

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
            movingBehaviour.vx = isFallingOrJumping ? movingBehaviour.vx + V : V;
        } else if (onRight) {
            movingBehaviour.vx = isFallingOrJumping ? movingBehaviour.vx - V : -V;
        }

        movingBehaviour.vx = (onLeft && onRight) ? 0 : movingBehaviour.vx

        bot.xDirection = targetX > bot.x ? "right" : "left";
    }, 100);

    function isAtRightEdgeOfPlatform(groundCollider) {
        return ((groundCollider?.x2 < bot.x+bot.width+movingBehaviour.vx) && (movingBehaviour.vx > 0));
    }

    function isAtLeftEdgeOfPlatform(groundCollider) {
        return ((groundCollider?.x1 > bot.x) && (movingBehaviour.vx < 0) );
    }

    function findAlternativeCollider(groundCollider, onRight) {
        let colliderBelowMe = _.find(colliders, c => {
                if (c.id == groundCollider.id) return false;
                if (c.category != "platform") return false;
                if (c.y1 < bot.y + bot.height) return false;
                return onRight ? (bot.x+movingBehaviour.vx < c.x1 ) : (bot.x+movingBehaviour.vx > c.x2 );
        });

        let colliderAboveMe = _.find(colliders, c => {
            if (c.id == groundCollider.id) return false;
            if (c.category != "platform") return false;
            if (c.y1 > bot.y) return false;
            return onRight ? (bot.x+movingBehaviour.vx < c.x1 ) : (bot.x+movingBehaviour.vx > c.x2 );
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

        if (isFallingOrJumping ||  jumpingBehaviour.vy < 0) {
            bot.y +=  jumpingBehaviour.vy || vg;
        } else {
            bot.y = ground?.y || bot.y;
        }

        let atRightEdge = isAtRightEdgeOfPlatform(groundCollider);
        let atLeftEdge = isAtLeftEdgeOfPlatform(groundCollider);

        bot.isRunning = (movingBehaviour.vx != 0);
        bot.isFallingOrJumping = isFallingOrJumping;

        if (newAttack) {
            if (!bot.isGuarding || bot.shieldHealth < 0) {
                bot.takingDamage = true
                bot.hits += 1;
                setTimeout(() => {
                    bot.isGuarding = true;
                    if (!isFallingOrJumping)
                        jumpingBehaviour.jump(bot.y - 50);
                }, 1000);
                jumpingBehaviour.jump(bot.y - bot.hits **0.7);
                movingBehaviour.push(newAttack.region);
            }
        }

        if (atRightEdge || atLeftEdge) {
            const { colliderAboveMe, colliderBelowMe } = findAlternativeCollider(groundCollider, atRightEdge);
            if (colliderAboveMe) jumpingBehaviour.jump(bot.y-50);
            if (!(colliderBelowMe || colliderAboveMe)) {
                bot.isRunning = false;
                if (atRightEdge) bot.x -= movingBehaviour.vx;
                if (atLeftEdge) bot.x += movingBehaviour.vx;
            }
        }

        bot.x += (movingBehaviour.vx < 0) ? _.max([movingBehaviour.vx, -20]) : _.min([movingBehaviour.vx, 20])
    })


</script>

<svelte:component handleHits={true} this={playerTypes["megaman"]}  player={bot} />
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
