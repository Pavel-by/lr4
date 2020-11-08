import Emitter from 'events';
import socket from '../Socket.js';
import Utils from '../Utils.js';
import Picture from "./Picture.js";
import PicturesService from "./PicturesService";

class HistoryItem {
    constructor(other) {
        this.timestamp = new Date(other.timestamp);
        this.description = other.description;
    }

    timestamp: Date;
    description: String;
}

class CurrentPictureService extends Emitter {
    static EventUpdate = 'update';

    static StateUnknown = 'unknown';

    static StateWait = 'wait';
    static StateActive = 'active';
    static StateClosed = 'closed';

    static _instance: CurrentPictureService = new CurrentPictureService(socket);

    static get instance(): CurrentPictureService {
        return this._instance;
    }

    picture: Picture;
    startDate: Date;
    endDate: Date;
    currentPrice: Number;
    currentCustomer: String;
    currentCustomerId: String;
    minPrice: Number;
    maxPrice: Number;
    state: String = CurrentPictureService.StateUnknown;
    history: Array<HistoryItem>;

    constructor (socket) {
        super();
        this._socket = socket;
        this._socket.on('current-picture', async (picture) => {
            this.picture = await PicturesService.instance.findById(picture.pictureId);
            this.startDate = new Date(picture.startDate);
            this.endDate = new Date(picture.endDate);
            this.currentPrice = Utils.toNumber(picture.currentPrice, 0);
            this.currentCustomer = picture.currentCustomer;
            this.currentCustomerId = picture.currentCustomerId;
            this.minPrice = Utils.toNumber(picture.minPrice, 0);
            this.maxPrice = Utils.toNumber(picture.maxPrice, 0);
            this.state = picture.state;
            this.history = picture.history.map((item) => new HistoryItem(item));
            this.emit(CurrentPictureService.EventUpdate)
        })
    }
}

export default CurrentPictureService;