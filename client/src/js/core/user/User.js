import Utils from '../Utils.js';

class User {
    constructor(fields) {
        if (!fields)
            return;

        this.update(fields);
    }

    update(other) {
        if (!other)
            return;

        this._id = other._id || this._id;
        this.name = other.name || this.name;
        this.login = other.login || this.login;
        this.password = other.password || this.password;
        this.money = Utils.toNumber(other.money, this.money);
        this.isadmin = Utils.toBoolean(other.isadmin, this.isadmin);
        this.isparticipant = Utils.toBoolean(other.isparticipant, this.isparticipant);
    }

    _id: String;
    name: String;
    login: String;
    password: String;
    money: Number;
    isadmin: Boolean;
    isparticipant: Boolean;
}

export default User;