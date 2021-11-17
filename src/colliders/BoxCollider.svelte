<script>
    import { props, renderable, colliders as collidersStore } from 'src/game.js';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store'

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

    renderable(props => {
        context = props.context;
        if (!collider) collider = new BoxCollider(showBoundaries);
        collider.draw(x1, y1, width, height);
	});
</script>