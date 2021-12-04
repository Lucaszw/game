<script>
    import _ from "lodash";
    import BoxCollider from "src/engine/colliders/BoxCollider.svelte"
    import Animation from "src/engine/Animation"
    import {renderable} from "src/stores/engine"
    
    export let bot = {x: 0, y: 0, width: 100, height: 100};

    renderable(async (props) => {
        let {canvas, context, colliders} = props;
    })

</script>

<BoxCollider 
    showBoundaries={true}
    x1={bot.x}
    y1={bot.y}
    name={"follower"} 
    category={"player"}
    width={bot.width} 
    height={bot.height}>
</BoxCollider>
