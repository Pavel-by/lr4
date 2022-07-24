import express from 'express';
import root from 'app-root-path';
import mustAuthenticated from './must-authenticated.js';

const router = express.Router();

router.get('/admin', mustAuthenticated.admin(), (req, res) => {
    res.sendFile(root + "/client/public/template/admin.html");
});

export default router;