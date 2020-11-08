import UsersService from "../../core/user/UsersService";
import User from '../../core/user/User';
import {AdminBalancesService} from "../../core/user/UserBalanceService";

class UsersView {
    constructor (root) {
        this._root = root;
        AdminBalancesService.instance.on(AdminBalancesService.EventChanged, () => this.reload());
        this.reload();
    }

    async reload() {
        let balances = await AdminBalancesService.instance.balances;
        $(this._root).html(this._build(balances))
    }

    _build(balances) {
        if (balances == null)
            return ``;

        let body = balances.map((balance) => {
            return `<li>${balance.login}: ${balance.balance}</li>`;
        }).join('') ;

        return `<h3>Список пользователей</h3><ul class="uk-list uk-list-striped">${body}</ul>`;
    }
}

export default UsersView;