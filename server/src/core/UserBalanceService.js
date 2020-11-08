import Emitter from 'events';
import m from '../models.js';

class UserBalance {
    static fromUser(user): UserBalance {
        let balance = new UserBalance();
        balance.userId = user._id.toString();
        balance.login = user.login;
        balance.balance = user.money;
        return balance;
    }

    userId: String;
    login: String;
    balance: Number;

    toEvent() {
        return {
            "userId": this.userId,
            "login": this.login,
            "balance": this.balance,
        };
    }
}

class UserBalanceService extends Emitter {
    static get EventChanged(): String {
        return 'changed';
    }

    static _instance: ?UserBalanceService;

    static get instance(): UserBalanceService {
        if (this._instance == null)
            this._instance = new UserBalanceService();

        return this._instance;
    }

    _balances: Array<UserBalance>;

    async init() {
        let users = await m.User.find();
        this._balances = users.map(user => UserBalance.fromUser(user));
    }

    findAll(): Array<UserBalance> {
        return this._balances;
    }

    findById(userId: String): ?UserBalance {
        return this._balances.find(balance => balance.userId === userId);
    }

    updateById(userId: String, balance: Number) {
        let userBalance = this.findById(userId);

        if (userBalance == null)
            return;

        userBalance.balance = balance;
        this.emit(UserBalanceService.EventChanged, userBalance);
    }
}

export default UserBalanceService;
export {UserBalanceService, UserBalance};