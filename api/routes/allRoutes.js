const express = require("express");
const controller = require("../controllers/dashboard.controller");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Team Routes

// create a new team
router.post("/createTeam", auth, upload.single("image"), controller.createTeam);

// get all teams
router.get("/getAllTeams", controller.getAllTeams);

// get a team by id
router.get("/getTeam/:id", controller.getTeamById);

// update an existing team
router.put(
  "/updateTeam/:id",
  auth,
  upload.single("image"),
  controller.updateTeam,
);

// delete a team
router.delete("/deleteTeam/:id", auth, controller.deleteTeam);

// Sponsor Routes

// add a sponsor
router.post(
  "/createSponsor",
  auth,
  upload.single("logo"),
  controller.createSponsor,
);

// fetch all sponsors
router.get("/getAllSponsors", controller.getAllSponsors);

// get a specific sponsor
router.get("/getSponsor/:id", controller.getSponsorById);

// update a sponsor
router.put(
  "/updateSponsor/:id",
  auth,
  upload.single("logo"),
  controller.updateSponsor,
);

// remove a sponsor
router.delete("/deleteSponsor/:id", auth, controller.deleteSponsor);

// Tournament Routes

// create a tournament
router.post(
  "/createTournament",
  auth,
  upload.single("logo"),
  controller.createTournament,
);

// list all tournaments
router.get("/getAllTournaments", controller.getAllTournaments);

// fetch specific tournament
router.get("/getTournament/:id", controller.getTournamentById);

// update a tournament
router.put(
  "/updateTournament/:id",
  auth,
  upload.single("logo"),
  controller.updateTournament,
);

// delete a tournament
router.delete("/deleteTournament/:id", auth, controller.deleteTournament);

// Match Routes

// create a match
router.post("/createMatch", auth, controller.createMatch);

// get all matches
router.get("/getAllMatches", controller.getAllMatches);

// find match by id
router.get("/getMatch/:id", controller.getMatchById);

// update a match
router.put("/updateMatch/:id", auth, controller.updateMatch);

// delete a match
router.delete("/deleteMatch/:id", auth, controller.deleteMatch);

// Match Graphics and Configurations

// manage start screen
router.get("/matches/:id/start-screen", controller.getMatchStartScreen);
router.patch("/matches/:id/start-screen", auth, controller.updateStartScreen);

// manage match sponsors
router.get("/matches/:id/sponsors", controller.getMatchSponsors);
router.patch("/matches/:id/sponsors", auth, controller.updateSponsors);

// manage match tournament
router.get("/matches/:id/tournament", controller.getMatchTournament);
router.patch("/matches/:id/tournament", auth, controller.updateTournament);

// update weather
router.patch("/matches/:id/weather", auth, controller.updateWeather);

// update lineup
router.patch("/matches/:id/lineup", auth, controller.updateLineup);

// update scorebug
router.patch("/matches/:id/scorebug", auth, controller.updateScorebug);

// update stats
router.patch("/matches/:id/statistics", auth, controller.updateStatistics);

// update spotlight
router.patch(
  "/matches/:id/player-spotlight",
  auth,
  upload.single("image"),
  controller.updatePlayerSpotlight,
);

// update notifications
router.patch(
  "/matches/:id/notifications",
  auth,
  controller.updateNotifications,
);

// manage qr code
router.patch("/matches/:id/qr-code", auth, controller.updateQrCode);
router.get("/matches/:id/qr-code/data", controller.getQrCodeData);

// update lower third
router.patch("/matches/:id/lower-third", auth, controller.updateLowerThird);

// export router
module.exports = router;
