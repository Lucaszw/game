<script>
    import _ from "lodash";
    import Megaman from "src/engine/characters/megaman/Animation.svelte";
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte"

    export let bot = {
        x: 0, 
        y: 0, 
        width: 100, 
        height: 100,
        isRunning: false,
        isFallingOrJumping: false,
        xDirection: "left"
    };

    const playerTypes = {
		"megaman": Megaman
	}

</script>

<svelte:component this={playerTypes["megaman"][1]}  player={bot} />

<BoxCollider 
    showBoundaries={false}
    x1={bot.x}
    y1={bot.y}
    name={"follower"} 
    category={"player"}
    width={bot.width} 
    height={bot.height}>
</BoxCollider>
