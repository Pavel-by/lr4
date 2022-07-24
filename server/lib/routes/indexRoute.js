import express from 'express';
import root from 'app-root-path';

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(root + "/client/public/template/index.html");
});

export default router;