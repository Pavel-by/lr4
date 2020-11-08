import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

mongoose.connect(
    "mongodb://localhost:27017",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const pictureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    filename: String,
    price: new mongoose.Schema({
        start: {
            type: Number,
            min: 0,
        },
        minstep: {
            type: Number,
            validate: {
                validator: function (v) {
                    return this.maxstep >= v;
                },
                message: "Minimum step can not be greater, than maximum"
            }
        },
        maxstep: {
            type: Number,
            validate: {
                validator: function (v) {
                    return this.minstep <= v;
                },
                message: "Maximum step can not be less, than minimum"
            }
        },
    }),
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 4,
        maxlength: 100,
        required: true,
        trim: true,
    },
    login: {
        type: String,
        minlength: 4,
        maxlength: 100,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 4,
        maxlength: 100,
        required: true,
    },
    isadmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    money: {
        type: Number,
        min: 0,
        default: 0,
    },
    isparticipant: {
        type: Boolean,
        default: false,
    },
});
userSchema.plugin(uniqueValidator);

const auctionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    starttime: {
        type: Date,
        validate: {
            validator: function (v) {
                return ((v == null) === (this.endtime == null)) && v < this.endtime;
            }
        }
    },
    endtime: Date,
    selltimeout: {
        type: Number,
        min: 0
    },
    inputpause: {
        type: Number,
        min: 0
    },
    pictures: [String],
});

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        unique: true,
        required: true,
    },
    originalname: String,
    mimetype: String,
});

export default {
    User: mongoose.model('User', userSchema),
    Auction: mongoose.model('Auction', auctionSchema),
    Picture: mongoose.model('Picture', pictureSchema),
    File: mongoose.model('File', fileSchema),
};