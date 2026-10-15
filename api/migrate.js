const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "data", "database.json");

if (!fs.existsSync(dbPath)) {
  console.error("Database file not found at " + dbPath);
  process.exit(1);
}

try {
  const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  db.matches = db.matches.map((match) => {
    if (match.graphics) {
      const old = match.graphics;

      match.graphics = {
        startScreen: old.startScreen || null,
        tournament: old.tournamentSettings || old.tournament || null,
        sponsors: old.sponsorsSettings || old.sponsors || null,
        weather: old.weather || null,
        lineup: old.formatting || old.lineup || null,
        scorebug: old.scoreBug || old.scorebug || null,
        statistics: old.matchStatistics || old.statistics || null,
        qrCode: old.qrCode || null,
        lowerThird: old.generalLowerThird || old.lowerThird || null,
        notifications: old.notification || old.notifications || null,
        playerSpotlight: old.playerStatistics || old.playerSpotlight || null,
      };
    }

    return match;
  });

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
  console.log("Database migrated successfully!");
} catch (err) {
  console.error("Migration failed:", err);
  process.exit(1);
}
