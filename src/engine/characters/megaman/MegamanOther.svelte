<script>
    import { renderable } from 'src/store.js';
    import _ from "lodash";
    import MegamanAnimation from './MegamanAnimation.js';
    import BulletController from "src/engine/weapons/bullets/BulletController.svelte";
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte";

    import jumping from './animations/jumping';
    import running from './animations/running';
    import standing from './animations/standing';
    import hit from './animations/hit';
    import shield from './artillery/shield'

    export let player;

    renderable(async (props, dt) => {
        let {canvas, context} = props;

        await running.load(context);
        await standing.load(context);
        await jumping.load(context);
        await hit.load(context);
        await shield.load(context);
        
        const isRunning = player.isRunning;
        const isFallingOrJumping = player.isFallingOrJumping;

        if (player.takingDamage == true) {
            hit.draw(player);
            return;
        }

        if (isFallingOrJumping) jumping.draw(player);
        if (isRunning && !isFallingOrJumping) running.draw(player);
        if (!isRunning && !isFallingOrJumping) standing.draw(player);

        if (player.isGuarding) {
            shield.draw(player);
        }
    })
</script>

<BoxCollider id={player.id} showBoundaries={false} name={"megaman"} x1={player.x} y1={player.y} width={100} height={100}></BoxCollider>
