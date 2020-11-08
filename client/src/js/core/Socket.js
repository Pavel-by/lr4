import io from 'socket.io-client';
import AuthService from "./user/AuthService";
import MessageService from './MessageService.js';

const socket = io("/", {
    path: "/socket",
    query: {
        userId: AuthService.instance._userId != null ? AuthService.instance._userId : "",
    },
});

socket.on('error-message', (message) => {
   MessageService.error(message);
});

socket.on('success-message', (message) => {
    MessageService.success(message);
})

AuthService.instance.on(AuthService.EventChanged, () => {
    socket.close();
    socket.io.opts.query = {
        userId: AuthService.instance._userId != null ? AuthService.instance._userId : "",
    };
    socket.connect();
});

export default socket;