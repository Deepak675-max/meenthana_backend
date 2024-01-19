const express = require("express");

const appRoutesRouter = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');
const permissionMiddleware = require("../../middlewares/permission.middleware");

const appRoutesController = require('../../controllers/app_route/app_route.controller');

appRoutesRouter.post('/create-appRoute', authMiddleware.verifyAccessToken, appRoutesController.createAppRoute);
appRoutesRouter.get('/get-appRoute', authMiddleware.verifyAccessToken, permissionMiddleware.validatePermission, appRoutesController.getAppRoutes);
// appRoutesRouter.put('/access-group', authMiddleware.verifyAccessToken, appRoutesController.updateAccessGroup);
// appRoutesRouter.delete('/access-group/:id', authMiddleware.verifyAccessToken, appRoutesController.deleteAccessGroup);



module.exports = appRoutesRouter;