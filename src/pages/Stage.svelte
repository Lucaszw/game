<script>
	import randomInt from 'random-int';
	import Woodcutter from "src/engine/characters/woodcutter/Player.svelte";
	import WoodcutterOther from "src/engine/characters/woodcutter/Animation.svelte"
	import Megaman from 'src/engine/characters/megaman/Player.svelte';
	import MegamanOther from 'src/engine/characters/megaman/Animation.svelte';
	import Follower from 'src/engine/ai/Follower.svelte';
	import FollowerOther from 'src/engine/ai/FollowerOther.svelte';

	import Background from 'src/engine/Background.svelte';
	import Canvas from 'src/engine/Canvas.svelte';
	import GroundCollider from 'src/engine/GroundCollider.svelte';
	import Joystick from 'src/Joystick.svelte';

	import BulletController from "src/engine/weapons/bullets/BulletController.svelte";
	import MeleeWeapon from "src/engine/weapons/melee/MeleeWeapon.svelte";

    import {players, bot} from "src/stores/socket";

	import {
		uniqueNamesGenerator,
		adjectives,
		animals
	} from 'unique-names-generator';

	const dictionaries = [adjectives, animals];
    const urlParams = new URLSearchParams(window.location.search);

    const characterName = urlParams.get('player');


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
    
    const playerType = playerTypes[characterName] ? characterName : ["megaman", "woodcutter"][randomInt(0,1)];


</script>

<main>
	<Joystick></Joystick>
	<Canvas>
		<Background></Background>
		<GroundCollider></GroundCollider>
		{#each $players as player}
			{#if player.isMyself}
				<svelte:component type={playerType} this={playerTypes[playerType][0]}  {player} />
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
					startX={player.x}a
					startY={player.y}
					direction={player.xDirection}
				></MeleeWeapon>
			{:else if player.type}
				<svelte:component type={player.type} this={playerTypes[player.type][1]}  {player} />
			{/if}
		{/each}
		{#if $bot?.isMyself}
			<Follower bot={$bot}></Follower>
		{:else if $bot?.type}
			<FollowerOther bot={$bot}></FollowerOther>
		{/if}
	</Canvas>
	<div class="player-list">
		{#each $players as player}
			<b class:selected={player.isMyself}>{getPlayerName(player.id)}</b> 
			{player.hits} {showDeaths(player.deaths)}
			<br/>
		{/each}
		{#if $bot}
			<b class:selected={$bot?.isMyself}>{getPlayerName(1+$bot.id)}</b> 
			{$bot.hits} {showDeaths($bot.deaths)}
			<br/>
		{/if}
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