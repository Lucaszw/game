<script>
    import _ from "lodash";
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte"
    import Animation from "src/engine/Animation"
    import {renderable} from "src/stores/engine"
	import {players as playerStore} from "src/stores/socket"
    import LogScale from "log-scale"

    window.logScale = new LogScale(10, 20);
    
    export let x = 0;
    export let y = 0;
    export let width = 100;
    export let height = 100;

    let collisions = [];
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
        return _.sortBy(players, [(p) => (Math.abs(p.x - x))])[0];
    };

    setInterval(() => {
        const player = getClosestPlayer(players);
        const playerX = player?.x || x
        const V = 5
        vx = (playerX > x) ? 1 : vx
        vx = (playerX < x) ? -1 : vx
        vx = (playerX == x) ? 0 : vx
        vx *= V
    }, 100);

    const dyUp = (x) => (-logScale.linearToLogarithmic(logScale.maxValue - x/10));
    const dyDown = (x) => (logScale.linearToLogarithmic(x/10));

    const jump = (peakHeight=0, index=0, isJumping=true) => {
        const V = isJumping ? dyUp(index) : dyDown(index)
        
        vy = (isFallingOrJumping || index == 0) ? V : 0;
        index += 1;
        if (isJumping) {
            isJumping = (y - vy <= peakHeight) ? false : true
        }
        if (vy != 0 ) return setTimeout(jump.bind(this, peakHeight,index, isJumping), 100);
    }

    function isAtRightEdgeOfPlatform(groundCollider) {
        return ((groundCollider?.x2 < x+width+vx) && (vx > 0));
    }

    function isAtLeftEdgeOfPlatform(groundCollider) {
        return ((groundCollider?.x1 > x) && (vx < 0) );
    }

    function findAlternativeCollider(groundCollider, onRight) {
        let colliderBelowMe = _.find(colliders, c => {
                if (c.id == groundCollider.id) return false;
                if (c.category != "platform") return false;
                if (c.y1 < y + height) return false;
                return onRight ? (x+vx < c.x1 ) : (x+vx > c.x2 );
        });

        let colliderAboveMe = _.find(colliders, c => {
            if (c.id == groundCollider.id) return false;
            if (c.category != "platform") return false;
            if (c.y1 > y) return false;
            return onRight ? (x+vx < c.x1 ) : (x+vx > c.x2 );
        });

        return {colliderBelowMe, colliderAboveMe}
    }

    renderable(async (props) => {
        let {canvas, context, colliders} = props;
        const collider = playerCollider.collider;

        collisions = collider ? Animation.checkCollisions(colliders, collider) : [];
        window.colliders = colliders

        context.resetTransform();
        const ground = _.find(collisions, c => (c.region == "top"))
        const groundCollider = ground?.collider;

        if (isFallingOrJumping ||  vy < 0) {
            y +=  vy || vg;
        } else {
            y = ground?.y || y;
        }

        let atRightEdge = isAtRightEdgeOfPlatform(groundCollider);
        let atLeftEdge = isAtLeftEdgeOfPlatform(groundCollider);

        if (atRightEdge || atLeftEdge) {
            const { colliderAboveMe, colliderBelowMe } = findAlternativeCollider(groundCollider, atRightEdge);
            if (colliderAboveMe) jump(y-50);
            if (!(colliderBelowMe || colliderAboveMe)) return;
        }

        x += vx
    })


</script>

<BoxCollider 
    bind:this={playerCollider}
    showBoundaries={true}
    x1={x}
    y1={y}
    name={"follower"} 
    category={"player"}
    width={width} 
    height={height}>
</BoxCollider>
