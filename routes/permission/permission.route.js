const express = require("express");

const permissionRouter = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');

const permissionController = require('../../controllers/permission/permission.controller');

permissionRouter.post('/create-permission', authMiddleware.verifyAccessToken, permissionController.createPermission);
permissionRouter.post('/get-permissions', authMiddleware.verifyAccessToken, permissionController.getPermissions);
permissionRouter.put('/update-permission', authMiddleware.verifyAccessToken, permissionController.updatePermission);
permissionRouter.delete('/delete-permission', authMiddleware.verifyAccessToken, permissionController.deletePermissions);

// permissionRouter.delete('/access-group/:id', authMiddleware.verifyAccessToken, accessGroupController.deleteAccessGroup);

module.exports = permissionRouter;