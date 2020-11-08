import PicturesService from '../../core/picture/PicturesService.js';
import {PicturesStatesService, PictureState} from '../../core/picture/PicturesStatesService.js';
import {Picture, PicturePrice} from "../../core/picture/Picture";

class PicturesView {
    constructor (rootElement) {
        this._root = rootElement;
        PicturesStatesService.instance.on(PicturesStatesService.ChangedEvent, () => this.reload());
        this.reload();
    }

    async reload() {
        let pictures: ?Array<Picture> = await PicturesService.instance.findAll();
        let states = PicturesStatesService.instance.findAll();

        $(this._root).html(this._build(pictures, states));
    }

    _build(pictures: ?Array<Picture>, states: ?Array<PictureState>): String {
        if (pictures == null)
            return `<div>
                <div class="uk-alert-danger uk-alert" uk-alert>Не удалось загрузить список картин</div>
            </div>`;

        if (states == null)
            states = [];

        let body = pictures.reduce((body, picture) => {
            body += this._buildPicture(picture, states.find((state) => state.pictureId === picture._id));
            return body;
        }, "");

        body = `
        <div>
            ${body}
        </div>`;

        return `<div class="uk-container uk-container-small">${body}</div>`
    }

    _buildPicture(picture: Picture, state: ?PictureState): String {
        let image = `
        <div class="uk-card-media-left uk-cover-container uk-width-1-3">
            <img src="/public/files/${picture.filename}" alt="" uk-cover>
        </div>`;

        let info = `
        <h3>${picture.title}</h3>
        <p>${picture.description}</p>`;

        let status: String;

        if (state == null || state.state === PictureState.Wait) {
            status = `<div class="uk-alert-primary uk-alert" uk-alert><p>Ожидает продажи</p></div>`;
        } else if (state.state === PictureState.Sold) {
            status = `<div class="uk-alert-success uk-alert" uk-alert>
                <p>
                    <b>Покупатель: </b>${state.customer}<br>
                    <b>Цена: </b> ${state.sellPrice}
                </p>
            </div>`;
        } else {
            status = `<div class="uk-alert-warning uk-alert" uk-alert><p>Картина не была продана</p></div>`;
        }

        let card = `
        <div class="uk-card uk-card-default uk-grid uk-grid-collapse uk-child-width-1-2" uk-grid>
            ${image}
            <div class="uk-width-2-3">
                <div class="uk-card-body">
                    ${info}
                    ${status}
                </div>
            </div>
        </div>`;

        return `<div class="uk-margin">${card}</div>`;
    }
}

export default PicturesView;