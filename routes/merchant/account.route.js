const express = require("express");

const merchantAccountRouter = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const upload = require("../../middlewares/file.middleware");

const merchantAccountController = require('../../controllers/merchant/account.controller');

merchantAccountRouter.post('/get-merchant', authMiddleware.verifyAccessToken, merchantAccountController.getMerchantPersonalDetails);
merchantAccountRouter.post('/configure-maathena-store', authMiddleware.verifyAccessToken, upload.single('logo'), merchantAccountController.ConfigureMaathenaStroeSchema);
merchantAccountRouter.post('/set-merchant-password', authMiddleware.verifyAccessToken, merchantAccountController.setMerchantPassword);



module.exports = merchantAccountRouter;