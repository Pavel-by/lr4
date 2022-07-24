import express from 'express';
import m from "../../models.js";
import mustAuthenticated from "../must-authenticated.js";

let router = express.Router();

router.get('/picture', mustAuthenticated.user(), function (req, res) {
    m.Picture.find({}, function (err, pictures) {
        if (err)
            return res.sendStatus(500);

        return res.send(pictures);
    })
});

export default router;