<script>
    import _ from "lodash";
    import { onMount } from 'svelte';

    import { renderable } from 'src/stores/engine.js';
    import WeaponController from "src/stores/weapons.js";

    import BoxCollider from "src/engine/colliders/BoxCollider.svelte";

    import jumping from './animations/jumping';
    import running from './animations/running';
    import standing from './animations/standing';
    import hit from './animations/hit';
    import shield from './artillery/shield'
    import Bullet from './artillery/bullet'

    export let player;

    onMount(()=> {
        WeaponController.register("megaman", "bullet", Bullet);
    });

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
