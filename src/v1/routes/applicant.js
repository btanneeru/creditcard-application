const router = require("express").Router();
const { ApplicantService } = require("../services");
require("../../../config/passport");
const passport = require("passport");
const requireAuth = passport.authenticate(["jwt"], { session: false });
const trimRequest = require("trim-request");
const { validateApplicant } = require("../middlewares/validators");

// get all todos
router.get("/", [
  // requireAuth,
  ApplicantService.getAllApplicants
]);

// Create todo api
router.post("/apply", [
  // requireAuth,
  trimRequest.all, 
  validateApplicant,
  ApplicantService.createApplicant
]);

// get todo details by Id
router.get("/:applicantId", [
  // requireAuth,
  trimRequest.all,
  ApplicantService.getApplicant
]);

// update todo details by Id
router.put("/:applicantId", [
  // requireAuth,
  trimRequest.all,
  validateApplicant,
  ApplicantService.updateApplicant
]);

// delete todo by Id
router.delete("/:applicantId", [
  // requireAuth,
  trimRequest.all,
  ApplicantService.deleteApplicant
]);


module.exports = router;
