<script>
	import Megaman from './Megaman.svelte';
	import Canvas from './Canvas.svelte';
</script>

<main>
	<Canvas>
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