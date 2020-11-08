import m from '../models.js';
import Emitter from 'events';

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

    static fromId(pictureId: String): PictureState {
        let state = new PictureState();
        state.pictureId = pictureId;
        state.state = PictureState.Wait;
    }

    constructor (other) {
        if (other)
            Object.assign(this, other);
    }

    pictureId: String;
    state: String;
    sellPrice: ?Number;
    sellTime: ?Date;
    customer: ?String;
}

class PicturesStatesService extends Emitter {
    static EventUpdate = 'update';

    static _instance: ?PicturesStatesService;

    static get instance(): PicturesStatesService {
        if (this._instance == null)
            this._instance = new PicturesStatesService();

        return this._instance;
    }

    _states: Array<PictureState>;

    async init() {
        let auction = await m.Auction.findOne();
        let pictures = auction.pictures;
        this._states = pictures.map(pictureId => {
            let state = new PictureState();
            state.state = PictureState.Wait;
            state.pictureId = pictureId;
            return state;
        });
    }

    findAll(): Array<PictureState> {
        return this._states;
    }

    updateState(newState) {
        let index = this._states.findIndex(state => state.pictureId === newState.pictureId);
        this._states[index] = newState;

        this.emit('update');
    }

    toEvent() {
        return this._states;
    }
}

export default PicturesStatesService;
export {PicturesStatesService, PictureState};