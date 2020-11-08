import Utils from '../Utils.js';

class Picture {
    constructor(other) {
        this.update(other);
    }

    update(other) {
        if (!other)
            return;

        this._id = other._id || this._id;
        this.title = other.title || this.title;
        this.description = other.description || this.description;
        this.author = other.author || this.author;
        this.filename = other.filename || this.filename;

        if (this.price != null)
            this.price.update(other.price || {});
        else
            this.price = new PicturePrice(other.price);
    }

    _id: String;
    title: String;
    description: String;
    author: String;
    filename: String;
    price: PicturePrice;
}

class PicturePrice {
    constructor (other) {
        this.update(other);
    }

    update(other) {
        if (other == null)
            return;

        this.start = Utils.toNumber(other.start, 0);
        this.minstep = Utils.toNumber(other.minstep, 0);
        this.maxstep = Utils.toNumber(other.maxstep, Number.POSITIVE_INFINITY);
    }

    start: Number;
    minstep: Number;
    maxstep: Number;
}

export default Picture;
export {Picture, PicturePrice};