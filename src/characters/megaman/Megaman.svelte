<script>
    import { renderable } from 'src/game.js';
    import _ from "lodash";
    import MegamanAnimation from './MegamanAnimation.js';

    import jumping from './animations/jumping';
    import running from './animations/running';
    import standing from './animations/standing';

    let colliders = [];
	let keys = [];
    let characterDirection;
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
    $: isMovingLeft = isRunning && characterDirection == "left";
    $: isMovingRight = isRunning && characterDirection == "right";

    function handleKeydown(event) {
        const newKey = event.key;
        keys = [...keys, newKey];

        if (newKey == "w") {
            if (jumpingTime <= 0) {
                jumpingTime = 1;
                characterPosition.y -= 1;
            }
        }

        if (newKey == "a") characterDirection = "left";
        if (newKey == "d") characterDirection = "right";
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

        if (isFallingOrJumping) characterPosition.y -= v;
        if (!isFallingOrJumping) characterPosition.y = collision.y;
        
        if (isMovingLeft) characterPosition.x -= 10;
        if (isMovingRight) characterPosition.x += 10;
        
        if (isFallingOrJumping) jumping.draw(characterPosition, characterDirection);
        if (isRunning && !isFallingOrJumping) running.draw(characterPosition, characterDirection, isShooting);
        if (!isRunning && !isFallingOrJumping) standing.draw(characterPosition, characterDirection);
    })

</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup}/>