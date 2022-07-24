import Emitter from 'events';
import m from '../models.js';

class UserBalance {
    static fromUser(user) {
        let balance = new UserBalance();
        balance.userId = user._id.toString();
        balance.login = user.login;
        balance.balance = user.money;
        return balance;
    }

    userId;
    login;
    balance;

    toEvent() {
        return {
            "userId": this.userId,
            "login": this.login,
            "balance": this.balance,
        };
    }
}

class UserBalanceService extends Emitter {
    static get EventChanged() {
        return 'changed';
    }

    static _instance;

    static get instance() {
        if (this._instance == null)
            this._instance = new UserBalanceService();

        return this._instance;
    }

    _balances;

    async init() {
        let users = await m.User.find();
        this._balances = users.map(user => UserBalance.fromUser(user));
    }

    findAll() {
        return this._balances;
    }

    findById(userId) {
        return this._balances.find(balance => balance.userId === userId);
    }

    updateById(userId, balance) {
        let userBalance = this.findById(userId);

        if (userBalance == null)
            return;

        userBalance.balance = balance;
        this.emit(UserBalanceService.EventChanged, userBalance);
    }
}

export default UserBalanceService;
export {UserBalanceService, UserBalance};