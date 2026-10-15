import { socket, matchId, timelines } from "./core.js";
import { lowerThirdGsap } from "../animationsGsap.js";

// initialize lower third elements and socket listeners
export function initLowerThird() {
  const lowerthirdOverlay = document.getElementById("lowerthird-overlay");
  const lowerthirdBar = document.getElementById("lowerthird-bar");
  const lowerthirdBadge = document.getElementById("lowerthird-badge");
  const lowerthirdTitle = document.getElementById("lowerthird-title");
  const lowerthirdSubtitle = document.getElementById("lowerthird-subtitle");
  const lowerthirdCardWrapper = document.getElementById(
    "lowerthird-card-wrapper",
  );

  // adjusts screen positioning, scaling, and marquee subtitle animation duration based on character length and speed factor
  const applyPosition = (payload) => {
    if (lowerthirdOverlay) {
      lowerthirdOverlay.style.bottom = `calc(50px + ${payload.yOffset || 0}px)`;
      lowerthirdOverlay.style.left = `${payload.xOffset || 0}px`;
    }
    if (lowerthirdCardWrapper) {
      lowerthirdCardWrapper.style.scale = payload.scale || 1;
    }
    if (lowerthirdSubtitle && payload.subtitle) {
      const textLen = payload.subtitle.length;
      const speedMultiplier = Number(payload.speed || 1);
      const baseDuration = textLen * 0.16;
      const duration = Math.max(
        5,
        Math.min(150, baseDuration / speedMultiplier),
      );
      lowerthirdSubtitle.style.animationDuration = `${duration}s`;
    }
  };

  // update elements in the DOM with new data, set theme colors, and trigger reveal animation
  const handleRender = (payload) => {
    applyPosition(payload);

    if (payload.badge) {
      lowerthirdBadge.textContent = payload.badge;
      lowerthirdBadge.style.display = "inline-block";
    } else {
      lowerthirdBadge.style.display = "none";
    }

    lowerthirdTitle.textContent = payload.title || "";

    const subtitleText = payload.subtitle || "";
    lowerthirdSubtitle.textContent = subtitleText;

    const sepElement = document.getElementById("lowerthird-sep");
    if (payload.title && subtitleText) {
      sepElement.style.display = "inline-block";
    } else {
      sepElement.style.display = "none";
    }

    const themeColor = payload.resolvedColor || "#6366f1";
    lowerthirdBar.style.backgroundColor = themeColor;
    lowerthirdBadge.style.color = themeColor;
    lowerthirdBadge.style.borderColor = `${themeColor}35`;
    lowerthirdBadge.style.backgroundColor = `${themeColor}12`;

    if (!payload.isUpdate) {
      timelines.lowerThird.clear();
      lowerThirdGsap(timelines.lowerThird, { lowerthirdOverlay });
      timelines.lowerThird.play();
    }
  };

  // socket listeners for lower third commands
  socket.on("lowerThird:show", (data) => {
    if (data.matchId !== matchId) return;

    if (data.lowerThird) {
      if (data.lowerThird.isUpdate) {
        applyPosition(data.lowerThird);
        return;
      }
      handleRender(data.lowerThird);
    } else {
      fetch(`/routes/getMatch/${matchId}`)
        .then((res) => res.json())
        .then((resData) => {
          const savedLt = resData.match?.graphics?.lowerThird || {};
          const homeTeam = resData.match?.homeTeam;
          const awayTeam = resData.match?.awayTeam;
          let resolvedColor = "#6366f1";
          if (savedLt.themeMode === "home" && homeTeam?.primaryColor)
            resolvedColor = homeTeam.primaryColor;
          if (savedLt.themeMode === "away" && awayTeam?.primaryColor)
            resolvedColor = awayTeam.primaryColor;
          if (savedLt.themeMode === "custom" && savedLt.customColor)
            resolvedColor = savedLt.customColor;

          const fullPayload = {
            ...savedLt,
            resolvedColor,
          };

          handleRender(fullPayload);
        })
        .catch((err) =>
          console.error("Failed to fetch lowerthird fallback details:", err),
        );
    }
  });

  socket.on("lowerThird:hide", (data) => {
    if (data.matchId !== matchId) return;
    timelines.lowerThird.reverse();
  });
}
