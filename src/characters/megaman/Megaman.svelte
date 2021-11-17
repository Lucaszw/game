<script>
    import { renderable } from 'src/game.js';
    import _ from "lodash";
    import MegamanAnimation from './MegamanAnimation.js';
    import BulletController from "src/weapons/bullets/BulletController.svelte";
    import BoxCollider from "src/colliders/BoxCollider.svelte";

    import jumping from './animations/jumping';
    import running from './animations/running';
    import standing from './animations/standing';
    import bullet from "./artillery/bullet";

    let colliders = [];
	let keys = [];
    let characterDirection = {x: "right", y: "down"};
    let characterPosition = {x: 0, y: 100};
    let jumpingTime = 0;
    let isShooting = false;

    $: keyDown = (keys.length > 0);
    $: collision = MegamanAnimation.checkCollision(colliders, characterPosition);
    $: characterVelocity = {
        x: MegamanAnimation.characterVelocityX(),
        y: MegamanAnimation.characterVelocityY(jumpingTime)
    };

    // Character state
    $: isRunning = (keyDown == true && (_.includes(keys, "a") || _.includes(keys, "d")));
    $: isFallingOrJumping = !collision.hit || collision.region != "top";
    $: isMovingLeft = isRunning && characterDirection.x == "left";
    $: isMovingRight = isRunning && characterDirection.x == "right";

    function handleKeydown(event) {
        const newKey = event.key;
        keys = [...keys, newKey];

        if (newKey == "w") {
            if (jumpingTime <= 0) {
                jumpingTime = 1;
                characterPosition.y -= 1;
            }
        }

        if (newKey == "a") characterDirection.x = "left";
        if (newKey == "d") characterDirection.x = "right";
        if (newKey == " ") isShooting = true;
	}

    function handleKeyup(event) {
        const oldKey = event.key;
        keys = [..._.without(keys, oldKey)]
        if (oldKey == " ") isShooting = false;
    }

    renderable(async (props, dt) => {
        let {canvas, context} = props;
        colliders = props.colliders;
        context.resetTransform();
        await running.load(context);
        await standing.load(context);
        await jumping.load(context);

        let v = characterVelocity.y;

        jumpingTime = (v == -MegamanAnimation.vf) ? 0 : MegamanAnimation.vf - v;
        characterDirection.y = (v < 0) ? "down" : "up";
        if (isFallingOrJumping) characterPosition.y -= v;
        if (!isFallingOrJumping) characterPosition.y = collision.y;
        
        if (isMovingLeft) characterPosition.x -= 10;
        if (isMovingRight) characterPosition.x += 10;
        
        if (isFallingOrJumping) jumping.draw(characterPosition, characterDirection);
        if (isRunning && !isFallingOrJumping) running.draw(characterPosition, characterDirection, isShooting);
        if (!isRunning && !isFallingOrJumping) standing.draw(characterPosition, characterDirection, isShooting);
    })

</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup}/>

<BulletController bullet={bullet} startX={characterPosition.x+((characterDirection.x == "left") ? 0 : 100)} startY={characterPosition.y+45} direction={characterDirection}></BulletController>
<BoxCollider name={"megaman"} x1={characterPosition.x} y1={characterPosition.y} width={100} height={100}></BoxCollider>