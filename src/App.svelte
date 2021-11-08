<script>
	export let name;

	import Megaman from './Megaman.svelte';
</script>

<main>
	<Megaman></Megaman>
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