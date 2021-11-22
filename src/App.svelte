<script>
	import Megaman from './engine/characters/megaman/Megaman.svelte';
	import Background from './engine/Background.svelte';
	import Canvas from './engine/Canvas.svelte';
	import GroundCollider from './engine/GroundCollider.svelte';
</script>

<main>
	<Canvas>
		<Background></Background>
		<GroundCollider></GroundCollider>
		<Megaman></Megaman>
	</Canvas>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>