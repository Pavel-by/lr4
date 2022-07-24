import m from '../models.js';
import Emitter from 'events';

class HistoryItem {
    constructor(description) {
        this.timestamp = Date.now();
        this.description = description;
    }

    timestamp;
    description;

    toString() {
        return JSON.stringify(this);
    }
}

class CurrentPictureService extends Emitter {
    static EventUpdate = 'update';
    static EventClose = 'close';

    static StateWait = 'wait';
    static StateActive = 'active';
    static StateClosed = 'closed';

    static _instance;

    static get instance() {
        if (this._instance == null)
            this._instance = new CurrentPictureService();

        return this._instance;
    }

    auction;

    startDate;
    lastBidDate;
    sellTimerId;
    startTimerId;

    picture;
    currentPrice;
    currentCustomer;
    currentCustomerId;
    history;

    get state() {
        if (this.startTimerId != null)
            return CurrentPictureService.StateWait;

        if (this.sellTimerId != null)
            return CurrentPictureService.StateActive;

        return CurrentPictureService.StateClosed;
    }

    async selectPicture(pictureId) {
        if (this.auction == null)
            this.auction = await m.Auction.findOne();

        this.picture = await m.Picture.findOne({_id: pictureId});
        this.currentPrice = this.picture.price.start;
        this.currentCustomerId = null;
        this.currentCustomer = null;
        this.lastBidDate = null;
        this.history = [];

        if (this.startTimerId != null)
            clearTimeout(this.startTimerId);

        if (this.sellTimerId != null) {
            clearTimeout(this.sellTimerId);
            this.sellTimerId = null;
        }

        this.startDate = Date.now();
        this.history.push(new HistoryItem("Начало предпросмотра картины"));
        this.startTimerId = setTimeout(() => {
            this.startTimerId = null;
            this._restartSellTimer();
            this.history.push(new HistoryItem("Начало продажи картины"));
            this.emit('update');
        }, this.auction.inputpause);

        this.emit('update');
    }

    makeBid(price, customerId, customer) {
        if (this.state !== CurrentPictureService.StateActive)
            throw "Картина недоступна для ставок";

        if (this.sellTimerId == null)
            throw "Ожидание начала торгов по картине.";

        if (customer === null)
            throw "Ник не может быть пустым.";

        if (price == null)
            throw "Некорректная цена.";

        if (this.currentCustomer === customer)
            throw "Нельзя два раза подряд сделать ставку на одну картину.";

        if (this.currentCustomer == null) {
            if (this.currentPrice !== price)
                throw "Сумма первой ставки должна быть равна начальной цене лота.";
        } else {
            if (this.currentPrice + this.picture.price.minstep > price)
                throw `Минимальный шаг аукциона составляет ${this.picture.price.minstep}`;

            if (this.currentPrice + this.picture.price.maxstep < price)
                throw `Максимальный шаг аукциона составляет ${this.picture.price.maxstep}`;
        }

        this.currentPrice = price;
        this.currentCustomer = customer;
        this.currentCustomerId = customerId;
        this.history.push(new HistoryItem(`Участник <b>${customer}</b> сделал ставку в <b>${price.toFixed(0)}р.</b>`));
        this._restartSellTimer();

        this.emit('update');
    }

    _restartSellTimer() {
        if (this.sellTimerId != null)
            clearTimeout(this.sellTimerId);

        this.lastBidDate = Date.now();
        this.sellTimerId = setTimeout(() => {
            this.sellTimerId = null;
            this.history.push(new HistoryItem('Окончание продажи картины'));
            this.emit('close');
        }, this.auction.selltimeout)
    }

    toEvent() {
        return {
            pictureId: this.picture._id.toString(),
            startDate: new Date(this.startDate + this.auction.inputpause),
            endDate: this.lastBidDate != null ? new Date(this.lastBidDate + this.auction.selltimeout) : "",
            currentPrice: this.currentPrice,
            currentCustomer: this.currentCustomer,
            currentCustomerId: this.currentCustomerId,
            minPrice: this.currentCustomer == null ? this.currentPrice : this.currentPrice + this.picture.price.minstep,
            maxPrice: this.currentCustomer == null ? this.currentPrice : this.currentPrice + this.picture.price.maxstep,
            state: this.state,
            history: this.history,
        };
    }
}

export default CurrentPictureService;
export {CurrentPictureService, HistoryItem};