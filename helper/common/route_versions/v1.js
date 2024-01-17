const express = require("express");
const v1 = express.Router();

const authRoutes = require("../../../routes/auth.route");
v1.use("/api/auth", authRoutes);

const accessGroupRoutes = require("../../../routes/access_group/access_group.route");
v1.use("/api/access-group", accessGroupRoutes);

const appRoutes = require("../../../routes/app_route/app_route.route");
v1.use("/api/app-route", appRoutes);

module.exports = v1;