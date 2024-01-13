const express = require("express");
const v1 = express.Router();

const authRoutes = require("../../../routes/auth.route");
v1.use("/api/auth", authRoutes);

module.exports = v1;