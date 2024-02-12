const userRouter = require('express').Router();

const { getUserId, updateUserData } = require('../controllers/users');
const { validateUserDataUpdate } = require('../utils/dataValidation');

userRouter.get('/me', getUserId);
userRouter.patch('/me', validateUserDataUpdate, updateUserData);

module.exports = userRouter;
