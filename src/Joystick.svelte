<script>
    import {controller as controllerStore} from "./stores/controller";
    import {onMount} from "svelte";
    let controller;

    onMount(() => {
		controllerStore.subscribe((_controller) => {
            controller = _controller;
			controller.initialize("joy");
		})
	})

</script>

<div id="container">
    <div id="joy"></div>
    <div id="right-controls">
        <div id="action-button" 
            on:mousedown={controller?.handleActionButton?.bind(controller)}
            on:mouseup={controller?.handleActionButton?.bind(controller)}
            on:touchstart={controller?.handleActionButton?.bind(controller)}
            on:touchend={controller?.handleActionButton?.bind(controller)}
        ></div>
        <div id="guard-button"
            on:mousedown={controller?.handleGuardButton?.bind(controller)}
            on:mouseup={controller?.handleGuardButton?.bind(controller)}
            on:touchstart={controller?.handleGuardButton?.bind(controller)}
            on:touchend={controller?.handleGuardButton?.bind(controller)}
        ></div>
    </div>
</div>

<style>

    #container {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        z-index: 100;
    }
    #right-controls {
        width: 200px;
        height: 200px;
        position: fixed;
        right: 0px;
        bottom: 0px;
    }

    #action-button {
        background: green;
        border-radius: 100px;
        width: 100px;
        height: 100px;
        position: absolute;
        top:0px;
        left:0px;
    }
    #action-button:active {
        background: darkgreen;
    }

    #guard-button {
        background: red;
        border-radius: 100px;
        width: 100px;
        height: 100px;
        position: absolute;
        bottom:0px;
        right:0px;
    }

    #guard-button:active {
        background: darkred;
    }
    

    #joy {
		width:200px;
		height:200px;
		margin-bottom:20px;
		position:fixed;
		bottom:0px;
	}
</style>