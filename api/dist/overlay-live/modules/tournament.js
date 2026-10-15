import { socket, matchId, timelines } from "./core.js";
import { tournamentMatchGsap } from "../animationsGsap.js";

// initialize tournament title board graphics and socket listeners
export function initTournament() {
  const tournamentWrapper = document.getElementById("tournament-wrapper");
  const tournamentBug = document.getElementById("tournament-bug");
  const tournamentMatchLogo = document.getElementById("tournament-bug-logo");
  const tournamentMatchName = document.getElementById("tournament-bug-name");

  tournamentMatchGsap(timelines.tournament, {
    tournamentBug,
    tournamentMatchLogo,
    tournamentMatchName,
  });

  // position tournament card with custom offsets and scaling factor
  const applyPosition = (settings) => {
    if (tournamentWrapper) {
      tournamentWrapper.style.position = "absolute";
      tournamentWrapper.style.left = `calc(50% + ${settings?.xOffset || 0}px)`;
      tournamentWrapper.style.top = `calc(50% - ${settings?.yOffset || 0}px)`;
      tournamentWrapper.style.transform = `translate(-50%, -50%) scale(${settings?.scale || 1})`;
    }
  };

  // render tournament details and play the entry animation
  const handleRender = (data, settings) => {
    const urlLogos = "/uploads/misc/";

    tournamentMatchName.textContent = data.tournament?.name || "";
    if (data.tournament?.logoUrl) {
      tournamentMatchLogo.src = urlLogos + data.tournament.logoUrl;
      tournamentMatchLogo.style.display = "block";
    } else {
      tournamentMatchLogo.style.display = "none";
    }

    applyPosition(settings);
    timelines.tournament.play();
  };

  // socket listeners for tournament title display controls
  socket.on("tournament:show", (data) => {
    if (data.matchId !== matchId) return;

    const settings = data.tournament;
    if (settings) {
      if (settings.isUpdate) {
        applyPosition(settings);
        return;
      }
      handleRender(data, settings);
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
          const savedTournament = matchRes.match?.graphics?.tournament || {};
          const fullData = {
            tournament: startScreenRes.tournament,
          };
          applyPosition(savedTournament);
          handleRender(fullData, savedTournament);
        })
        .catch((err) =>
          console.error("Failed to fetch tournament fallback details:", err),
        );
    }
  });

  socket.on("tournament:hide", (data) => {
    if (data.matchId !== matchId) return;
    timelines.tournament.reverse();
  });
}
