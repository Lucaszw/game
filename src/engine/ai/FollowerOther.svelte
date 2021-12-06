<script>
    import _ from "lodash";
    import Woodcutter from "src/engine/characters/woodcutter/Woodcutter.svelte"
    import Megaman from "src/engine/characters/megaman/Megaman.svelte";
    import WoodcutterOther from "src/engine/characters/woodcutter/WoodcutterOther.svelte"
    import MegamanOther from "src/engine/characters/megaman/MegamanOther.svelte"
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte"
    import Animation from "src/engine/Animation"
    import {renderable} from "src/stores/engine"
    
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
		"megaman": [Megaman, MegamanOther],
		"woodcutter": [Woodcutter, WoodcutterOther]
	}

    renderable(async (props) => {
        let {canvas, context, colliders} = props;
    })

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
