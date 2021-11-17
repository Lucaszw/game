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

    class BoxCollider {
        constructor() {
            $collidersStore = [...$collidersStore, this];
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
            context.fillStyle = "green";
            context.fill();
            // context.fillRect(this.x1, this.y1, this.width(), this.height());
        }
    }

    renderable(props => {
        context = props.context;
        if (!collider) collider = new BoxCollider(x1, y1, width, height);
        collider.draw(x1, y1, width, height);
	});
</script>