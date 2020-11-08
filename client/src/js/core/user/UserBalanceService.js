import Emitter from 'events';
import socket from '../Socket.js';
import Utils from '../Utils.js';

class UserBalance {
    constructor (other) {
        this.userId = other.userId || this.userId;
        this.login = other.login || this.login;
        this.balance = Utils.toNumber(other.balance, 0);
    }

    userId: String;
    login: String;
    balance: Number;
}

class UserBalanceService extends Emitter {
    static get EventChanged() {
        return 'changed';
    }

    static _instance: UserBalanceService = new UserBalanceService(socket);

    static get instance() {
        return this._instance;
    }

    constructor(socket) {
        super();
        this._socket = socket;
        this._socket.on('balance', (rawBalance) => {
            this._balance = new UserBalance(rawBalance);
            this.emit(UserBalanceService.EventChanged, this._balance);
        });
    }

    _balance: ?UserBalance;

    get balance(): ?UserBalance {
        return this._balance;
    }
}

class AdminBalancesService extends Emitter {
    static get EventChanged() {
        return 'changed';
    }

    static _instance: AdminBalancesService = new AdminBalancesService(socket);

    static get instance(): AdminBalancesService {
        return this._instance;
    }

    balances: ?Array<UserBalance> = null;

    constructor(socket) {
        super();
        this._socket = socket;
        this._socket.on('admin-balances', (rawBalances) => {
            this.balances = rawBalances.map(balance => new UserBalance(balance));
            this.emit(AdminBalancesService.EventChanged, this.balances);
        });
    }
}

export default UserBalanceService;
export {UserBalanceService, UserBalance, AdminBalancesService};