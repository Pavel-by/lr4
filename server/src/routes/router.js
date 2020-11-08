import express from 'express';
import loginRouter from './loginRoute.js';
import indexRouter from './indexRoute.js';
import userRouter from './userRouter.js';
import adminRouter from './adminRoute.js';
import userDataRouter from './data/userRouter.js';
import picturesDataRouter from './data/picturesRouter.js';

let router = express.Router();

router.use('/', indexRouter);
router.use('/', loginRouter);
router.use('/', userRouter);
router.use('/', adminRouter);
router.use('/data/', userDataRouter);
router.use('/data/', picturesDataRouter);

router.get("*", (req, res) => {
   res.sendStatus(404);
});

export default router;