<script>
	import Woodcutter from "./engine/characters/woodcutter/Woodcutter.svelte";
	import WoodcutterOther from "./engine/characters/woodcutter/WoodcutterOther.svelte"
	import Megaman from './engine/characters/megaman/Megaman.svelte';
	import MegamanOther from './engine/characters/megaman/MegamanOther.svelte';
	import Follower from './engine/ai/Follower.svelte';
	import FollowerOther from './engine/ai/FollowerOther.svelte';

	import Background from './engine/Background.svelte';
	import Canvas from './engine/Canvas.svelte';
	import GroundCollider from './engine/GroundCollider.svelte';
	import Joystick from './Joystick.svelte';

	import BulletController from "src/engine/weapons/bullets/BulletController.svelte";
	import MeleeWeapon from "src/engine/weapons/melee/MeleeWeapon.svelte";

	import {
		uniqueNamesGenerator,
		adjectives,
		animals
	} from 'unique-names-generator';

	const dictionaries = [adjectives, animals];

	import {players, bot} from "./stores/socket";

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

	function showDeaths(deaths) {
		let s = "";
		for (let i=0;i<deaths;i++) {
			s += `x`;
		}
		return s;
	}

	const playerTypes = {
		"megaman": [Megaman, MegamanOther],
		"woodcutter": [Woodcutter, WoodcutterOther]
	}

</script>

<main>
	<Joystick></Joystick>
	<Canvas>
		<Background></Background>
		<GroundCollider></GroundCollider>
		{#each $players as player}
			{#if player.isMyself}
				<svelte:component this={playerTypes[player.type][0]}  {player} />
				<BulletController 
					player={player}
					leftOffset={0}
					rightOffset={100}
					topOffset={45}
				></BulletController>
				<MeleeWeapon
					player={player}
					leftOffset={0}
					rightOffset={100}
					topOffset={45}
					startX={player.x}
					startY={player.y}
					direction={player.xDirection}
				></MeleeWeapon>
			{:else}
				<svelte:component this={playerTypes[player.type][1]}  {player} />
			{/if}
		{/each}
		{#if $bot?.isMyself}
			<Follower bot={$bot}></Follower>
		{:else if $bot}
			<FollowerOther bot={$bot}></FollowerOther>
		{/if}
	</Canvas>
	<div class="player-list">
		{#each $players as player}
			<b class:selected={player.isMyself}>{getPlayerName(player.id)}</b> 
			{player.hits} {showDeaths(player.deaths)}
			<br/>
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

</style>