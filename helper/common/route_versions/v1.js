const express = require("express");
const v1 = express.Router();

const authRoutes = require("../../../routes/auth.route");
v1.use("/api/auth", authRoutes);

const accessGroupRoutes = require("../../../routes/access_group/access_group.route");
v1.use("/api/accessGroup", accessGroupRoutes);

const appRoutes = require("../../../routes/app_route/app_route.route");
v1.use("/api/appRoute", appRoutes);

const permissionRoutes = require("../../../routes/permission/permission.route");
v1.use("/api/permission", permissionRoutes);

module.exports = v1;