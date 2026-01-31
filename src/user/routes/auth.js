const express = require("express");
const router = express.Router();
const trimRequest = require("trim-request");

const { login, register } = require("../controllers/auth");

const { validateLogin } = require("../controllers/auth/validators/validateLogin");
const { validateRegister } = require("../controllers/auth/validators/validateRegister");

/*
 * Login route
 */
router.post("/login", trimRequest.all, validateLogin, login);

/*
 * Register route
 */
router.post("/register", trimRequest.all, validateRegister, register);

module.exports = router;
