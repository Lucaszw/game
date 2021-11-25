import App from './App.svelte';
import GameSocket from './store/socket.js';

GameSocket.initialize();

const app = new App({
	target: document.body,
	props: {}
});

export default app;