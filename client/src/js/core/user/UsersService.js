import Events from 'events';
import User from './User.js';

class UsersService extends Events {
    static EventChanged = 'changed';

    static _instance: UsersService;

    static get instance (): UsersService {
        if (this._instance == null)
            this._instance = new UsersService();

        return this._instance;
    }

    constructor () {
        super();
    }

    _users: ?Array<User>;

    async findAll(): ?Array<User> {
        if (this._users == null)
            await this.synchronize();

        return this._users;
    }

    async findById(userId: String): Promise<?User> {
        if (this._users == null)
            await this.synchronize();

        return this._users?.find(user => user._id === userId);
    }

    async synchronize(): Promise<?Array<User>> {
        try {
            let rawUsers = await $.getJSON('/data/user');
            this._users = rawUsers.map((json) => new User(json));
            this.emit(UsersService.EventChanged);
            return this._users;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

export default UsersService;
export {UsersService};