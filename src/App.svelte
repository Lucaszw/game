<script>
	import Megaman from './engine/characters/megaman/Megaman.svelte';
	import Background from './engine/Background.svelte';
	import Canvas from './engine/Canvas.svelte';
	import GroundCollider from './engine/GroundCollider.svelte';

	import {players} from "./store"
</script>

<main>
	<Canvas>
		<Background></Background>
		<GroundCollider></GroundCollider>
		<Megaman></Megaman>
	</Canvas>
	<div class="player-list">
		{#each $players as player}
			{player} <br/>
		{/each}
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	.player-list {
		position: fixed;
		top: 0px;
		left: 0px;
		color: red;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>