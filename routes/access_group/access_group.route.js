const express = require("express");

const accessGroupRouter = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');

const accessGroupController = require('../../controllers/access_group/access_group.controller');

accessGroupRouter.post('/', authMiddleware.verifyAccessToken, accessGroupController.createAccessGroup);
accessGroupRouter.get('/', authMiddleware.verifyAccessToken, accessGroupController.getAccessGroups);
accessGroupRouter.put('/', authMiddleware.verifyAccessToken, accessGroupController.updateAccessGroup);
accessGroupRouter.delete('/:id', authMiddleware.verifyAccessToken, accessGroupController.deleteAccessGroup);



module.exports = accessGroupRouter;