import PicturesView from './modules/PicturesView.js';
import PicturesStatesService from '../core/picture/PicturesStatesService.js';
import socket from '../core/Socket.js';
import AuthService from "../core/user/AuthService";
import HeaderView from "./modules/HeaderView";
import CurrentPictureInfoView from './modules/CurrentPictureInfoView.js';
import HistoryView from "./modules/HistoryView";
import BidView from './modules/BidView.js';

$(document).ready(() => {
    let pictures = new PicturesView($('.pictures'));
    let header = new HeaderView($('.header'));
    let currentPictureInfo = new CurrentPictureInfoView($('.current-picture-info'));
    let history = new HistoryView($('.history'));
    let bid = new BidView($('.bid'));
    AuthService.instance.user();
});