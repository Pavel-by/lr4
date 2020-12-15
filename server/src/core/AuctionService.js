import Server from 'socket.io';
import CurrentPictureService from './CurrentPictureService.js'
import m from '../models.js';
import {PictureState, PicturesStatesService} from "./PicturesStatesService.js";
import {UserBalance, UserBalanceService} from './UserBalanceService.js';

const AuctionState = Object.freeze({
    Wait: "wait",
    Active: "active",
    Finished: "finished",
});

class AuctionService {
    constructor(server) {
        this._server = server;

        this.init();
    }

    async init() {
        this._state = AuctionState.Wait;

        await PicturesStatesService.instance.init();
        await UserBalanceService.instance.init();

        CurrentPictureService.instance.on(CurrentPictureService.EventUpdate, () => {
            this.emitCurrentPicture();
        });

        CurrentPictureService.instance.on(CurrentPictureService.EventClose, () => {
            let currentId = CurrentPictureService.instance.picture._id.toString();
            PicturesStatesService.instance.updateState(new PictureState({
                pictureId: currentId,
                state: CurrentPictureService.instance.currentCustomer != null ? PictureState.Sold : PictureState.Closed,
                sellPrice: CurrentPictureService.instance.currentPrice,
                sellTime: Date.now(),
                customer: CurrentPictureService.instance.currentCustomer,
            }));

            if (CurrentPictureService.instance.currentCustomerId != null) {
                let balance = UserBalanceService.instance.findById(CurrentPictureService.instance.currentCustomerId);

                if (balance != null)
                    UserBalanceService.instance.updateById(
                        balance.userId,
                        balance.balance - CurrentPictureService.instance.currentPrice,
                    );
            }

            let states = PicturesStatesService.instance.findAll();
            let currentPictureIndex = states.findIndex(state => state.pictureId === currentId);

            if (currentPictureIndex === states.length - 1) {
                this._state = AuctionState.Finished;
                this.emitAuction();
            } else {
                CurrentPictureService.instance.selectPicture(states[currentPictureIndex + 1].pictureId);
            }
        });

        UserBalanceService.instance.on(UserBalanceService.EventChanged, (userBalance) => {
            this._server.emit('admin-balances', UserBalanceService.instance.findAll());

            if (this._state === AuctionState.Wait)
                return;

            this._server.of('/').to(userBalance.userId).emit('balance', userBalance.toEvent());
        });

        PicturesStatesService.instance.on(PicturesStatesService.EventUpdate, () => {
            this.emitPicturesStates();
        });

        let auction = await m.Auction.findOne();

        this._startDate = auction.starttime;
        /*if (auction.starttime <= Date.now()) {
            console.log("OOOOPS, auction is finished");
            this._state = AuctionState.Finished;
            this.emitAuction();
            //await this._startAuction(); TODO
        } else {*/
            this._startTimerId = setTimeout(() => {
                this._startTimerId = null;
                this._startAuction();
            }, auction.starttime - Date.now());
            this.emitAuction();
        //}

        this._server.of('/').on('connect', async (socket) => {
            socket.on('make-bid', async (bid) => {
                let currentPicture = CurrentPictureService.instance;

                if (bid.pictureId !== currentPicture.picture._id?.toString()) {
                    socket.emit('error-message', 'Попробуйте еще раз');
                    return;
                }

                try {
                    let user = await m.User.findOne({_id: socket.handshake.query.userId});
                    let userBalance = UserBalanceService.instance.findById(user._id.toString());

                    if (userBalance.balance < bid.price)
                        throw "Неодостаточно средств";

                    currentPicture.makeBid(bid.price, user._id.toString(), user.name);
                    socket.emit('success-message', 'Ставка сделана');
                } catch (e) {
                    socket.emit('error-message', e.toString());
                }
            });
            let userId = socket.handshake.query.userId;

            socket.emit('auction', this.toEvent());
            socket.emit('pictures', PicturesStatesService.instance.toEvent());

            if (userId) {
                socket.emit('balance', UserBalanceService.instance.findById(userId).toEvent());
                socket.join(userId);
                let user = await m.User.findOne({_id: userId});

                if (user.isadmin) {
                    socket.join('admin');
                    socket.emit('admin-balances', UserBalanceService.instance.findAll());
                }
            }

            if (this._state === AuctionState.Active) {
                socket.emit('current-picture', CurrentPictureService.instance.toEvent());
            }
        });
    }

    _server;
    _state: String;
    _startDate: Date;
    _startTimerId: ?Number;

    async _startAuction() {
        if (this._state !== AuctionState.Wait)
            return;

        if (this._startTimerId != null) {
            clearTimeout(this._startTimerId);
            this._startTimerId = null;
        }

        let pictures = PicturesStatesService.instance.findAll();
        if (pictures.length > 0) {
            await CurrentPictureService.instance.selectPicture(pictures[0].pictureId);
            this._startDate = Date.now();
            this._state = AuctionState.Active;
            this.emitAuction();
            this.emitPicturesStates();
            this.emitCurrentPicture();
        }
        else {
            this._state = AuctionState.Finished;
            this.emitAuction();
        }
    }

    emitPicturesStates() {
        this._server.of('/').emit('pictures', PicturesStatesService.instance.toEvent());
    }

    emitCurrentPicture() {
        this._server.of('/').emit('current-picture', CurrentPictureService.instance.toEvent());
    }

    emitAuction() {
        this._server.of('/').emit('auction', this.toEvent());
    }

    toEvent() {
        return {
            state: this._state,
            startDate: this._startDate,
        }
    }
}

export default AuctionService;
export {AuctionService, AuctionState};