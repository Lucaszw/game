import { writable } from 'svelte/store';
import {io} from "socket.io-client";
import {
    socket as socketStore,
    players as playerStore
} from "../store.js";

class GameSocket {
    constructor() {
        this.socket = io("ws://localhost:5001");
        socketStore.set(this.socket);
        console.log("Connecting...")
        this.socket.on('connect', function (...args) {
            console.log("Connected! ", args);
        });
        this.socket.on('player-list-changed', function(players) {
            playerStore.set(players);
            console.log("Player list changed: ", players)
        })
    }
}

export default GameSocket;
