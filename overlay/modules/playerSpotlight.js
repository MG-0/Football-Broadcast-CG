import { socket, matchId, timelines } from "./core.js";
import { playerSpotlightGsap } from "../animationsGsap.js";

// initialize player spotlight graphics and socket event listeners
export function initPlayerSpotlight() {
  const playerSpotlightOverlay = document.getElementById(
    "player-spotlight-overlay",
  );
  const spotlightCard = document.getElementById("spotlight-card");
  const spotlightTeamLogo = document.getElementById("spotlight-team-logo");
  const spotlightTeamName = document.getElementById("spotlight-team-name");
  const spotlightPosition = document.getElementById(
    "spotlight-player-position",
  );
  const spotlightPlayerName = document.getElementById("spotlight-player-name");
  const spotlightRating = document.getElementById("spotlight-stat-rating");
  const spotlightVal1 = document.getElementById("spotlight-stat-val1");
  const spotlightLabel1 = document.getElementById("spotlight-stat-label1");
  const spotlightVal2 = document.getElementById("spotlight-stat-val2");
  const spotlightLabel2 = document.getElementById("spotlight-stat-label2");
  const spotlightVal3 = document.getElementById("spotlight-stat-val3");
  const spotlightLabel3 = document.getElementById("spotlight-stat-label3");
  const spotlightPlayerImg = document.getElementById("spotlight-player-img");

  // populate card info, conditionally swap labels based on role (GK vs Outfield), position card, and start timeline
  function renderPlayerSpotlight(payload) {
    const urlLogos = "/uploads/misc/";

    if (payload.teamLogo) {
      spotlightTeamLogo.src = urlLogos + payload.teamLogo;
      spotlightTeamLogo.style.display = "block";
    } else {
      spotlightTeamLogo.style.display = "none";
    }

    spotlightTeamName.textContent = payload.teamShortName || "";
    spotlightPosition.textContent = payload.position || "ST";
    spotlightPlayerName.textContent = payload.playerName || "";

    spotlightRating.textContent = payload.rating ?? "0.0";

    if (payload.role === "goalkeeper") {
      spotlightLabel1.textContent = "Saves";
      spotlightVal1.textContent = payload.saves ?? 0;
      spotlightLabel2.textContent = "Conceded";
      spotlightVal2.textContent = payload.conceded ?? 0;
      spotlightLabel3.textContent = "Save %";
      spotlightVal3.textContent = payload.savePercentage
        ? payload.savePercentage + "%"
        : "0%";
    } else {
      spotlightLabel1.textContent = "Goals";
      spotlightVal1.textContent = payload.goals ?? 0;
      spotlightLabel2.textContent = "Assists";
      spotlightVal2.textContent = payload.assists ?? 0;
      spotlightLabel3.textContent = "Shots";
      spotlightVal3.textContent = payload.shots ?? 0;
    }

    if (payload.playerImgUrl) {
      if (
        payload.playerImgUrl.startsWith("http://") ||
        payload.playerImgUrl.startsWith("https://") ||
        payload.playerImgUrl.startsWith("data:")
      ) {
        spotlightPlayerImg.src = payload.playerImgUrl;
      } else {
        spotlightPlayerImg.src =
          "/uploads/players/" + payload.playerImgUrl;
      }
    } else {
      spotlightPlayerImg.src =
        "https://i.postimg.cc/kX4yXW1b/player-cutout-placeholder.png";
    }

    const teamColor = payload.teamColor || "#3b82f6";
    spotlightCard.style.setProperty("--team-color", teamColor);

    playerSpotlightOverlay.style.bottom = `calc(80px + ${payload.yOffset || 0}px)`;
    playerSpotlightOverlay.style.left = `calc(50% + ${payload.xOffset || 0}px)`;
    playerSpotlightOverlay.style.scale = payload.scale || 1;

    if (payload.isUpdate) {
      return;
    }

    timelines.playerSpotlight.clear();
    playerSpotlightGsap(timelines.playerSpotlight, {
      overlay: playerSpotlightOverlay,
      card: spotlightCard,
    });

    timelines.playerSpotlight.play();
  }

  // socket listeners for player spotlight graphics control
  socket.on("playerSpotlight:show", (data) => {
    if (data.matchId !== matchId) return;

    if (data.playerSpotlight) {
      renderPlayerSpotlight(data.playerSpotlight);
    } else {
      Promise.all([
        fetch(`/routes/getMatch/${matchId}`).then((r) =>
          r.json(),
        ),
        fetch(
          `/routes/matches/${matchId}/start-screen`,
        ).then((r) => r.json()),
      ])
        .then(([matchRes, startScreenRes]) => {
          const matchData = matchRes.match;
          const savedSpotlight = matchData?.graphics?.playerSpotlight;
          if (!savedSpotlight) return;

          const teamDetails =
            savedSpotlight.team === "home"
              ? startScreenRes.homeTeam
              : startScreenRes.awayTeam;
          const fullPayload = {
            ...savedSpotlight,
            teamName: teamDetails?.name,
            teamShortName: teamDetails?.shortName || teamDetails?.name,
            teamLogo: teamDetails?.imageUrl,
            teamColor: teamDetails?.primaryColor || "#3b82f6",
          };

          renderPlayerSpotlight(fullPayload);
        })
        .catch((err) =>
          console.error(
            "Failed to fetch player spotlight fallback settings:",
            err,
          ),
        );
    }
  });

  socket.on("playerSpotlight:hide", (data) => {
    if (data.matchId !== matchId) return;
    timelines.playerSpotlight.reverse();
  });
}
