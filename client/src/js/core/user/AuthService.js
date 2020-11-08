import Events from 'events';
import User from './User.js';
import UsersService from './UsersService';

class AuthService extends Events {
    static get EventChanged() {
        return 'changed';
    }

    static _instance: AuthService;

    static get instance(): AuthService {
        if (this._instance == null)
            this._instance = new AuthService();

        return this._instance;
    }

    constructor() {
        super();
    }

    _userId: ?String;

    async user(): Promise<?User> {
        if (this._userId != null)
            return UsersService.instance.findById(this._userId);

        return this.synchronize();
    };

    async synchronize(): Promise<?User> {
        try {
            let user = await $.getJSON('/data/user/me');
            this._userId = user._id;
            this.emit(AuthService.EventChanged);
            console.log(`User updated: ${user}`);
            return this.user();
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async login(data): Promise<?User> {
        try {
            let user = await $.post('/login', data);
            this._userId = user._id;
            await UsersService.instance.synchronize();
            return UsersService.instance.findById(this._userId);
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

export default AuthService;