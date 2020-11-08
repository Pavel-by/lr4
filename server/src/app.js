import express from 'express';
import CookieParser from 'cookie-parser';
import ExpressSession from 'express-session';
import passport from 'passport';
import root from 'app-root-path';
import router from './routes/router.js';

let app = express();

app.use('/public/', express.static(root + '/client/public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(CookieParser());
app.use(ExpressSession({
    secret: "lr3 is secret. Too secret",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

export default app;