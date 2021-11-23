<script>
    import { renderable, socket as socketStore } from 'src/store.js';
    import _ from "lodash";
    
    let bullets = [];
    let colliders = [];

    export let startX;
    export let startY;
    export let leftOffset;
    export let rightOffset;
    export let topOffset;
    export let bullet;
    export let direction;
    export let player;

    function handleKeyup(event) {
        const oldKey = event.key;
        if (oldKey == " ") {
            let bulletX = (direction == "left") ? startX + leftOffset : startX + rightOffset;
            let bulletY = startY + topOffset;
            bullets.push({instance: bullet, x: bulletX, y: bulletY, direction});
            player.fireBullet();
        }
    }

    socketStore.subscribe((gameSocket) => {
        gameSocket.socket.on("bullet-fired", (player) => {
            if (player.id == gameSocket.socket.id) return;
            let bulletX = (player.xDirection == "left") ? player.x + leftOffset : player.x + rightOffset;
            let bulletY = player.y + topOffset;

            bullets.push({instance: bullet, x: bulletX, y: bulletY, direction: player.xDirection});
        })
    });

    renderable(async (props, dt) => {
        let {canvas, context} = props;

        await bullet.load(context);


        colliders = props.colliders;
        context.resetTransform();
        
        for (let _bullet of bullets) {
            _bullet.instance.draw(_bullet.x, _bullet.y);
            _bullet.x += (_bullet.direction == "left") ? -20 : 20;
            if (_bullet.x > canvas.width || _bullet.x < 0) {
                _bullet.id = Math.random()*1e16
                _.remove(bullets, b => (b.id == _bullet.id))
            }
        }
    });

</script>

<svelte:window on:keyup={handleKeyup}/>
