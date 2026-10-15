const crypto = require("crypto");
const { readData, writeData } = require("../utils/jsonDB");
const WriteQueue = require("../utils/writeQueue");
const {
  normalizeText,
  getCollection,
  createTimestamps,
  updateTimestamp,
  findById,
  hasDuplicateName,
  runDatabaseWrite,
  updateMatchGraphicsData,
  deleteEntityFromDB,
} = require("../utils/controllerHelpers");

// create a new team
exports.createTeam = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    const { name, shortName, coachName, primaryColor, secondaryColor } =
      req.body;

    if (!name?.trim() || !shortName?.trim() || !coachName?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const result = await runDatabaseWrite(async (database) => {
      const teams = getCollection(database, "teams");

      if (hasDuplicateName(teams, name)) {
        return {
          status: 409,
          message: "Team already exists.",
          shouldSave: false,
        };
      }

      const imageUrl = req.file.filename;
      const newTeam = {
        id: crypto.randomUUID(),
        name,
        shortName,
        coachName,
        primaryColor,
        secondaryColor,
        imageUrl,
        ...createTimestamps(),
      };

      teams.push(newTeam);

      return {
        status: 201,
        message: "Team created successfully.",
        team: newTeam,
        shouldSave: true,
      };
    });

    return res.status(result.status).json({
      message: result.message,
      team: result.team,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create team.",
      error: error.message,
    });
  }
};

// get all teams

exports.getAllTeams = async (req, res) => {
  try {
    const database = readData("database");

    if (database.teams.length === 0) {
      return res.status(200).json({ message: "Teams Not Found!", teams: [] });
    }

    return res.status(200).json({
      success: true,
      message: "Teams retrieved successfully.",
      teams: database.teams,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Get Teams is Failed!", error: error.message });
  }
};

// get a team by id
exports.getTeamById = async (req, res) => {
  try {
    const teamId = req.params.id;
    const database = readData("database");
    const team = database.teams.find((team) => team.id === teamId);

    if (!team) {
      return res.status(404).json({ message: "Team Not Found!" });
    }

    return res
      .status(200)
      .json({ message: "Team fetched successfully.", team });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Get Team is Failed!", error: error.message });
  }
};

// update an existing team
exports.updateTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const teamInfoBody = req.body;

    const result = await runDatabaseWrite(async (database) => {
      const teamIndex = database.teams.findIndex((team) => team.id === teamId);

      if (teamIndex === -1) {
        return {
          status: 404,
          message: "Team not found.",
          shouldSave: false,
        };
      }

      if (
        teamInfoBody.name?.trim() &&
        hasDuplicateName(database.teams, teamInfoBody.name, teamId)
      ) {
        return {
          status: 409,
          message: "Another team with this name already exists.",
          shouldSave: false,
        };
      }

      const updatedTeam = {
        ...database.teams[teamIndex],
        ...teamInfoBody,
        ...updateTimestamp(),
      };

      if (req.file) {
        const fileImage = req.file.filename;

        updatedTeam.imageUrl = fileImage;
      }

      database.teams[teamIndex] = updatedTeam;

      return {
        status: 200,
        message: "Team updated successfully.",
        team: updatedTeam,
        shouldSave: true,
      };
    });

    return res.status(result.status).json({
      message: result.message,
      team: result.team,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update team.",
      error: error.message,
    });
  }
};
// delete a team

exports.deleteTeam = async (req, res) => {
  try {
    const teamId = req.params.id;

    const result = await deleteEntityFromDB(teamId, "teams", "Team");

    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete team.",
      error: error.message,
    });
  }
};

// add a sponsor

exports.createSponsor = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Logo is required." });
    }

    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Sponsor name is required.",
      });
    }

    const result = await runDatabaseWrite(async (database) => {
      const sponsors = getCollection(database, "sponsors");

      if (hasDuplicateName(sponsors, name)) {
        return {
          status: 409,
          message: "Sponsor already exists.",
          shouldSave: false,
        };
      }

      const logoUrl = req.file.filename;
      const newSponsor = {
        id: crypto.randomUUID(),
        name,
        logoUrl,
        ...createTimestamps(),
      };

      sponsors.push(newSponsor);

      return {
        status: 201,
        message: "Sponsor created successfully.",
        sponsor: newSponsor,
        shouldSave: true,
      };
    });

    return res.status(result.status).json({
      message: result.message,
      sponsor: result.sponsor,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create sponsor.",
      error: error.message,
    });
  }
};
// fetch all sponsors
exports.getAllSponsors = async (req, res) => {
  try {
    const database = readData("database");

    if (database.sponsors.length === 0) {
      return res
        .status(200)
        .json({ message: "Sponsors Not Found!", sponsors: [] });
    }

    return res.status(200).json({
      message: "Sponsors fetched successfully.",
      sponsors: database.sponsors,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch sponsors.", error: error.message });
  }
};

// get a specific sponsor

exports.getSponsorById = async (req, res) => {
  try {
    const sponsorId = req.params.id;
    const database = readData("database");
    const sponsor = database.sponsors.find(
      (sponsor) => sponsor.id === sponsorId,
    );

    if (!sponsor) {
      return res.status(404).json({ message: "sponsor Not Found!" });
    }

    return res
      .status(200)
      .json({ message: "sponsor fetched successfully.", sponsor });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch sponsor.",
      error: error.message,
    });
  }
};

// update a sponsor
exports.updateSponsor = async (req, res) => {
  try {
    const sponsorId = req.params.id;
    const sponsorInfoBody = req.body;

    const result = await runDatabaseWrite(async (database) => {
      const sponsorIndex = database.sponsors.findIndex(
        (sponsor) => sponsor.id === sponsorId,
      );

      if (sponsorIndex === -1) {
        return {
          status: 404,
          message: "Sponsor not found.",
          shouldSave: false,
        };
      }

      if (
        sponsorInfoBody.name?.trim() &&
        hasDuplicateName(database.sponsors, sponsorInfoBody.name, sponsorId)
      ) {
        return {
          status: 409,
          message: "Another sponsor with this name already exists.",
          shouldSave: false,
        };
      }

      const updatedSponsor = {
        ...database.sponsors[sponsorIndex],
        ...sponsorInfoBody,
        ...updateTimestamp(),
      };

      if (req.file) {
        updatedSponsor.logoUrl = req.file.filename;
      }

      database.sponsors[sponsorIndex] = updatedSponsor;

      return {
        status: 200,
        message: "Sponsor updated successfully.",
        sponsor: updatedSponsor,
        shouldSave: true,
      };
    });

    return res.status(result.status).json({
      message: result.message,
      sponsor: result.sponsor,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update sponsor.",
      error: error.message,
    });
  }
};

// remove a sponsor
exports.deleteSponsor = async (req, res) => {
  try {
    const sponsorId = req.params.id;
    const result = await deleteEntityFromDB(sponsorId, "sponsors", "Sponsor");

    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({
      message: "Delete Sponsor is Failed!",
      error: error.message,
    });
  }
};

// create a tournament
exports.createTournament = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Logo is required." });
    }

    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Tournament name is required.",
      });
    }

    const result = await runDatabaseWrite(async (database) => {
      const tournaments = getCollection(database, "tournaments");

      if (hasDuplicateName(tournaments, name)) {
        return {
          status: 409,
          message: "Tournament already exists.",
          shouldSave: false,
        };
      }

      const newTournament = {
        id: crypto.randomUUID(),
        name,
        logoUrl: req.file.filename,
        ...createTimestamps(),
      };

      tournaments.push(newTournament);

      return {
        status: 201,
        message: "Tournament created successfully.",
        tournament: newTournament,
        shouldSave: true,
      };
    });

    return res.status(result.status).json({
      message: result.message,
      tournament: result.tournament,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create tournament.",
      error: error.message,
    });
  }
};

// list all tournaments

exports.getAllTournaments = async (req, res) => {
  try {
    const database = readData("database");
    const tournaments = getCollection(database, "tournaments");

    if (tournaments.length === 0) {
      return res
        .status(200)
        .json({ message: "Tournaments Not Found!", tournaments: [] });
    }

    return res.status(200).json({
      message: "Tournaments fetched successfully.",
      tournaments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch Tournaments.",
      error: error.message,
    });
  }
};

// fetch specific tournament
exports.getTournamentById = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const database = readData("database");
    const tournament = database.tournaments.find(
      (tournament) => tournament.id === tournamentId,
    );

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found." });
    }

    return res.status(200).json({
      message: "Tournament fetched successfully.",
      tournament,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch tournaments.",
      error: error.message,
    });
  }
};

// update a tournament
exports.updateTournament = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const tournamentInfoBody = req.body;

    const result = await runDatabaseWrite(async (database) => {
      const tournamentIndex = database.tournaments.findIndex(
        (tournament) => tournament.id === tournamentId,
      );

      if (tournamentIndex === -1) {
        return {
          status: 404,
          message: "Tournament not found.",
          shouldSave: false,
        };
      }

      if (
        tournamentInfoBody.name?.trim() &&
        hasDuplicateName(
          database.tournaments,
          tournamentInfoBody.name,
          tournamentId,
        )
      ) {
        return {
          status: 409,
          message: "Another tournament with this name already exists.",
          shouldSave: false,
        };
      }

      const updatedTournament = {
        ...database.tournaments[tournamentIndex],
        ...tournamentInfoBody,
        ...updateTimestamp(),
      };

      if (req.file) {
        updatedTournament.logoUrl = req.file.filename;
      }

      database.tournaments[tournamentIndex] = updatedTournament;

      return {
        status: 200,
        message: "Tournament updated successfully.",
        tournament: updatedTournament,
        shouldSave: true,
      };
    });

    return res.status(result.status).json({
      message: result.message,
      tournament: result.tournament,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update tournament.",
      error: error.message,
    });
  }
};

// delete a tournament
exports.deleteTournament = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const result = await deleteEntityFromDB(
      tournamentId,
      "tournaments",
      "Tournament",
    );

    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete tournament.",
      error: error.message,
    });
  }
};

// create a match
exports.createMatch = async (req, res) => {
  try {
    const { homeTeamId, awayTeamId, tournamentId, sponsorIds, matchDate } =
      req.body;

    if (!homeTeamId || !awayTeamId || !tournamentId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!Array.isArray(sponsorIds)) {
      return res.status(400).json({ message: "Sponsor IDs must be an array." });
    }

    if (!matchDate) {
      return res.status(400).json({ message: "Match date is required." });
    }

    if (homeTeamId === awayTeamId) {
      return res
        .status(400)
        .json({ message: "Home and Away teams cannot be the same." });
    }

    const result = await runDatabaseWrite(async (database) => {
      const homeTeam = database.teams.find((team) => team.id === homeTeamId);

      if (!homeTeam) {
        return {
          status: 404,
          message: "Home Team Not Found!",
          shouldSave: false,
        };
      }

      const awayTeam = database.teams.find((team) => team.id === awayTeamId);

      if (!awayTeam) {
        return {
          status: 404,
          message: "Away Team Not Found!",
          shouldSave: false,
        };
      }

      const tournament = database.tournaments.find(
        (t) => t.id === tournamentId,
      );

      if (!tournament) {
        return {
          status: 404,
          message: "Tournament Not Found!",
          shouldSave: false,
        };
      }

      const sponsors = database.sponsors.filter((sponsor) =>
        sponsorIds.includes(sponsor.id),
      );

      if (sponsors.length !== sponsorIds.length) {
        return {
          status: 404,
          message: "One or more sponsors not found.",
          shouldSave: false,
        };
      }

      const newMatch = {
        id: crypto.randomUUID(),
        homeTeamId,
        awayTeamId,
        tournamentId,
        sponsorIds,
        matchDate,
        status: "pending",
        graphics: {
          startScreen: null,
          weather: null,
          lineup: null,
          scorebug: null,
          notifications: null,
          playerSpotlight: null,
          statistics: null,
          settings: null,
          qrCode: null,
          lowerThird: null,
          positions: null,
        },
        ...createTimestamps(),
      };

      const matches = getCollection(database, "matches");

      matches.push(newMatch);

      return {
        status: 201,
        message: "Match Created Successfully",
        match: newMatch,
        shouldSave: true,
      };
    });

    return res
      .status(result.status)
      .json({ message: result.message, match: result.match });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create Match.",
      error: error.message,
    });
  }
};

// get all matches

exports.getAllMatches = async (req, res) => {
  try {
    const database = readData("database");

    if (database.matches.length === 0) {
      return res
        .status(200)
        .json({ message: "Matches Not Found!", matches: [] });
    }

    return res.status(200).json({
      message: " All Matches is Fetched Successfully",
      matches: database.matches,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch Tournaments.",
      error: error.message,
    });
  }
};

// find match by id
exports.getMatchById = async (req, res) => {
  try {
    const matchId = req.params.id;
    const database = readData("database");
    const match = database.matches.find((match) => match.id === matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not Found!" });
    }

    return res
      .status(200)
      .json({ message: "matches fetched successfully.", match });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch match.",
      error: error.message,
    });
  }
};

// update a match
exports.updateMatch = async (req, res) => {
  try {
    const matchId = req.params.id;
    const matchInfoBody = req.body;

    if (
      matchInfoBody.homeTeamId &&
      matchInfoBody.awayTeamId &&
      matchInfoBody.homeTeamId === matchInfoBody.awayTeamId
    ) {
      return res
        .status(400)
        .json({ message: "Home and Away teams cannot be the same." });
    }

    const result = await runDatabaseWrite(async (database) => {
      const matchIndex = database.matches.findIndex(
        (match) => match.id === matchId,
      );

      if (matchIndex === -1) {
        return { status: 404, message: "Match not Found!", shouldSave: false };
      }

      if (matchInfoBody.homeTeamId) {
        const homeTeam = database.teams.find(
          (t) => t.id === matchInfoBody.homeTeamId,
        );

        if (!homeTeam)
          return {
            status: 404,
            message: "Home Team Not Found.",
            shouldSave: false,
          };
      }

      if (matchInfoBody.awayTeamId) {
        const awayTeam = database.teams.find(
          (t) => t.id === matchInfoBody.awayTeamId,
        );

        if (!awayTeam)
          return {
            status: 404,
            message: "Away Team not Found.",
            shouldSave: false,
          };
      }

      if (matchInfoBody.tournamentId) {
        const tournament = database.tournaments.find(
          (t) => t.id === matchInfoBody.tournamentId,
        );

        if (!tournament)
          return {
            status: 404,
            message: "Tournament not Found.",
            shouldSave: false,
          };
      }

      if (matchInfoBody.sponsorIds) {
        const sponsors = database.sponsors.filter((s) =>
          matchInfoBody.sponsorIds.includes(s.id),
        );

        if (sponsors.length !== matchInfoBody.sponsorIds.length) {
          return {
            status: 404,
            message: "One or more sponsors not found.",
            shouldSave: false,
          };
        }
      }

      const updatedMatch = {
        ...database.matches[matchIndex],
        ...matchInfoBody,
        ...updateTimestamp(),
      };

      database.matches[matchIndex] = updatedMatch;

      return {
        status: 200,
        message: "Match updated successfully.",
        match: updatedMatch,
        shouldSave: true,
      };
    });

    return res
      .status(result.status)
      .json({ message: result.message, match: result.match });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update Match.",
      error: error.message,
    });
  }
};

// delete a match
exports.deleteMatch = async (req, res) => {
  try {
    const matchId = req.params.id;
    const result = await deleteEntityFromDB(matchId, "matches", "Match");

    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({
      message: "Delete match is Failed!",
      error: error.message,
    });
  }
};

// get match start screen data
exports.getMatchStartScreen = async (req, res) => {
  try {
    const matchId = req.params.id;
    const database = readData("database");

    const match = database.matches.find((match) => match.id === matchId);

    if (!match) {
      return res.status(404).json({
        message: "Match not found.",
      });
    }

    const homeTeam = database.teams.find(
      (team) => team.id === match.homeTeamId,
    );

    const awayTeam = database.teams.find(
      (team) => team.id === match.awayTeamId,
    );

    const tournament = database.tournaments.find(
      (tournament) => tournament.id === match.tournamentId,
    );

    if (!homeTeam || !awayTeam || !tournament) {
      return res.status(404).json({
        message: "Related data not found.",
      });
    }

    return res.status(200).json({
      message: "Start screen data fetched successfully.",
      homeTeam,
      awayTeam,
      tournament,
    });
  } catch (error) {
    return res.status(500).json({ message: "something want wrong" });
  }
};

// get match sponsors
exports.getMatchSponsors = async (req, res) => {
  try {
    const matchId = req.params.id;
    const database = readData("database");

    const match = database.matches.find((match) => match.id === matchId);

    if (!match) {
      return res.status(404).json({
        message: "Match not found.",
      });
    }

    const sponsorIds = match.sponsorIds || [];
    const sponsors = database.sponsors.filter((sponsor) =>
      sponsorIds.includes(sponsor.id),
    );

    return res.status(200).json({
      message: "Sponsors fetched successfully.",
      sponsors,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

// get match tournament info
exports.getMatchTournament = async (req, res) => {
  try {
    const matchId = req.params.id;
    const database = readData("database");

    const match = database.matches.find((match) => match.id === matchId);

    if (!match) {
      return res.status(404).json({
        message: "Match not found.",
      });
    }

    const tournament = database.tournaments.find(
      (tournament) => tournament.id === match.tournamentId,
    );

    if (!tournament) {
      return res.status(404).json({
        message: "Related data not found.",
      });
    }

    return res.status(200).json({
      message: "Tournament fetched successfully.",
      tournament,
    });
  } catch (error) {
    return res.status(500).json({ message: "something want wrong" });
  }
};

// update match lineup
exports.updateLineup = async (req, res) => {
  try {
    const matchId = req.params.id;
    const lineupData = req.body;

    const result = await updateMatchGraphicsData(matchId, "lineup", lineupData);

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({
      message: "Lineup updated successfully.",
      lineup: lineupData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update lineup.",
      error: error.message,
    });
  }
};

// update match weather
exports.updateWeather = async (req, res) => {
  try {
    const matchId = req.params.id;
    const weatherData = req.body;

    const result = await updateMatchGraphicsData(
      matchId,
      "weather",
      weatherData,
    );

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({
      message: "Weather updated successfully.",
      weather: weatherData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update weather.",
      error: error.message,
    });
  }
};

// update match scorebug
exports.updateScorebug = async (req, res) => {
  try {
    const matchId = req.params.id;
    const scorebugData = req.body;

    const result = await updateMatchGraphicsData(
      matchId,
      "scorebug",
      scorebugData,
    );

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({
      message: "Scorebug updated successfully.",
      scorebug: scorebugData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update scorebug.",
      error: error.message,
    });
  }
};

// update match statistics
exports.updateStatistics = async (req, res) => {
  try {
    const matchId = req.params.id;
    const statisticsData = req.body;

    const result = await updateMatchGraphicsData(
      matchId,
      "statistics",
      statisticsData,
    );

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({
      message: "Statistics updated successfully.",
      statistics: statisticsData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update statistics.",
      error: error.message,
    });
  }
};

// update player spotlight
exports.updatePlayerSpotlight = async (req, res) => {
  try {
    const matchId = req.params.id;
    const dataToSave = { ...req.body };

    if (req.file) {
      dataToSave.playerImgUrl = req.file.filename;
    }

    const result = await updateMatchGraphicsData(
      matchId,
      "playerSpotlight",
      dataToSave,
    );

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({
      message: "Player Spotlight updated successfully.",
      playerSpotlight: dataToSave,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update player spotlight.",
      error: error.message,
    });
  }
};

// update match notifications

exports.updateNotifications = async (req, res) => {
  try {
    const matchId = req.params.id;
    const notificationsData = req.body;

    const result = await updateMatchGraphicsData(
      matchId,
      "notifications",
      notificationsData,
    );

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({
      message: "Notifications updated successfully.",
      notifications: notificationsData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update notifications.",
      error: error.message,
    });
  }
};

// update match qr code
exports.updateQrCode = async (req, res) => {
  try {
    const matchId = req.params.id;
    const qrCodeData = req.body;

    const result = await updateMatchGraphicsData(matchId, "qrCode", qrCodeData);

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({
      message: "QR Code updated successfully.",
      qrCode: qrCodeData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update QR code.",
      error: error.message,
    });
  }
};

// get match qr code data
exports.getQrCodeData = async (req, res) => {
  try {
    const matchId = req.params.id;
    const database = readData("database");
    const match = database.matches.find((m) => m.id === matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not found." });
    }

    return res.status(200).json({
      qrCode: match.graphics?.qrCode || {},
      tournament: match.tournament || null,
      homeTeam: match.homeTeam || null,
      awayTeam: match.awayTeam || null,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get QR code data.",
      error: error.message,
    });
  }
};

// update match lower third
exports.updateLowerThird = async (req, res) => {
  try {
    const matchId = req.params.id;
    const lowerThirdData = req.body;

    const result = await updateMatchGraphicsData(
      matchId,
      "lowerThird",
      lowerThirdData,
    );

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({
      message: "Lower Third updated successfully.",
      lowerThird: lowerThirdData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update Lower Third.",
      error: error.message,
    });
  }
};

// update match sponsors
exports.updateSponsors = async (req, res) => {
  try {
    const matchId = req.params.id;
    const sponsorsData = req.body;

    const result = await updateMatchGraphicsData(
      matchId,
      "sponsors",
      sponsorsData,
    );

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({
      message: "Sponsors updated successfully.",
      sponsors: sponsorsData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update sponsors.",
      error: error.message,
    });
  }
};

// update match start screen
exports.updateStartScreen = async (req, res) => {
  try {
    const matchId = req.params.id;
    const startScreenData = req.body;

    const result = await updateMatchGraphicsData(
      matchId,
      "startScreen",
      startScreenData,
    );

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({
      message: "Start screen updated successfully.",
      startScreen: startScreenData,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// update match tournament data
exports.updateTournament = async (req, res) => {
  try {
    const matchId = req.params.id;
    const tournamentData = req.body;

    const result = await updateMatchGraphicsData(
      matchId,
      "tournament",
      tournamentData,
    );

    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    return res.status(200).json({
      message: "Tournament updated successfully.",
      tournament: tournamentData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update tournament.",
      error: error.message,
    });
  }
};
