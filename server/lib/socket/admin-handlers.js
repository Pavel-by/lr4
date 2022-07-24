import m from '../models.js';

async function beforeConnection(socket) {
    console.log(socket.handshake);
}

async function onConnection(socket) {

}

export default function handle(namespace) {
    namespace.use(beforeConnection);
}