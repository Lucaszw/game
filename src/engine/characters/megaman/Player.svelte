<script>
    import _ from "lodash";
    import { onMount } from 'svelte';

    import { renderable } from 'src/stores/engine.js';
    import { controller as controllerStore} from "src/stores/controller.js";
    import WeaponController from "src/stores/weapons.js";

    import MegamanAnimation from './MegamanAnimation.js';
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte";
    import Megaman from "src/engine/characters/megaman/Animation.svelte"
    import JumpingBehaviour from "src/engine/behaviours/jumping"
    import MovingBehaviour from "src/engine/behaviours/moving"

    import Bullet from "./weapons/bullet";
    
    let collisions = [];
    let pushingTime = 0;
    let vf = 200;
    let h0 = 0;
    let playerCollider;
    let acc = 20;
    let attack;
    let controller;

    export let player;
    export let type = "megaman";

    const jumpingBehaviour = new JumpingBehaviour(player)
    const movingBehaviour = new MovingBehaviour(player)
    jumpingBehaviour.vy = 20;
    jumpingBehaviour.vg = 20;

    // Character state
    $: isRunning = controller?.isMovingLeft() || controller?.isMovingRight();
    $: isMovingLeft = isRunning && player.xDirection == "left";
    $: isMovingRight = isRunning && player.xDirection == "right";

    controllerStore.subscribe((_controller) => {
        if (!_controller) return;

        controller = _controller;

        if (controller.isMovingLeft()) {
            player.xDirection = "left";
        }

        if (controller.isMovingRight()) {
            player.xDirection = "right";
        }

        if (controller.isMovingUp()) {
            const groundCollision = _.find(collisions, c => (c.region == "top"));
            if (groundCollision) {
                jumpingBehaviour.jump(player.y - 50);
            }
        }

        player.isGuarding = controller.keysDown["guard"];
        player.isShooting = controller.keysDown["attack1"];
    })

    onMount(() => {
        player.type = type;
        player.shieldHealth = 100;
        WeaponController.register("megaman", "bullet", Bullet);
    })

    const pushPlayer = _.debounce((attack) => {
        movingBehaviour.push(attack.region);
        jumpingBehaviour.jump(player.y - player.hits ** 1.2)
    }, 500, {leading: true, trailing: false});

    const restorePlayer = _.throttle(() => {
        player.deaths += 1;
        player.hits = 0;
        player.x = 0;
        player.y = 0;
    }, 2000, {leading: false, trailing: true});

    renderable(async (props) => {
        let {canvas, context, colliders} = props;
        const collider = playerCollider.collider;

        collisions = collider ? MegamanAnimation.checkCollisions(colliders, collider) : [];
        const ground = _.find(collisions, c => (c.region == "top"))
        const newAttack = _.find(collisions, (c) => (c.category == "weapon"));

        player.isFallingOrJumping = (collisions.length == 0) || !ground;

        if (newAttack) {
            attack = newAttack;
        }
        
        // let dx = vf*MegamanAnimation.getPushback(pushingTime/(vf/acc))/30;

        player.isRunning = isRunning;

        if (player.y > 1000) {
            restorePlayer();
        }

        if (player.isFallingOrJumping ||  jumpingBehaviour.vy < 0) {
            player.y +=  jumpingBehaviour.vy || jumpingBehaviour.vg;
        } else {
            player.y = ground?.y || player.y;
        }

        if (isMovingLeft) {
            player.x -= 8;
        } else if (isMovingRight) {
            player.x += 8;
        }

        player.x += (movingBehaviour.vx < 0) ? _.max([movingBehaviour.vx, -20]) : _.min([movingBehaviour.vx, 20])

        if (newAttack) {
            if (!player.isGuarding || player.shieldHealth < 0) {
                player.takingDamage = true
                player.hits += 1;
                pushPlayer(newAttack);
            }
        }

        if (player.isGuarding) {
            if (player.shieldHealth > -50) {
                player.shieldHealth -= 1;
            }
        } else {
            if (player.shieldHealth < 100) player.shieldHealth += 1;
        }


    })

</script>

<Megaman handleHits={true} player={player} />
<BoxCollider 
    bind:this={playerCollider} 
    direction={player.xDirection} 
    id={player.id} 
    showBoundaries={false} 
    name={"megaman"} 
    category={"player"}
    x1={player.x} 
    y1={player.y}
    width={100} 
    height={100}>
</BoxCollider>