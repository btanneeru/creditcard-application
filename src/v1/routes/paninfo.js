const router = require("express").Router();
const { PanInfoService } = require("../services");
require("../../../config/passport");
const passport = require("passport");
const requireAuth = passport.authenticate(["jwt"], { session: false });
const trimRequest = require("trim-request");
const { validateApplication } = require("../middlewares/validators");

// get todo details by Id
router.get("/:panNumber", [
  requireAuth,
  trimRequest.all,
  PanInfoService.getCreditScore
]);


module.exports = router;
