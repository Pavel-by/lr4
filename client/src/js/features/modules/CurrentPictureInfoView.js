import AuthService from "../../core/user/AuthService";
import {UserBalanceService, UserBalance} from "../../core/user/UserBalanceService";
import CurrentPictureService from '../../core/picture/CurrentPictureService.js';
import AuctionService from "../../core/auction/AuctionService.js";
import Timer from './Timer'

class CurrentPictureInfoView {
    constructor(rootElement) {
        this._root = rootElement;
        UserBalanceService.instance.on(UserBalanceService.EventChanged, () => this.reload());
        CurrentPictureService.instance.on(CurrentPictureService.EventUpdate, () => this.reload());
        AuctionService.instance.on(AuctionService.EventChanged, () => this.reload());
        this._timer = new Timer();
        this._timer.on(Timer.EventChanged, (value) => {
           $(this._root).find('.info-timer').html(value.toString());
        });
    }

    _root;
    _timer: Timer;

    async reload() {
        let userBalance = UserBalanceService.instance.balance;
        let currentPicture = CurrentPictureService.instance;
        let auction = AuctionService.instance;

        $(this._root).html(this._build(auction, currentPicture, userBalance));
    }

    _build(auction: AuctionService, currentPicture: CurrentPictureService, userBalance: UserBalance): String {
        if (auction.state === AuctionService.StateUnknown)
            return this._buildLoading();

        if (auction.state === AuctionService.StateWait)
            return this._buildWait(auction);

        if (auction.state === AuctionService.StateFinished)
            return this._buildFinished();

        // auction is active
        if (currentPicture.state === CurrentPictureService.StateUnknown || userBalance == null)
            return this._buildLoading();

        return this._buildInfo(currentPicture, userBalance);
    }

    _buildInfo(pictureService: CurrentPictureService, userBalance: UserBalance): String {
        let stateInfo: String;

        if (pictureService.state === CurrentPictureService.StateWait) {
            stateInfo = `До начала продажи: <b class="info-timer"></b>`;
            this._timer.start((pictureService.startDate - Date.now())/1000);
        } else if (pictureService.state === CurrentPictureService.StateClosed)
            stateInfo = `Продана`;
        else {
            stateInfo = `До окончания продажи: <b class="info-timer"></b>`;
            this._timer.start((pictureService.endDate - Date.now()) / 1000);
        }

        return `<div>
            <p><b>Картина:</b> ${pictureService.picture.title}</p>
            <p><b>Текущая цена:</b> ${pictureService.currentPrice} р</p>
            <p><b>Следующая ставка:</b> от ${pictureService.minPrice} до ${pictureService.maxPrice}</p>
            <p>${stateInfo}</p>
        </div>`
    }

    _buildWait(auction: AuctionService): String {
        this._timer.start((auction.startDate - Date.now()) / 1000);
        return `<div class="uk-padding"><p class="uk-text-center">До начала аукциона: <b class="info-timer"></b></p></div>`;
    }

    _buildFinished(): String {
        return `<div class="uk-padding"><p class="uk-text-center">Аукцион завершен.</p></div>`;
    }

    _buildLoading(): String {
        return `<div class="uk-padding"><p class="uk-text-center">Загрузка информации..</p></div>`;
    }
}

export default CurrentPictureInfoView;