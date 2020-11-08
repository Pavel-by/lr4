import PicturesView from './modules/PicturesView.js';
import AuthService from "../core/user/AuthService.js";
import HeaderView from "./modules/HeaderView.js";
import CurrentPictureInfoView from './modules/CurrentPictureInfoView.js';
import HistoryView from "./modules/HistoryView";
import UsersView from './modules/UsersView';

$(document).ready(() => {
    let pictures = new PicturesView($('.pictures'));
    let header = new HeaderView($('.header'));
    let currentPictureInfo = new CurrentPictureInfoView($('.current-picture-info'));
    let history = new HistoryView($('.history'));
    let users = new UsersView($('.users'));
    AuthService.instance.user();
});