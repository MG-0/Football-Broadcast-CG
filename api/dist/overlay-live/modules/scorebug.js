import { socket, matchId, timelines } from "./core.js";
import { scoreBugGsap, scoreBugGoalFlash } from "../animationsGsap.js";

// initialize scorebug graphics, clock timers, and socket listeners
export function initScorebug() {
  const scoreBugWrapper = document.getElementById("scorebug-wrapper");
  const scoreBugOverlay = document.getElementById("scorebug-overlay");

  let scoreBugClockInterval = null;
  // track match clock state locally to keep timer incrementing in real-time
  const scoreBugState = {
    minute: 0,
    second: 0,
    isRunning: false,
  };

  scoreBugGsap(timelines.scorebug, scoreBugOverlay);

  // apply layout coordinates and scale configurations to the scorebug wrapper
  const applyPosition = (sb) => {
    if (scoreBugWrapper) {
      scoreBugWrapper.style.top = `calc(45px + ${sb.yOffset || 0}px)`;
      scoreBugWrapper.style.left = `calc(45px + ${sb.xOffset || 0}px)`;
      scoreBugWrapper.style.scale = sb.scale || 1;
    }
  };

  // populate DOM elements with team names, logos, scores, active period, and formatted time values
  function renderScoreBug(data) {
    const urlLogos = "/uploads/misc/";

    const homeLogo = document.getElementById("scorebug-home-logo");
    if (data.homeTeam?.imageUrl) {
      homeLogo.src = urlLogos + data.homeTeam.imageUrl;
      homeLogo.style.display = "block";
    } else {
      homeLogo.style.display = "none";
    }
    document.getElementById("scorebug-home-name").textContent =
      data.homeTeam?.name || "Home";

    const awayLogo = document.getElementById("scorebug-away-logo");
    if (data.awayTeam?.imageUrl) {
      awayLogo.src = urlLogos + data.awayTeam.imageUrl;
      awayLogo.style.display = "block";
    } else {
      awayLogo.style.display = "none";
    }
    document.getElementById("scorebug-away-name").textContent =
      data.awayTeam?.name || "Away";

    if (data.tournament?.logoUrl) {
      const tourLogo = document.getElementById("scorebug-tournament-logo");
      tourLogo.src = urlLogos + data.tournament.logoUrl;
      tourLogo.style.display = "block";
    } else {
      document.getElementById("scorebug-tournament-logo").style.display =
        "none";
    }

    document.getElementById("scorebug-home-score").textContent =
      data.homeScore ?? 0;
    document.getElementById("scorebug-away-score").textContent =
      data.awayScore ?? 0;

    const periodElement = document.getElementById("scorebug-period");
    periodElement.textContent = data.period || "1H";
    periodElement.className = "scorebug-period";

    const fmt = (number) => String(number).padStart(2, "0");
    document.getElementById("scorebug-time").textContent =
      `${fmt(data.minute ?? 0)}:${fmt(data.second ?? 0)}`;

    const addedTimeElement = document.getElementById("scorebug-added-time");
    if (addedTimeElement) {
      if (data.addedTime && data.addedTime > 0) {
        addedTimeElement.textContent = `+${data.addedTime}`;
        addedTimeElement.style.display = "inline-block";
      } else {
        addedTimeElement.textContent = "";
        addedTimeElement.style.display = "none";
      }
    }

    scoreBugState.minute = data.minute ?? 0;
    scoreBugState.second = data.second ?? 0;
    scoreBugState.isRunning = data.isRunning ?? false;
  }

  // increment seconds and minutes at 1-second intervals if the match is running
  function startScoreBugClock() {
    clearInterval(scoreBugClockInterval);
    scoreBugClockInterval = setInterval(() => {
      if (!scoreBugState.isRunning) return;

      scoreBugState.second += 1;
      if (scoreBugState.second >= 60) {
        scoreBugState.second = 0;
        scoreBugState.minute = Math.min(120, scoreBugState.minute + 1);
      }

      const fmt = (number) => String(number).padStart(2, "0");
      document.getElementById("scorebug-time").textContent =
        `${fmt(scoreBugState.minute)}:${fmt(scoreBugState.second)}`;
    }, 1000);
  }

  // socket event listeners for real-time score updates, clock toggling, and goal animations
  socket.on("scorebug:show", (data) => {
    if (data.matchId !== matchId) return;

    if (data.scorebug) {
      if (data.scorebug.isUpdate) {
        applyPosition(data.scorebug);

        const previousHomeScore = Number(
          document.getElementById("scorebug-home-score").textContent || 0,
        );
        const previousAwayScore = Number(
          document.getElementById("scorebug-away-score").textContent || 0,
        );
        const isCurrentlyVisible =
          timelines.scorebug.progress() > 0 && !timelines.scorebug.reversed();

        if (isCurrentlyVisible) {
          if (data.scorebug.homeScore > previousHomeScore) {
            scoreBugGoalFlash(
              scoreBugOverlay,
              "home",
              data.scorebug.homeTeam?.primaryColor,
            );
          } else if (data.scorebug.awayScore > previousAwayScore) {
            scoreBugGoalFlash(
              scoreBugOverlay,
              "away",
              data.scorebug.awayTeam?.primaryColor,
            );
          }
        }

        renderScoreBug(data.scorebug);
        return;
      }

      const previousHomeScore = Number(
        document.getElementById("scorebug-home-score").textContent || 0,
      );
      const previousAwayScore = Number(
        document.getElementById("scorebug-away-score").textContent || 0,
      );
      const isCurrentlyVisible =
        timelines.scorebug.progress() > 0 && !timelines.scorebug.reversed();

      applyPosition(data.scorebug);
      renderScoreBug(data.scorebug);

      if (isCurrentlyVisible) {
        if (data.scorebug.homeScore > previousHomeScore) {
          scoreBugGoalFlash(
            scoreBugOverlay,
            "home",
            data.scorebug.homeTeam?.primaryColor,
          );
        } else if (data.scorebug.awayScore > previousAwayScore) {
          scoreBugGoalFlash(
            scoreBugOverlay,
            "away",
            data.scorebug.awayTeam?.primaryColor,
          );
        }
      } else {
        timelines.scorebug.play();
      }

      if (data.scorebug.isRunning) startScoreBugClock();
      else clearInterval(scoreBugClockInterval);
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
          const matchData = matchRes.match || data;
          const savedScoreBug = matchData?.graphics?.scoreBug || {
            homeScore: 0,
            awayScore: 0,
            minute: 0,
            second: 0,
            period: "1H",
            isRunning: false,
            xOffset: 0,
            yOffset: 0,
            scale: 1,
            addedTime: 0,
          };

          const homeTeam = startScreenRes.homeTeam;
          const awayTeam = startScreenRes.awayTeam;
          const tournament = startScreenRes.tournament;

          const fullScoreBug = {
            ...savedScoreBug,
            homeTeam: {
              name: homeTeam?.shortName || homeTeam?.name,
              imageUrl: homeTeam?.imageUrl,
              primaryColor: homeTeam?.primaryColor,
            },
            awayTeam: {
              name: awayTeam?.shortName || awayTeam?.name,
              imageUrl: awayTeam?.imageUrl,
              primaryColor: awayTeam?.primaryColor,
            },
            tournament: {
              name: tournament?.name,
              logoUrl: tournament?.logoUrl,
            },
          };

          applyPosition(fullScoreBug);
          renderScoreBug(fullScoreBug);

          const isCurrentlyVisible =
            timelines.scorebug.progress() > 0 && !timelines.scorebug.reversed();
          if (!isCurrentlyVisible) {
            timelines.scorebug.play();
          }

          if (fullScoreBug.isRunning) startScoreBugClock();
          else clearInterval(scoreBugClockInterval);
        })
        .catch((err) =>
          console.error("Failed to load score bug details fallback:", err),
        );
    }
  });

  socket.on("scorebug:hide", (data) => {
    if (data.matchId !== matchId) return;
    timelines.scorebug.reverse();
    clearInterval(scoreBugClockInterval);
  });
}
