const express = require("express");
const usersControllers = require("../controllers/users");
const auth = require("../middleware/auth");

const router = express.Router();

// REGISTER USER---------
// router.post("/register", usersControllers.register);

// LOGIN USER
router.post("/login", usersControllers.login);

// LOGOUT USER
router.post("/logout", usersControllers.logout);

// CURRENT USER
router.get("/me", auth, usersControllers.getCurrentUser);

module.exports = router;
