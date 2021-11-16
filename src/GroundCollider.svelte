<!-- Background from: https://imgur.com/t/super_nintendo/xAPngrS -->

<script>
    import { props, renderable, colliders as collidersStore } from './game.js';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store'

    let canvas, context;

    class LineCollider {
        constructor(x1, y1, width, height) {
            if (width <= 0) throw "width must be > 0";
            if (height <= 0) throw "height must be > 0";

            this.x1 = x1;
            this.x2 = x1 + width;
            this.y1 = y1;
            this.y2 = y1 + height;

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


    let line1 = new LineCollider(0,500,300,50);
    let line2 = new LineCollider(200,800,700,50);
    let line3 = new LineCollider(900,700,700,50);

    renderable(props => {
        canvas = props.canvas;
        context = props.context; 
        line1.draw();
        line2.draw();
        line3.draw();

	});
</script>