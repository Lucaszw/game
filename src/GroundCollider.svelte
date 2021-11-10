<!-- Background from: https://imgur.com/t/super_nintendo/xAPngrS -->

<script>
    import { props, renderable, colliders as collidersStore } from './game.js';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store'

    let canvas, context;

    class LineCollider {
        constructor(x1, y1, x2, y2) {
            if (x1 > x2) throw "x1 must be less than x2";
            if (y1 > y2) throw "y1 must be less than y2";

            this.x1 = x1;
            this.x2 = x2;
            this.y1 = y1;
            this.y2 = y2;

            $collidersStore = [...$collidersStore, this];

        }

        width() {return this.x2 - this.x1};
        height() {return this.y2 - this.y1};

        draw() {
            context.resetTransform();
            context.beginPath();
            context.rect(this.x1, this.y1, this.width(), this.height());
            context.fillStyle = "green";
            context.fill();
            // context.fillRect(this.x1, this.y1, this.width(), this.height());
        }
    }


    let line1 = new LineCollider(0,500,300,550);
    let line2 = new LineCollider(200,800,900,850);

    renderable(props => {
        canvas = props.canvas;
        context = props.context; 
        line1.draw();
        line2.draw();

	});
</script>