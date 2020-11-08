import socket from '../../core/Socket.js';
import CurrentPictureService from "../../core/picture/CurrentPictureService";
import Utils from '../../core/Utils.js';
import AuctionService from "../../core/auction/AuctionService";

class BidView {
    constructor(root) {
        this._root = root;
        this._init();
        this.reload();
        CurrentPictureService.instance.on(CurrentPictureService.EventUpdate, () => this.reload());
        AuctionService.instance.on(AuctionService.EventChanged, () => this.reload());
    }

    reload() {
        let currentPicture = CurrentPictureService.instance;
        let auction = AuctionService.instance;
        $(this._root).find('form').prop("disabled", currentPicture.state !== CurrentPictureService.StateActive);

        if (auction.state !== AuctionService.StateActive)
            $(this._root).css('display', 'none');
        else
            $(this._root).css('display', 'block');
    }

    _init() {
        let form = `<div>
            <form class="uk-grid uk-child-width-1-2 uk-margin" style="margin-left: 0;">
                <input type="number" name="price" class="uk-input"/>
                <button type="button" class="uk-button uk-button-primary">Сделать ставку</button> 
            </form>
        </div>`;

        $(this._root).html(form);
        $(this._root).find('button').click(() => {
           this._makeBid();
        });
    }

    _makeBid() {
        let price = Utils.toNumber($(this._root).find('form input[name=price]').val(), 0);
        socket.emit('make-bid', {
            pictureId: CurrentPictureService.instance.picture._id,
            price: price,
        });
    }
}

export default BidView;