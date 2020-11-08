import Picture from "./Picture";

class PicturesService {
    static _instance: ?PicturesService = null;

    static get instance() {
        if (this._instance == null)
            this._instance = new PicturesService();

        return this._instance;
    }

    _pictures: ?Array<Picture>;

    async synchronize(): Promise<?Array<Picture>> {
        try {
            let data = await $.getJSON('/data/picture');
            this._pictures = data.map((picture) => new Picture(picture));
            return this._pictures;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async findAll(): Promise<?Array<Picture>> {
        if (this._pictures == null)
            await this.synchronize();

        return this._pictures;
    }

    async findById(id: String): Promise<?Picture> {
        if (this._pictures == null)
            await this.synchronize();

        return this._pictures?.find(picture => picture._id === id);
    }
}

export default PicturesService;