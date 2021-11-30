<script>
	import {onMount} from "svelte";

	import Megaman from './engine/characters/megaman/Megaman.svelte';
	import MegamanOther from './engine/characters/megaman/MegamanOther.svelte';
	import Background from './engine/Background.svelte';
	import Canvas from './engine/Canvas.svelte';
	import GroundCollider from './engine/GroundCollider.svelte';
	import {
		uniqueNamesGenerator,
		adjectives,
		animals
	} from 'unique-names-generator';

	const dictionaries = [adjectives, animals];

	import {players} from "./stores/socket";
	import {controller as controllerStore} from "./stores/controller";

	function getHash(input){
		var hash = 0, len = input.length;
		for (var i = 0; i < len; i++) {
			hash  = ((hash << 5) - hash) + input.charCodeAt(i);
			hash |= 0; // to 32bit integer
		}
		return hash;
	}

	function getPlayerName(id) {
		return uniqueNamesGenerator({
			dictionaries,
			seed: getHash(id),
			separator: " ",
			style: "capital"
		});
	}

	onMount(() => {
		controllerStore.subscribe((controller) => {
			controller.initialize("joy");
		})
	})

</script>

<main>
	<div id="joy"></div>
	<Canvas>
		<Background></Background>
		<GroundCollider></GroundCollider>
		{#each $players as player}
			{#if player.isMyself}
				<Megaman {player}></Megaman>
			{:else}
				<MegamanOther {player}></MegamanOther>
			{/if}
		{/each}
	</Canvas>
	<div class="player-list">
		{#each $players as player}
			<b class:selected={player.isMyself}>{getPlayerName(player.id)}</b> {player.hits}<br/>
		{/each}
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 0px;
		margin: 0 auto;
		background: black;
	}

	.player-list {
		position: fixed;
		top: 0px;
		left: 0px;
		color: red;
		text-align: left;
	}
	.selected {
		color: green;
	}

	#joy {
		width:200px;
		height:200px;
		margin-bottom:20px;
		position:fixed;
		bottom:0px;
	}

</style>