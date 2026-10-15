import { socket, matchId, timelines } from "./core.js";
import { matchStatisticsGsap } from "../animationsGsap.js";

// initialize match statistics board graphics and socket event listeners
export function initStatistics() {
  const matchStatsOverlay = document.getElementById("match-stats-overlay");
  const statsCardWrapper = document.getElementById("match-stats-card-wrapper");

  // apply placement coordinates and scaling factors to the card wrapper
  const applyPosition = (payload) => {
    if (statsCardWrapper) {
      statsCardWrapper.style.position = "relative";
      statsCardWrapper.style.left = `${payload.xOffset || 0}px`;
      statsCardWrapper.style.top = `${-(payload.yOffset || 0)}px`;
      statsCardWrapper.style.scale = payload.scale || 1;
    }
  };

  // socket event listener to fetch details and render dynamic comparison stats table
  socket.on("statistics:show", (data) => {
    if (data.matchId !== matchId) return;

    if (data.statistics) {
      if (data.statistics.isUpdate) {
        applyPosition(data.statistics);
        return;
      }
    }

    Promise.all([
      fetch(`/routes/getMatch/${matchId}`).then((r) =>
        r.json(),
      ),
      fetch(
        `/routes/matches/${matchId}/start-screen`,
      ).then((r) => r.json()),
    ])
      .then(([matchRes, startScreenRes]) => {
        const savedStats = matchRes.match?.graphics?.statistics;
        const finalPayload = data.statistics || savedStats;
        if (!finalPayload) {
          console.error("No statistics payload or saved data found!");
          return;
        }

        const stats = finalPayload.stats || finalPayload;
        const period = finalPayload.period || "";
        const urlLogos = "/uploads/misc/";
        const homeTeam = startScreenRes.homeTeam;
        const awayTeam = startScreenRes.awayTeam;

        const homeLogo = document.getElementById("stats-home-logo");
        if (homeTeam?.imageUrl) {
          homeLogo.src = urlLogos + homeTeam.imageUrl;
          homeLogo.style.display = "block";
        } else {
          homeLogo.style.display = "none";
        }
        document.getElementById("stats-home-name").textContent =
          homeTeam?.shortName || "HOME";

        const awayLogo = document.getElementById("stats-away-logo");
        if (awayTeam?.imageUrl) {
          awayLogo.src = urlLogos + awayTeam.imageUrl;
          awayLogo.style.display = "block";
        } else {
          awayLogo.style.display = "none";
        }
        document.getElementById("stats-away-name").textContent =
          awayTeam?.shortName || "AWAY";

        document.getElementById("stats-home-score").textContent =
          stats.goals?.home ?? 0;
        document.getElementById("stats-away-score").textContent =
          stats.goals?.away ?? 0;
        document.getElementById("stats-period").textContent = period;

        const container = document.getElementById("stats-rows-container");
        container.innerHTML = "";

        const STATS_CONFIG = [
          { key: "possession", label: "Possession (%)" },
          { key: "shots", label: "Shots" },
          { key: "shotsOnTarget", label: "Shots on Target" },
          { key: "corners", label: "Corners" },
          { key: "fouls", label: "Fouls" },
          { key: "yellowCards", label: "Yellow Cards" },
          { key: "redCards", label: "Red Cards" },
          { key: "offsides", label: "Offsides" },
          { key: "saves", label: "Saves" },
          { key: "passes", label: "Passes" },
        ];

        STATS_CONFIG.forEach((cfg) => {
          const homeVal = stats[cfg.key]?.home ?? 0;
          const awayVal = stats[cfg.key]?.away ?? 0;
          const row = document.createElement("div");
          row.className = "stats-row";
          row.innerHTML = `
          <span class="stats-row-val stats-row-home" style="color:${homeTeam?.primaryColor || "#94a3b8"}">${homeVal}</span>
          <span class="stats-row-label">${cfg.label}</span>
          <span class="stats-row-val stats-row-away" style="color:${awayTeam?.primaryColor || "#94a3b8"}">${awayVal}</span>
        `;
          container.appendChild(row);
        });

        applyPosition(finalPayload);

        timelines.statistics.clear();
        matchStatisticsGsap(timelines.statistics, { matchStatsOverlay });
        timelines.statistics.play();
      })
      .catch((err) => console.error("Stats overlay error:", err));
  });

  socket.on("statistics:hide", (data) => {
    if (data.matchId !== matchId) return;
    timelines.statistics.reverse();
  });
}
