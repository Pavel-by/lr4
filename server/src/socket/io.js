import Server from 'socket.io'
import AuctionService from '../core/AuctionService.js';

let io = Server({
    path: "/socket"
});

new AuctionService(io);

export default io;
export {io};