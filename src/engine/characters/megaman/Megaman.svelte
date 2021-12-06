<script>
    import _ from "lodash";
    import { onMount } from 'svelte';

    import { renderable } from 'src/stores/engine.js';
    import { controller as controllerStore} from "src/stores/controller.js";
    import WeaponController from "src/stores/weapons.js";

    import MegamanAnimation from './MegamanAnimation.js';
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte";

    import jumping from './animations/jumping';
    import running from './animations/running';
    import standing from './animations/standing';
    import hit from "./animations/hit";

    import shield from "./weapons/shield";
    import Bullet from "./weapons/bullet";
    

    let collisions = [];
    let jumpingTime = 0;
    let pushingTime = 0;
    let vf = 200;
    let h0 = 0;
    let playerCollider;
    let acc = 20;
    let attack;
    let controller;

    export let player;
    export let type = "megaman";

    // Character state
    $: isRunning = controller?.isMovingLeft() || controller?.isMovingRight();
    $: isFallingOrJumping = (collisions.length == 0) || !_.find(collisions, (c) => (c.region == "top"));
    $: isMovingLeft = isRunning && player.xDirection == "left";
    $: isMovingRight = isRunning && player.xDirection == "right";

    controllerStore.subscribe((_controller) => {
        controller = _controller;

        if (controller.isMovingLeft()) {
            player.xDirection = "left";
        }

        if (controller.isMovingRight()) {
            player.xDirection = "right";
        }

        if (controller.isMovingUp()) {
            const groundCollision = _.find(collisions, c => (c.region == "top"));
            if (groundCollision && jumpingTime <= 0) {
                jumpingTime = 1;
                h0 = player.y;
                player.y -= 1;
                vf = 200;
                acc = 20;
            }
        }

        player.isGuarding = controller.keysDown["guard"];
        player.isShooting = controller.keysDown["attack1"];
    })

    onMount(() => {
        player.type = type;
        hit.on("animation:ended", () => {
            player.takingDamage = false;
        });
        player.shieldHealth = 100;
        WeaponController.register("megaman", "bullet", Bullet);
    })

    const pushPlayer = _.debounce((bullet) => {
        jumpingTime = 1;
        pushingTime = 1;
        h0 = player.y;
        player.y -= 1;
        acc = 30;
        vf = player.hits ** 1.3;
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

        const newAttack = _.find(collisions, (c) => (c.category == "weapon"));
        if (newAttack) {
            attack = newAttack;
        }
        
        await running.load(context);
        await standing.load(context);
        await jumping.load(context);
        await hit.load(context);
        await shield.load(context);
        context.resetTransform();

        let dy0 = vf*MegamanAnimation.getHeight((jumpingTime-1)/(vf/acc));
        let dy = vf*MegamanAnimation.getHeight(jumpingTime/(vf/acc));

        let dx = vf*MegamanAnimation.getPushback(pushingTime/(vf/acc))/30;
        let h = h0 - dy;

        player.isRunning = isRunning;
        player.isFallingOrJumping = isFallingOrJumping;
        player.yDirection = ((dy < dy0)|| jumpingTime <= 0) ? "down" : "up";

        if (player.y > 1000) {
            restorePlayer();
        }

        if (isFallingOrJumping && dy > 0 ) {
            player.y = h;
            jumpingTime += 1;
        } else if (isFallingOrJumping){
            player.y +=  20;
        } else {
            jumpingTime = 0;
            const collision = _.find(collisions, c => (c.region == "top"));
            player.y = collision.y;
        }

        if (pushingTime > 0 && attack.region == "left") {
            player.x -= dx;
            pushingTime += 1;
        } else if (pushingTime > 0 && attack.region == "right") {
            player.x += dx;
            pushingTime += 1;
        }

        if (isMovingLeft) {
            player.x -= 8;
        } else if (isMovingRight) {
            player.x += 8;
        } 
        
        if (!isFallingOrJumping) {
            vf = 200;
            acc = 20;
        }

        if (newAttack) {
            if (!player.isGuarding || player.shieldHealth < 0) {
                player.takingDamage = true
                player.hits += 1;
                pushPlayer();
            }
        }

        if (player.takingDamage) {
            hit.draw(player);
            return;
        }

        if (isFallingOrJumping) jumping.draw(player);
        if (isRunning && !isFallingOrJumping) running.draw(player);
        if (!isRunning && !isFallingOrJumping) standing.draw(player);
        if (player.isGuarding) {
            if (player.shieldHealth > -50) {
                player.shieldHealth -= 1;
            }
            shield.draw(player);
        } else {
            if (player.shieldHealth < 100) player.shieldHealth += 1;
        }
    })

</script>

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