<script>
    import { props, renderable, colliders as collidersStore } from 'src/store.js';
    import { onMount, onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    import _ from "lodash";

    let context;
    let collider;

    export let x1;
    export let y1;
    export let width;
    export let height;
    export let showBoundaries;

    class BoxCollider {
        constructor(showBoundaries = true) {
            $collidersStore = [...$collidersStore, this];
            this.showBoundaries = showBoundaries;
        }

        get x1() {return x1}
        get y1() {return y1}
        get x2() {return x1 + width}
        get y2() {return y1 + height}
        get width() {return width}
        get height() {return height}

        draw() {
            context.resetTransform();
            context.beginPath();
            context.rect(x1, y1, width, height);
            if (this.showBoundaries) {
                context.fillStyle = "green";
                context.fill();
            }
        }
    }

    onDestroy(() => {
        collider.id = Math.random()*1e16;
        _.remove($collidersStore, (c) => {
           return c.id == collider.id;
        });
        $collidersStore = [...$collidersStore];
	});

    renderable(props => {
        context = props.context;
        if (!collider) collider = new BoxCollider(showBoundaries);
        collider.draw(x1, y1, width, height);
	});
</script>