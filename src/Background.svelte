<!-- Background from: https://imgur.com/t/super_nintendo/xAPngrS -->

<script>
    import { props, renderable } from './game.js';
    import { onMount } from 'svelte';

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
        
        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
	});
</script>