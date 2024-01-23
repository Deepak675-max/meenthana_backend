const express = require("express");
const v1 = express.Router();

const authRoutes = require("../../../routes/auth/auth.route");
v1.use("/api/auth", authRoutes);

const merchantAccountRoutes = require("../../../routes/merchant/account.route");
v1.use("/api/merchant", merchantAccountRoutes);

const accessGroupRoutes = require("../../../routes/access_group/access_group.route");
v1.use("/api/accessGroup", accessGroupRoutes);

const appRoutes = require("../../../routes/app_route/app_route.route");
v1.use("/api/appRoute", appRoutes);

const permissionRoutes = require("../../../routes/permission/permission.route");
v1.use("/api/permission", permissionRoutes);

const productRoutes = require("../../../routes/product/product.route");
v1.use("/api/product/", productRoutes);

module.exports = v1;