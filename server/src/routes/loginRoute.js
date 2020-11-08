import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import m from '../models.js';
import root from 'app-root-path';
import path from 'path';

let router = express.Router();

passport.use('local', new LocalStrategy(
    {usernameField: 'login'},
    function (username, password, done) {
        m.User.findOne({
            login: username,
            password: password,
        }, function (err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false);

            return done(null, user);
        })
    },
));

passport.serializeUser(function (user, done) {
    done(null, user._id.toString());
});

passport.deserializeUser(function (id, done) {
    m.User.findById(id, function (err, user) {
        if (err)
            return done(err);

        if (!user)
            return done(null, false);

        return done(null, user);
    });
});

router.get(
    '/login',
    function(req, res, next) {
        if (req.user)
            return res.redirect('/');

        return res.sendFile(path.join(root.path, 'client/public/template/login.html'));
    }
);

router.get(
    '/logout',
    function (req, res, next) {
        req.logout();
        res.redirect('/');
    }
);

router.post(
    '/logout',
    function (req, res, next) {
        req.logout();
        res.end();
    }
);

router.post(
    '/login',
    passport.authenticate('local'),
    function (req, res, next) {
        res.send(req.user);
    }
);

router.post(
    '/register',
    function (req, res, next) {
        if (!req.body)
            return res.status(401);

        let user = new m.User({
            name: req.body.name,
            login: req.body.login,
            password: req.body.password,
        });

        user.save(function (err) {
            if (err) {
                res.status(401);
                return res.send(err);
            }

            return req.login(user, function (err) {
                if (err) {
                    res.status(401);
                    return res.send(err);
                }

                return res.send(user);
            });
        });
    }
);

export default router;