<script>
    import { renderable } from 'src/stores/engine.js';
    import {socket as socketStore} from 'src/stores/socket.js';
    import {controller as controllerStore} from 'src/stores/controller.js';
    import WeaponController from 'src/stores/weapons.js';

    import BoxCollider from "src/engine/colliders/BoxCollider.svelte"

    import _ from "lodash";
    
    let bullets = [];
    let colliders = [];

    export let startX;
    export let startY;
    export let leftOffset;
    export let rightOffset;
    export let topOffset;
    export let direction;
    export let player;

    controllerStore.subscribe((controller) => {
        if (controller.keysReleased["attack1"] && !controller.keysDown["guard"]) {
            const Bullet = WeaponController.getWeapon(player.type, "bullet");
            if (!Bullet) return;

            let bulletX = (direction == "left") ? startX + leftOffset : startX + rightOffset;
            let bulletY = startY + topOffset;

            let bullet = new Bullet();
            bullets = [...bullets, {id: Math.random()*1e16, ownerId: player.id, instance: bullet, x: bulletX, y: bulletY, direction}];
            player.fireBullet();
        }
    });

    socketStore.subscribe((socket) => {
        socket.on("bullet-fired", (player2) => {
            if (player2.id == socket.id) return;
            let bulletX = (player2.xDirection == "left") ? player2.x + leftOffset : player2.x + rightOffset;
            let bulletY = player2.y + topOffset;
            const Bullet = WeaponController.getWeapon(player2.type, "bullet");

            let bullet = new Bullet();
            bullets = [...bullets, {id: Math.random()*1e16, ownerId: player2.id, instance: bullet, x: bulletX, y: bulletY, direction: player2.xDirection}];
        })
    });

    const removeBullet = (bullet) => {
        bullet.id = bullet.id || Math.random()*1e16
        _.remove(bullets, b => (b.id == bullet.id))
    }

    renderable(async (props, dt) => {
        let {canvas, context} = props;

        colliders = props.colliders;
        
        context.resetTransform();
        
        for (let bullet of bullets) {
            await bullet.instance.load(context);
            bullet.instance.draw(bullet.x, bullet.y, bullet.isExploding);

            if (!bullet.isExploding) {
                bullet.x += (bullet.direction == "left") ? -20 : 20;
            }
            if (bullet.x > 1000 || bullet.x < 0) {
                removeBullet(bullet);
            }
        }

        bullets = [...bullets];
    });

    function handleCollision(event) {
        const {id} = event.detail;
        const bullet = _.find(bullets, {id});
        if (!bullet) return;
        bullet.isExploding = true;
        bullet.instance.once("animation:ended", (...args) => {
            removeBullet({id});
            bullets = [...bullets];
        })

    }

</script>

{#each bullets as bullet}
    <BoxCollider 
        id={bullet.id} 
        direction={bullet.direction} 
        checkCollisions={true} 
        on:collision={handleCollision} 
        ownerId={bullet.ownerId} 
        showBoundaries={false} 
        name={"bullet"}
        category={"weapon"}
        x1={bullet.x} 
        y1={bullet.y} 
        width={20} 
        height={20}
    ></BoxCollider>
{/each}
