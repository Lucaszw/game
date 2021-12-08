<script>
    import {onMount} from 'svelte';
    import { renderable } from 'src/stores/engine.js';
    import _ from "lodash";
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte";

    import jumping from './animations/jumping';
    import running from './animations/running';
    import standing from './animations/standing';
    import hit from './animations/hit';

    import shield from './weapons/shield'
    export let player;
    export let type="woodcutter";
    onMount(() => {
        player.type = type;
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

        if (isFallingOrJumping) {
            const imgName = player.yDirection == "up" ? "jumping-up" : "jumping-down";
            jumping.draw(player, imgName);
        }

        if (isRunning && !isFallingOrJumping) running.draw(player);
        if (!isRunning && !isFallingOrJumping) standing.draw(player);

        if (player.isGuarding) {
            shield.draw(player);
        }
    })
</script>

<BoxCollider 
    id={player.id} 
    showBoundaries={false} 
    name={"woodcutter"}
    category={"player"}
    x1={player.x} 
    y1={player.y} 
    width={100} 
    height={100}>
</BoxCollider>
