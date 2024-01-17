const express = require("express");

const permissionRouter = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');

const permissionController = require('../../controllers/permission/permission.controller');

permissionRouter.post('/', authMiddleware.verifyAccessToken, permissionController.createPermission);
// permissionRouter.get('/access-group', authMiddleware.verifyAccessToken, accessGroupController.getAccessGroups);
// permissionRouter.put('/access-group', authMiddleware.verifyAccessToken, accessGroupController.updateAccessGroup);
// permissionRouter.delete('/access-group/:id', authMiddleware.verifyAccessToken, accessGroupController.deleteAccessGroup);

module.exports = permissionRouter;