<script>
    import { renderable } from 'src/store.js';
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
            _bullet.instance.draw(_bullet.x, _bullet.y);
            _bullet.x += (_bullet.direction.x == "left") ? -20 : 20;
            if (_bullet.x > canvas.width || _bullet.x < 0) {
                _bullet.id = Math.random()*1e16
                _.remove(bullets, b => (b.id == _bullet.id))
            }
        }
    });

</script>

<svelte:window on:keyup={handleKeyup}/>
