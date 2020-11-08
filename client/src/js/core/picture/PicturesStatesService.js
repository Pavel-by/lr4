import Emitter from 'events';
import Utils from "../Utils";
import socket from "../Socket.js";

class PictureState {
    static get Wait() {
        return 'wait';
    };

    static get Sold() {
        return 'sold';
    }

    static get Closed() {
        return 'closed';
    }

    constructor(other) {
        this.update(other);
    }

    update(other) {
        this.state = other.state || this.state;
        this.pictureId = other.pictureId || this.pictureId;
        this.sellPrice = Utils.toNumber(other.sellPrice, null);
        this.sellTime = Utils.toNumber(other.sellTime, null);
        this.customer = other.customer || this.customer;
    }

    state: String;
    pictureId: String;
    sellPrice: ?Number;
    sellTime: ?Date;
    customer: ?String;
}

class PicturesStatesService extends Emitter {
    static get ChangedEvent() {
        return 'changed'
    }

    static _instance: PicturesStatesService = new PicturesStatesService(socket);

    static get instance(): PicturesStatesService {
        return this._instance;
    }

    constructor(socket) {
        super();
        this._socket = socket;
        this._socket.on('pictures', (rawPicturesStates) => {
            try {
                this._picturesStates = rawPicturesStates.map(rawPictureState => new PictureState(rawPictureState));
                this.emit(PicturesStatesService.ChangedEvent, this._picturesStates);
                console.log(this._picturesStates);
            } catch (e) {
                console.error(e);
            }
        });
    }

    _socket;
    _picturesStates: ?Array<PictureState>;

    findAll(): ?Array<PictureState> {
        return this._picturesStates;
    }

    findById(id: String): ?PictureState {
        return this._picturesStates?.find(pictureState => pictureState.pictureId === id);
    }
}

export default PicturesStatesService;
export {PicturesStatesService, PictureState};