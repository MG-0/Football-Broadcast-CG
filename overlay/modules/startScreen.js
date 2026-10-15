import { socket, matchId, timelines } from "./core.js";
import { startScreenGsap } from "../animationsGsap.js";

// initialize match startup/waiting screen graphics and socket listeners
export function initStartScreen() {
  const startScreen = document.getElementById("start-screen");
  const tournamentLogo = document.getElementById("tournament-logo");
  const tournamentName = document.getElementById("tournament-name");
  const homeTeamLogo = document.getElementById("home-logo");
  const homeTeamName = document.getElementById("home-name");
  const awayTeamLogo = document.getElementById("away-logo");
  const awayTeamName = document.getElementById("away-name");

  startScreenGsap(timelines.startScreen, {
    startScreen,
    tournamentLogo,
    tournamentName,
    homeTeamLogo,
    homeTeamName,
    awayTeamLogo,
    awayTeamName,
  });

  // adjusts positioning offsets and scale, updates text/image sources for team matchups, and plays animation
  const handleRender = (data, settings) => {
    startScreen.style.position = "absolute";
    startScreen.style.left = `calc(50% + ${settings?.xOffset || 0}px)`;
    startScreen.style.top = `calc(50% + ${-(settings?.yOffset || 0)}px)`;
    startScreen.style.transform = `translate(-50%, -50%) scale(${settings?.scale || 1})`;

    if (settings?.isUpdate) return;

    const urlLogos = "/uploads/misc/";

    tournamentName.textContent = data.tournament?.name || "";

    if (data.tournament?.logoUrl) {
      tournamentLogo.src = urlLogos + data.tournament.logoUrl;
      tournamentLogo.style.display = "block";
    } else {
      tournamentLogo.style.display = "none";
    }

    homeTeamName.textContent = data.homeTeam?.name || "";
    if (data.homeTeam?.imageUrl) {
      homeTeamLogo.src = urlLogos + data.homeTeam.imageUrl;
      homeTeamLogo.style.display = "block";
    } else {
      homeTeamLogo.style.display = "none";
    }

    awayTeamName.textContent = data.awayTeam?.name || "";
    if (data.awayTeam?.imageUrl) {
      awayTeamLogo.src = urlLogos + data.awayTeam.imageUrl;
      awayTeamLogo.style.display = "block";
    } else {
      awayTeamLogo.style.display = "none";
    }

    timelines.startScreen.play();
  };

  // socket events for show and hide commands
  socket.on("startScreen:show", (data) => {
    if (data.matchId !== matchId) return;

    if (data.startScreen) {
      handleRender(data, data.startScreen);
    } else {
      fetch(`/routes/getMatch/${matchId}`)
        .then((res) => res.json())
        .then((resData) => {
          const savedSettings = resData.match?.graphics?.startScreen || {};
          handleRender(data, savedSettings);
        })
        .catch((err) =>
          console.error("Failed to fetch startScreen fallback details:", err),
        );
    }
  });

  socket.on("startScreen:hide", (data) => {
    if (data.matchId !== matchId) return;
    timelines.startScreen.reverse();
  });
}
