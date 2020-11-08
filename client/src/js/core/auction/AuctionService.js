import socket from '../Socket.js';
import Emitter from 'events';

class AuctionService extends Emitter {
    static StateUnknown: String = "unknown";
    static StateWait: String = "wait";
    static StateActive: String = "active";
    static StateFinished: String = "finished";

    static EventChanged = 'changed';

    static _instance: AuctionService = new AuctionService(socket);

    static get instance(): AuctionService {
        return this._instance;
    }

    state: String = AuctionService.StateUnknown;
    startDate: Date;

    constructor (socket) {
        super();
        this._socket = socket;
        this._socket.on('auction', (auctionInfo) => {
            this.state = auctionInfo.state;
            this.startDate = new Date(auctionInfo.startDate);
            this.emit(AuctionService.EventChanged, this);
        });
    }
}

export default AuctionService;