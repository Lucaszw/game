<script>
    import { renderable } from 'src/store.js';
    import _ from "lodash";
    import MegamanAnimation from './MegamanAnimation.js';
    import BulletController from "src/engine/weapons/bullets/BulletController.svelte";
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte";

    import jumping from './animations/jumping';
    import running from './animations/running';
    import standing from './animations/standing';
    import bullet from "./artillery/bullet";

    let collisions = [];
	let keys = [];
    let jumpingTime = 0;
    let isShooting = false;

    export let player;

    $: keyDown = (keys.length > 0);
    $: characterVelocity = {
        x: MegamanAnimation.characterVelocityX(),
        y: MegamanAnimation.characterVelocityY(jumpingTime)
    };

    // Character state
    $: isRunning = (keyDown == true && (_.includes(keys, "a") || _.includes(keys, "d")));
    $: isFallingOrJumping = (collisions.length == 0) || !_.find(collisions, (c) => (c.region == "top"));
    $: isMovingLeft = isRunning && player.xDirection == "left";
    $: isMovingRight = isRunning && player.xDirection == "right";

    function handleKeydown(event) {
        const newKey = event.key;
        keys = [...keys, newKey];

        if (newKey == "w") {
            if (jumpingTime <= 0) {
                jumpingTime = 1;
                player.y -= 1;
            }
        }

        if (newKey == "a") player.xDirection = "left";
        if (newKey == "d") player.xDirection = "right";
        if (newKey == " ") isShooting = true;
	}

    function handleKeyup(event) {
        const oldKey = event.key;
        keys = [..._.without(keys, oldKey)]
        if (oldKey == " ") isShooting = false;
    }

    renderable(async (props, dt) => {
        let {canvas, context, colliders} = props;
        // console.log(_.map(colliders, "name"))
        collisions = MegamanAnimation.checkCollisions(colliders, player);

        context.resetTransform();
        await running.load(context);
        await standing.load(context);
        await jumping.load(context);
  
        let v = characterVelocity.y;

        player.isRunning = isRunning;
        player.isFallingOrJumping = isFallingOrJumping;
        player.isShooting = isShooting
        jumpingTime = (v == -MegamanAnimation.vf) ? 0 : MegamanAnimation.vf - v;
        player.yDirection = (v < 0) ? "down" : "up";

        if (isFallingOrJumping) {
            player.y -= v;
        }
        if (!isFallingOrJumping) {
            const collision = _.find(collisions, c => (c.region == "top"));
            player.y = collision.y;
        }
        // console.log(player.y);
        if (isMovingLeft) player.x -= 10;
        if (isMovingRight) player.x += 10;

        if (isFallingOrJumping) jumping.draw(player, isShooting);
        if (isRunning && !isFallingOrJumping) running.draw(player, isShooting);
        if (!isRunning && !isFallingOrJumping) standing.draw(player, isShooting);
    })

</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup}/>

<BulletController 
    player={player}
    bullet={bullet}
    leftOffset={0}
    rightOffset={100}
    topOffset={45}
    startX={player.x}
    startY={player.y}
    direction={player.xDirection}
></BulletController>
<BoxCollider showBoundaries={false} name={"megaman"} x1={player.x} y1={player.y} width={100} height={100}></BoxCollider>