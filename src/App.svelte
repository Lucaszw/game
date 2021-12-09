<script>
	import { Router, Route, Link } from "svelte-navigator";
	import Stage from "src/pages/Stage.svelte"
</script>


<Router>
	<Route path="/">
		<b>Select a character</b>
		<Link to="stages/sample?player=megaman">Megaman</Link>
		<Link to="stages/sample?player=woodcutter">Woodcutter</Link>
	</Route>

	<Route path="/stages/sample">
		<Stage />
	</Route>
</Router>