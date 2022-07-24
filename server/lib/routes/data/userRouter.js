import express from 'express';
import m from "../../models.js";
import mustAuthenticated from "../must-authenticated.js";

let router = express.Router();

router.get('/user', mustAuthenticated.user(), function (req, res) {
    m.User.find({}, function (err, users) {
        if (err) {
            res.status(500);
            return res.send(err);
        }

        return res.send(users);
    });
});

router.get('/user/me', mustAuthenticated.user(), function (req, res) {
    res.send(req.user);
});

router.get('/user/:userId', mustAuthenticated.user(), function (req, res) {
    m.User.findById(req.params.userId, function (err, user) {
        if (err) {
            res.status(400);
            return res.send(err);
        }

        return res.send(user);
    })
});

export default router;