<script>
    import { renderable } from 'src/stores/engine.js';
    import {socket as socketStore} from 'src/stores/socket.js';
    import {controller as controllerStore} from 'src/stores/controller.js';
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte"

    import _ from "lodash";
    
    let hitBox = null;

    export let startX;
    export let startY;
    export let leftOffset;
    export let rightOffset;
    export let topOffset;
    export let HitBox;
    export let direction;
    export let player;
</script>