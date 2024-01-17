const express = require("express");

const authRouter = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

const authController = require('../controllers/auth/auth.controller');

/**
 * @openapi
 * register-merchant
 * 
 */

authRouter.post('/register-merchant', authController.registerMerchant);
authRouter.post('/login-merchant', authController.loginClient);
authRouter.post('/register-client', authController.registerClient);
authRouter.post('/login-client', authController.loginClient);
authRouter.get('/get-user', authMiddleware.verifyAccessToken, authController.getUserFromToken);
authRouter.get('/logout', authMiddleware.verifyAccessToken, authController.logoutUser);
authRouter.get('/force-logout', authMiddleware.verifyAccessToken, authController.forceLogoutUser);
authRouter.get('/refresh', authMiddleware.verifyRefreshToken, authController.refreshUser);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.get('/reset-password/:id', authController.sendResetPasswordForm);
authRouter.post('/update-password/:resetToken', authController.updatePassword);

module.exports = authRouter;