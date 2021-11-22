import App from './App.svelte';
import GameSocket from './services/socket.js';

const gameSocket = new GameSocket();

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;