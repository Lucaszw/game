<script>
    import { renderable, colliders as collidersStore } from 'src/stores/engine.js';
    import Animation from "../Animation";
    import { onDestroy, createEventDispatcher } from 'svelte';
    import _ from "lodash";

    const dispatch = createEventDispatcher();

    let context;
    export let collider;

    export let checkCollisions = false;
    export let direction = null;
    export let x1;
    export let y1;
    export let width;
    export let height;
    export let showBoundaries;
    export let name;
    export let ownerId;
    export let id;

    class BoxCollider {
        constructor(showBoundaries = true) {
            $collidersStore = [...$collidersStore, this];
            this.showBoundaries = showBoundaries;
        }
        get name() {return name}
        get ownerId() {return ownerId}
        get id() {return id}
        get x1() {return x1}
        get y1() {return y1}
        get x2() {return x1 + width}
        get y2() {return y1 + height}
        get width() {return width}
        get height() {return height}
        get direction() {return direction}

        draw() {
            const scale = Animation.getScaleFactor(context);
            context.resetTransform();
            context.beginPath();
            context.scale(scale/Animation.pixelsX, scale/Animation.pixelsY);
            context.rect(x1, y1, width, height);
            if (this.showBoundaries) {
                context.fillStyle = "green";
                context.fill();
            }
            context.resetTransform();
        }
    }

    onDestroy(() => {
        collider._id = Math.random()*1e16;
        _.remove($collidersStore, (c) => {
           return c._id == collider._id;
        });
        $collidersStore = [...$collidersStore];
	});

    renderable(props => {
        context = props.context;
        const colliders = props.colliders;

        if (!collider) collider = new BoxCollider(showBoundaries);

        if (showBoundaries) {
            collider.draw(x1, y1, width, height);
        }

        if (checkCollisions) {
            const collisions = Animation.checkCollisions(colliders, collider);
            if (collisions.length > 0) {
                dispatch('collision', {collisions, id});
            }
        }
	});
</script>
<svelte:options accessors={true}/>
