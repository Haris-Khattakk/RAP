const express = require("express");
const router = express.Router();
const clientRoutes = require("./clientRoutes");
const authenticateUsers = require("../../middlewares/authenticateUser");
// const adminRoutes = require("./adminRoutes");
// const AuthorizeUser = require("../../middlewares/authorizeUser");

// router.use("/admin", AuthorizeUser,adminRoutes)
router.use(authenticateUsers, clientRoutes)

module.exports = router;
