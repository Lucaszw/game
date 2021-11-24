<script>
    import { renderable, colliders as collidersStore } from 'src/store.js';
    import Animation from "../Animation";

    import { onDestroy } from 'svelte';
    import _ from "lodash";

    let context;
    let collider;

    export let x1;
    export let y1;
    export let width;
    export let height;
    export let showBoundaries;
    export let name;
    export let ownerId;
    class BoxCollider {
        constructor(showBoundaries = true) {
            $collidersStore = [...$collidersStore, this];
            this.showBoundaries = showBoundaries;
        }
        get name() {return name}
        get ownerId() {return ownerId}
        get x1() {return x1}
        get y1() {return y1}
        get x2() {return x1 + width}
        get y2() {return y1 + height}
        get width() {return width}
        get height() {return height}

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