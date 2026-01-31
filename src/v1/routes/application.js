const router = require("express").Router();
const { ApplicationsService } = require("../services");
require("../../../config/passport");
const passport = require("passport");
const requireAuth = passport.authenticate(["jwt"], { session: false });
const trimRequest = require("trim-request");
const { validateApplication } = require("../middlewares/validators");

// get all todos
router.get("/", [
  requireAuth,
  ApplicationsService.getAllApplication
]);

// Create todo api
router.post("/", [
  requireAuth,
  trimRequest.all, 
  validateApplication,
  ApplicationsService.createApplication
]);

// get todo details by Id
router.get("/:applicationId", [
  requireAuth,
  trimRequest.all,
  ApplicationsService.getApplication
]);

// update todo details by Id
router.put("/:applicationId", [
  requireAuth,
  trimRequest.all,
  // validateApplication,
  ApplicationsService.updateApplication
]);

// delete todo by Id
router.delete("/:applicationId", [
  requireAuth,
  trimRequest.all,
  ApplicationsService.deleteApplication
]);


module.exports = router;
