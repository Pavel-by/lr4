import express from 'express';
import root from 'app-root-path';
import mustAuthenticated from './must-authenticated.js';

const router = express.Router();

router.get('/user', mustAuthenticated.user(), (req, res) => {
    res.sendFile(root + "/client/public/template/user.html");
});

export default router;