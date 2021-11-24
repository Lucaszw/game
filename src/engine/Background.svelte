<!-- Background from: https://imgur.com/t/super_nintendo/xAPngrS -->

<script>
    import { props, renderable } from '../store.js';
    import { onMount } from 'svelte';
    import Animation from "./Animation"

    let image;

    let loadBackground = async function () {
        return new Promise((res, rej) => {
            const image = new Image();
            image.src = "/background.png";
            image.onload = drawImage;
            async function drawImage() {
                res (this);
            }
        });
    };

    loadBackground().then((_image) => {
        image = _image;
    });

    renderable(props => {
        const {canvas, context, width, height} = props;
        if (!image) return;
        const scale = Animation.getScaleFactor(context);
        context.resetTransform();
        context.scale(scale/Animation.pixelsX, scale/Animation.pixelsY);
        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, 1000, 1000);
        context.resetTransform();
	});
</script>