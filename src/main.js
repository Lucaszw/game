import App from './App.svelte';
import GameSocket from './services/socket.js';
import {socket as socketStore} from './store.js';

const gameSocket = new GameSocket();
socketStore.set(gameSocket);

const app = new App({
	target: document.body,
	props: {}
});

export default app;