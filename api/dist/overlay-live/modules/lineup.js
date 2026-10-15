import { socket, matchId, timelines } from "./core.js";
import { lineupGsap, tacticalLineupGsap } from "../animationsGsap.js";

// initialize lineup and tactical overlay elements
export function initLineup() {
  const lineupOverlay = document.getElementById("lineup-overlay");
  const lineupStarter = document.getElementById("lineup-list-starters");
  const lineupBench = document.getElementById("lineup-list-bench");
  const tacticalOverlay = document.getElementById("tactical-lineup-overlay");
  const tacticalPlayersContainer = document.getElementById(
    "tactical-players-container",
  );

  // calculates grid coordinates (x, y) for player shirt nodes on the field based on the formation
  function getFormationCoordinates(starters, formationText) {
    let lines = [4, 3, 3];
    if (formationText) {
      const parsed = formationText.split("-").map(Number);
      const sum = parsed.reduce((a, b) => a + b, 0);
      if (sum === 10) {
        lines = parsed;
      }
    }

    const gk =
      starters.find((p) => p.position.toUpperCase() === "GK") || starters[0];
    const outfield = starters.filter((p) => p.id !== gk?.id);

    const positionWeights = {
      GK: 0,
      DF: 1,
      CB: 1.1,
      LB: 1.2,
      RB: 1.3,
      LWB: 1.4,
      RWB: 1.4,
      MF: 2,
      DM: 2.1,
      CM: 2.2,
      AM: 2.3,
      FW: 3,
      LW: 3.1,
      RW: 3.2,
      ST: 3.3,
      CF: 3.3,
    };
    const getWeight = (pos) => positionWeights[pos.toUpperCase()] || 2.2;
    outfield.sort((a, b) => getWeight(a.position) - getWeight(b.position));

    const coords = {};

    if (gk) {
      coords[gk.id] = { x: 50, y: 90 };
    }

    const numLines = lines.length;
    const yStart = 76;
    const yEnd = 16;
    const yStep = (yStart - yEnd) / (numLines - 1 || 1);

    let outfieldIndex = 0;
    lines.forEach((numPlayers, lineIdx) => {
      const yVal = yStart - lineIdx * yStep;
      for (let i = 0; i < numPlayers; i++) {
        const player = outfield[outfieldIndex++];
        if (!player) break;

        const xStep = 100 / (numPlayers + 1);
        const xVal = xStep * (i + 1);

        coords[player.id] = { x: xVal, y: yVal };
      }
    });

    return coords;
  }

  // populate classic list representation of starters and bench players
  function renderLineup(lineupData) {
    const activeTeam = lineupData.activeTeam || "home";
    const team = activeTeam === "home" ? lineupData.home : lineupData.away;
    const teamName =
      lineupData.teamName ||
      (activeTeam === "home" ? "Home Team" : "Away Team");
    const urlLogos = "/uploads/misc/";

    const logoImg = document.getElementById("lineup-val-logo");
    if (lineupData.teamLogo) {
      logoImg.src = urlLogos + lineupData.teamLogo;
      logoImg.style.display = "block";
    } else {
      logoImg.src = "";
      logoImg.style.display = "none";
    }

    document.getElementById("lineup-val-teamname").textContent = teamName;
    document.getElementById("lineup-val-formation").textContent =
      team.formation || "";
    document.getElementById("lineup-val-coach").textContent =
      team.coachName || "Unknown Coach";

    lineupStarter.innerHTML = "";
    (team.starters || []).forEach((player) => {
      const row = document.createElement("div");
      row.className = "lineup-player-row";
      row.innerHTML = `
        <span class="player-row-number">${player.number}</span>
        <span class="player-row-name">${player.name}</span>
        <span class="player-row-position">${player.position}</span>
      `;
      lineupStarter.appendChild(row);
    });

    lineupBench.innerHTML = "";
    (team.bench || []).forEach((player) => {
      const row = document.createElement("div");
      row.className = "lineup-player-row";
      row.innerHTML = `
        <span class="player-row-number">${player.number}</span>
        <span class="player-row-name">${player.name}</span>
        <span class="player-row-position">${player.position}</span>
      `;
      lineupBench.appendChild(row);
    });
  }

  // draw players on the field matching their computed formation coordinates
  function renderTacticalLineup(lineupData) {
    const activeTeam = lineupData.activeTeam || "home";
    const team = activeTeam === "home" ? lineupData.home : lineupData.away;
    const teamName =
      lineupData.teamName ||
      (activeTeam === "home" ? "Home Team" : "Away Team");
    const urlLogos = "/uploads/misc/";

    const logoImg = document.getElementById("tactical-val-logo");
    if (lineupData.teamLogo) {
      logoImg.src = urlLogos + lineupData.teamLogo;
      logoImg.style.display = "block";
    } else {
      logoImg.src = "";
      logoImg.style.display = "none";
    }

    document.getElementById("tactical-val-teamname").textContent = teamName;
    const formationVal = team.formation || "4-3-3";
    document.getElementById("tactical-val-formation").textContent =
      formationVal;
    document.getElementById("tactical-val-coach").textContent =
      team.coachName || "Unknown Coach";

    const primaryColor =
      activeTeam === "home"
        ? lineupData.homeTeamColors?.primary
        : lineupData.awayTeamColors?.primary;
    const secondaryColor =
      activeTeam === "home"
        ? lineupData.homeTeamColors?.secondary
        : lineupData.awayTeamColors?.secondary;

    tacticalPlayersContainer.innerHTML = "";
    const starters = team.starters || [];
    const coordsMap = getFormationCoordinates(starters, formationVal);

    starters.forEach((player) => {
      const coords = coordsMap[player.id] || { x: 50, y: 50 };
      const node = document.createElement("div");
      node.className = "tactical-player-node";

      node.style.left = `${coords.x}%`;
      node.style.top = `${coords.y}%`;

      node.innerHTML = `
        <div class="node-shirt" style="color: ${primaryColor || "#10b981"}; filter: drop-shadow(0 5px 8px rgba(0,0,0,0.6));">
          <svg viewBox="0 0 100 100" fill="currentColor" width="48" height="48">
            <path d="M30 10 Q 50 25 70 10 L 95 30 L 80 45 L 75 35 L 75 90 L 25 90 L 25 35 L 20 45 L 5 30 Z" />
          </svg>
          <div class="shirt-number" style="color: ${secondaryColor || "#ffffff"};">
            ${player.number}
          </div>
        </div>
        <div class="node-name-tag">
          <span class="node-name">${player.name}</span>
        </div>
      `;
      tacticalPlayersContainer.appendChild(node);
    });
  }

  // reposition the graphical overlays based on custom control panel offsets and scale
  const applyPosition = (layout, settings) => {
    if (layout === "tactical") {
      tacticalOverlay.style.position = "relative";
      tacticalOverlay.style.left = `${settings?.xOffset || 0}px`;
      tacticalOverlay.style.top = `${-(settings?.yOffset || 0)}px`;
      tacticalOverlay.style.scale = settings?.scale || 1;
    } else {
      lineupOverlay.style.position = "relative";
      lineupOverlay.style.left = `${settings?.xOffset || 0}px`;
      lineupOverlay.style.top = `${-(settings?.yOffset || 0)}px`;
      lineupOverlay.style.scale = settings?.scale || 1;
    }
  };

  // display graphic and run animations for the requested lineup layout
  const handleShow = (data) => {
    if (data.matchId !== matchId) return;

    const layout = (data.lineup && data.lineup.layout) || "classic";

    if (data.lineup && data.lineup.home) {
      if (data.lineup.isUpdate) {
        applyPosition(layout, data.lineup);
        return;
      }
      applyPosition(layout, data.lineup);

      if (layout === "tactical") {
        timelines.lineup.reverse();
        renderTacticalLineup(data.lineup);
        timelines.tactical.clear();
        tacticalLineupGsap(timelines.tactical, { tacticalOverlay });
        timelines.tactical.play();
      } else {
        timelines.tactical.reverse();
        renderLineup(data.lineup);
        timelines.lineup.clear();
        lineupGsap(timelines.lineup, { lineupOverlay });
        timelines.lineup.play();
      }
    } else {
      fetch(`/routes/getMatch/${matchId}`)
        .then((res) => res.json())
        .then((resData) => {
          const savedLineup = resData.match?.graphics?.lineup;
          if (savedLineup) {
            const activeTeam = "home";
            const teamDetails =
              activeTeam === "home" ? data.homeTeam : data.awayTeam;

            const fullPayload = {
              layout: layout,
              activeTeam: activeTeam,
              teamName: teamDetails?.name,
              teamLogo: teamDetails?.imageUrl,
              homeTeamColors: {
                primary: data.homeTeam?.primaryColor,
                secondary: data.homeTeam?.secondaryColor,
              },
              awayTeamColors: {
                primary: data.awayTeam?.primaryColor,
                secondary: data.awayTeam?.secondaryColor,
              },
              ...savedLineup,
            };

            applyPosition(layout, savedLineup);
            if (layout === "tactical") {
              timelines.lineup.reverse();
              renderTacticalLineup(fullPayload);
              timelines.tactical.clear();
              tacticalLineupGsap(timelines.tactical, { tacticalOverlay });
              timelines.tactical.play();
            } else {
              timelines.tactical.reverse();
              renderLineup(fullPayload);
              timelines.lineup.clear();
              lineupGsap(timelines.lineup, { lineupOverlay });
              timelines.lineup.play();
            }
          }
        })
        .catch((err) => console.error("Failed to fetch lineup fallback:", err));
    }
  };

  // socket event listeners for show and hide commands
  socket.on("lineup:show", (data) => handleShow(data));

  socket.on("lineup:hide", (data) => {
    if (data.matchId !== matchId) return;
    timelines.lineup.reverse();
    timelines.tactical.reverse();
  });
}
