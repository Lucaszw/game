<script>
    import { renderable } from 'src/game.js';
    import _ from "lodash";
    
    let bullets = [];
    let colliders = [];

    export let startX;
    export let startY;
    export let bullet;
    export let direction;
    function handleKeyup(event) {
        const oldKey = event.key;
        if (oldKey == " ") {
            bullets.push({instance: bullet, x: startX, y: startY, direction: _.clone(direction)});
        }
    }

    renderable(async (props, dt) => {
        let {canvas, context} = props;

        await bullet.load(context);


        colliders = props.colliders;
        context.resetTransform();
        
        for (let _bullet of bullets) {
            // console.log("drawing", _bullet);
            _bullet.instance.draw(_bullet.x, _bullet.y);
            _bullet.x += (_bullet.direction.x == "left") ? -20 : 20;
        }
        // await running.load(context);
        // await standing.load(context);
        // await jumping.load(context);
    });

</script>

<svelte:window on:keyup={handleKeyup}/>
