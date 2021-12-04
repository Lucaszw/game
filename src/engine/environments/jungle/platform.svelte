<script>
    import _ from "lodash";
    import { renderable } from 'src/stores/engine.js';
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte"
    import Animation from "src/engine/Animation.js"
    import randomInt from "random-int";
    export let x;
    export let y;
    export let width;
    export let height = 50;

    $: numTiles = parseInt(width/height)
    $: pixelWidth = numTiles * height;
    $: pixelHeight = height;

    const leftImage = "/environments/jungle/platform/leftside.png";
    const middleImages = _.map(_.range(1,3), (i) => (`/environments/jungle/platform/middle${i}.png`));
    const rightImage = "/environments/jungle/platform/rightside.png";

    class JunglePlatform extends Animation {
        constructor() {
            super();
            const spriteWidth = 48;
            const spriteHeight = 48;
            this.imageURLS = [
                {url: leftImage, name: "left", spriteWidth, spriteHeight},
                {url: middleImages[0], name: "middle1", spriteWidth, spriteHeight},
                {url: middleImages[1], name: "middle2", spriteWidth, spriteHeight},
                {url: rightImage, name: "right", spriteWidth, spriteHeight}
            ]
            this.tileNames = [];
        }
        drawTile(name, xOffset) {
            let image = this.images[name];
            const w = image.spriteWidth;
            const h = image.spriteHeight;
            this.context.drawImage(image.image, 0, 0, w, h, x + xOffset, y, height, height);
        }

        getTileNames(i) {
            if (i == 0) return "left";
            if (i == numTiles-1) return "right"
            if (this.tileNames[i]) return this.tileNames[i];
            this.tileNames[i] = `middle${randomInt(1, 2)}`;
            return this.tileNames[i];
        }
        draw() {
            // const image = this.images[imageName];
            this.context.resetTransform();
            let scale = this.getScaleFactor();
            this.context.scale(scale/this.pixelsX, scale/this.pixelsY);

            let name;
            for (let i=0;i<numTiles;i++) {
                name = this.getTileNames(i);
                this.drawTile(name, height * i);
            }
            this.context.resetTransform();
        }
    }

    const platform = new JunglePlatform();

    renderable(async (props) => {
        const {context} = props;
        await platform.load(props.context);
        platform.draw();
    })
</script>

<BoxCollider 
    showBoundaries={false}
    x1={x} 
    y1={y}
    width={pixelWidth} 
    height={pixelHeight}>
</BoxCollider>