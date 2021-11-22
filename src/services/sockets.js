import { writable } from 'svelte/store';
import {io} from "socket.io-client";
import {socket as socketStore} from "../store.js";

const socket = io("http://localhost");
socketStore.set(socket);