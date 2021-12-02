<script>
    import { renderable } from 'src/stores/engine.js';
    import {socket as socketStore} from 'src/stores/socket.js';
    import {controller as controllerStore} from 'src/stores/controller.js';
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte"
    import WeaponController from "src/stores/weapons";

    import _ from "lodash";
    import bb from "bluebird";

    let hitBoxes = [];
    export let startX;
    export let startY;
    export let leftOffset;
    export let rightOffset;
    export let topOffset;
    export let direction;
    export let player;

    
    const removeHitbox = (hitBox) => {
        hitBox.id = hitBox.id || Math.random()*1e16
        _.remove(hitBoxes, h => (h.id == hitBox.id))
        hitBoxes = [...hitBoxes]
    }

    const attack = (p) => {
        const direction = p.xDirection;
        let boxX = (direction == "left") ? p.x + leftOffset : p.x + rightOffset;
        let boxY = p.y;

        // let bullet = new Bullet();
        let hitBox = {id: Math.random()*1e16, ownerId: p.id, x: boxX, y: boxY, direction};
        hitBoxes = [...hitBoxes, hitBox];
        setTimeout(() => {
            removeHitbox(hitBox);
        }, 75);
    }

    controllerStore.subscribe(async (controller) => {
        if (controller.keysDown["attack1"] && !controller.keysDown["guard"]) {
            const startTime = controller.keysDown["attack1"];
            let interval;
            interval = setInterval(() => {
                if (controller.keysDown["attack1"] != startTime) {
                    clearInterval(interval);
                    return;
                }

                let Weapon = WeaponController.getWeapon(player.type, "melee")
                if (!Weapon) return;

                attack(player);
                player.swingWeapon();
            }, 600);
        }
    });

    socketStore.subscribe((socket) => {
        socket.on("weapon-swung", (player2) => {
            if (player2.id == socket.id) return;
            attack(player2);
        })
    });

    const handleCollision = function() {
    }
</script>

{#each hitBoxes as hitBox}
    <BoxCollider 
        id={hitBox.id} 
        direction={hitBox.direction} 
        checkCollisions={true} 
        on:collision={handleCollision} 
        ownerId={hitBox.ownerId} 
        showBoundaries={false} 
        name={"hitbox"}
        category={"weapon"}
        x1={hitBox.x} 
        y1={hitBox.y} 
        width={20} 
        height={100}
    ></BoxCollider>
{/each}