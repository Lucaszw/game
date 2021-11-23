<script>
	import Megaman from './engine/characters/megaman/Megaman.svelte';
	import MegamanOther from './engine/characters/megaman/MegamanOther.svelte';
	import Background from './engine/Background.svelte';
	import Canvas from './engine/Canvas.svelte';
	import GroundCollider from './engine/GroundCollider.svelte';

	import {players} from "./store"
</script>

<main>
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
			<b class:selected={player.isMyself}>{player.id}</b> <br/>
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
	.selected {
		color: green;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>