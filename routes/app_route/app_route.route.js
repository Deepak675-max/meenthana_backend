const express = require("express");

const appRoutesRouter = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');

const appRoutesController = require('../../controllers/app_route/app_route.controller');

appRoutesRouter.post('/', authMiddleware.verifyAccessToken, appRoutesController.createAppRoute);
appRoutesRouter.get('/', authMiddleware.verifyAccessToken, appRoutesController.getAppRoutes);
// appRoutesRouter.put('/access-group', authMiddleware.verifyAccessToken, appRoutesController.updateAccessGroup);
// appRoutesRouter.delete('/access-group/:id', authMiddleware.verifyAccessToken, appRoutesController.deleteAccessGroup);



module.exports = appRoutesRouter;