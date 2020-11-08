import {UserBalance, UserBalanceService} from "../../core/user/UserBalanceService.js";
import AuthService from "../../core/user/AuthService";

class HeaderView {
    constructor(rootElement) {
        this._root = rootElement;
        this.reload();
        UserBalanceService.instance.on(UserBalanceService.EventChanged, () => {
            this.reload();
        });
    }

    async reload() {
        let user = await AuthService.instance.user();
        let balance = UserBalanceService.instance.balance;
        $(this._root).html(this._build(balance, user.isadmin));
    }

    _build(balance: ?UserBalance, isAdmin: Boolean): String {
        if (balance == null)
            return `<div class="uk-flex-center uk-flex uk-padding"><p>Загрузка..</p></div>`;

        return `
        <ul class="uk-subnav uk-subnav-divider">
            <li>${balance.login}</li>
            <li>${isAdmin ? "Администратор" : (balance.balance + 'р')}</li>
        </ul>`;
    }
}

export default HeaderView;