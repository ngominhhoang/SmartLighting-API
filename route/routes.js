const express = require('express');
const router = express.Router();
const authRouter = require('./authRoute.js');
const modRouter = require('./modRoute.js');
const apiRouter = require('./apiRoute.js');
const userRouter = require('./userRoute.js');

router.use('/api/auth', authRouter);

router.use('/api/modify', modRouter);

router.use('/api/data', apiRouter);

router.use('/api/users', userRouter);

module.exports = router;