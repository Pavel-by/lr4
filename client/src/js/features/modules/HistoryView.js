import CurrentPictureService from "../../core/picture/CurrentPictureService";
import AuctionService from "../../core/auction/AuctionService";
import Utils from '../../core/Utils';

class HistoryView {
    constructor(rootElement) {
        this._root = rootElement;
        CurrentPictureService.instance.on(CurrentPictureService.EventUpdate, () => this.reload());
        AuctionService.instance.on(AuctionService.EventChanged, () => this.reload());
    }

    reload() {
        let auction = AuctionService.instance;
        let currentPicture = CurrentPictureService.instance;
        $(this._root).html(this._build(currentPicture, auction));
    }

    _build(currentPicture, auction): String {
        if (currentPicture.state === CurrentPictureService.StateUnknown || auction.state !== AuctionService.StateActive)
            return "";

        let body = currentPicture.history.map((item) => {
            return `<li>${item.timestamp.toLocaleTimeString()}: ${item.description}</li>`;
        }).join('') ;

        return `<ul class="uk-list uk-list-striped">${body}</ul>`;
    }
}

export default HistoryView;