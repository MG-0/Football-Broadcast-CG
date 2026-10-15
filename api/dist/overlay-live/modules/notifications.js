import { socket, matchId, timelines } from "./core.js";
import {
  notifySubGsap,
  notifyCardGsap,
  notifyVarGsap,
  notifyPenaltyGsap,
  notifyOffsideGsap,
  notifyCustomGsap,
  notifyHydrationGsap,
} from "../animationsGsap.js";

// initialize notifications elements and socket event listeners
export function initNotifications() {
  const notificationsWrapper = document.getElementById("notifications-wrapper");
  const notificationsOverlay = document.getElementById("notifications-overlay");
  const notifySubCard = document.getElementById("notify-sub-card");
  const notifyCardCard = document.getElementById("notify-card-card");
  const notifyVarCard = document.getElementById("notify-var-card");
  const notifyPenaltyCard = document.getElementById("notify-penalty-card");
  const notifyOffsideCard = document.getElementById("notify-offside-card");
  const notifyCustomCard = document.getElementById("notify-custom-card");
  const notifyHydrationCard = document.getElementById("notify-hydration-card");

  // apply screen offsets and scaling properties to the notifications wrapper element
  const applyPosition = (payload) => {
    if (notificationsWrapper) {
      notificationsWrapper.style.bottom = `${payload.yOffset || 50}px`;
      notificationsWrapper.style.left = `calc(50% + ${payload.xOffset || 0}px)`;
      notificationsWrapper.style.transform = `translateX(-50%) scale(${payload.scale || 1})`;
    }
  };

  // listens for display request, matches ID, sets up data values, and triggers the matching graphic timeline
  socket.on("notifications:show", (data) => {
    if (data.matchId !== matchId) return;

    const payload = data.notifications;
    if (!payload || !payload.type) return;

    applyPosition(payload);

    if (payload.isUpdate) {
      if (payload.type === "penalty") {
        const pen = payload.penalty || {};
        const shotsContainer = document.getElementById(
          "penalty-shots-container",
        );
        shotsContainer.innerHTML = "";
        const shots = pen.shots || [];
        shots.forEach((s) => {
          const dot = document.createElement("div");
          dot.className = `penalty-shot-dot ${s.status}`;
          dot.style.left = `${s.x}%`;
          dot.style.top = `${s.y}%`;
          dot.innerHTML = s.status === "goal" ? "⚽" : "✖";
          shotsContainer.appendChild(dot);
        });
      }
      return;
    }

    notifySubCard.style.display = "none";
    notifyCardCard.style.display = "none";
    notifyVarCard.style.display = "none";
    notifyPenaltyCard.style.display = "none";
    notifyOffsideCard.style.display = "none";
    notifyCustomCard.style.display = "none";
    if (notifyHydrationCard) notifyHydrationCard.style.display = "none";

    timelines.notifications.clear();

    if (payload.type === "substitution") {
      const sub = payload.substitution || {};
      if (!sub.playerOut || !sub.playerIn) return;

      document.getElementById("notify-sub-team").textContent =
        sub.teamName || "";

      const outNum = document.getElementById("notify-sub-out-num");
      const outName = document.getElementById("notify-sub-out-name");
      outNum.textContent = sub.playerOut.number;
      outName.textContent = sub.playerOut.name;

      const inNum = document.getElementById("notify-sub-in-num");
      const inName = document.getElementById("notify-sub-in-name");
      inNum.textContent = sub.playerIn.number;
      inName.textContent = sub.playerIn.name;

      const teamColor = sub.teamColor || "#10b981";
      document.getElementById("notify-sub-bar").style.backgroundColor =
        teamColor;
      const badge = document.querySelector(".notify-sub-badge");
      badge.style.color = teamColor;
      badge.style.borderColor = `${teamColor}35`;
      badge.style.backgroundColor = `${teamColor}12`;

      notifySubGsap(timelines.notifications, {
        overlay: notificationsOverlay,
        card: notifySubCard,
      });
    } else if (payload.type === "card") {
      const card = payload.card || {};
      if (!card.player) return;

      const badge = document.getElementById("notify-card-badge");
      const visual = document.getElementById("notify-card-visual");

      badge.textContent = `${card.cardType} card`;
      badge.className = `card-badge ${card.cardType}`;
      visual.className = `card-visual ${card.cardType}`;

      document.getElementById("notify-card-num").textContent =
        card.player.number;
      document.getElementById("notify-card-name").textContent =
        card.player.name;
      document.getElementById("notify-card-team").textContent =
        card.teamName || "";

      notifyCardGsap(timelines.notifications, {
        overlay: notificationsOverlay,
        card: notifyCardCard,
      });
    } else if (payload.type === "var") {
      const v = payload.varCheck || {};
      document.getElementById("notify-var-title").textContent =
        v.title || "VAR CHECK";
      document.getElementById("notify-var-detail").textContent = v.detail || "";

      notifyVarGsap(timelines.notifications, {
        overlay: notificationsOverlay,
        card: notifyVarCard,
      });
    } else if (payload.type === "penalty") {
      const pen = payload.penalty || {};
      document.getElementById("notify-penalty-text").textContent =
        pen.text || "PENALTY KICK";
      document.getElementById("notify-penalty-team").textContent =
        pen.teamName || "";
      document.getElementById("notify-penalty-player").textContent =
        pen.playerName || "";

      const teamColor = pen.teamColor || "#f59e0b";
      document.getElementById("notify-penalty-bar").style.backgroundColor =
        teamColor;
      document.getElementById("notify-penalty-text").style.color = teamColor;

      const shotsContainer = document.getElementById("penalty-shots-container");
      shotsContainer.innerHTML = "";
      const shots = pen.shots || [];
      shots.forEach((s) => {
        const dot = document.createElement("div");
        dot.className = `penalty-shot-dot ${s.status}`;
        dot.style.left = `${s.x}%`;
        dot.style.top = `${s.y}%`;
        dot.innerHTML = s.status === "goal" ? "⚽" : "✖";
        shotsContainer.appendChild(dot);
      });

      notifyPenaltyGsap(timelines.notifications, {
        overlay: notificationsOverlay,
        card: notifyPenaltyCard,
      });
    } else if (payload.type === "offside") {
      const off = payload.offside || {};

      document.getElementById("notify-offside-player").textContent =
        off.playerName || "PLAYER";
      document.getElementById("notify-offside-team").textContent =
        off.teamName || "";

      const offsideColor = off.teamColor || "#22d3ee";
      document.getElementById("notify-offside-bar").style.background =
        `linear-gradient(180deg, ${offsideColor} 0%, ${offsideColor}99 100%)`;

      notifyOffsideGsap(timelines.notifications, {
        overlay: notificationsOverlay,
        card: notifyOffsideCard,
      });
    } else if (payload.type === "custom") {
      const custom = payload.custom || {};

      document.getElementById("notify-custom-player").textContent =
        custom.playerName || "PLAYER";
      document.getElementById("notify-custom-text").textContent =
        custom.customText || "";
      document.getElementById("notify-custom-badge").textContent =
        custom.badgeTitle || "PLAYER PROFILE";

      const teamColor = custom.teamColor || "#f59e0b";
      document.getElementById("notify-custom-bar").style.background =
        `linear-gradient(180deg, ${teamColor} 0%, ${teamColor}99 100%)`;

      document.getElementById("notify-custom-card").style.borderColor =
        `${teamColor}40`;
      document.getElementById("notify-custom-badge").style.color = teamColor;
      document.getElementById("notify-custom-badge").style.borderColor =
        `${teamColor}35`;
      document.getElementById("notify-custom-badge").style.backgroundColor =
        `${teamColor}12`;

      notifyCustomGsap(timelines.notifications, {
        overlay: notificationsOverlay,
        card: notifyCustomCard,
      });
    } else if (payload.type === "hydration") {
      const hyd = payload.hydration || {};

      const titleEl = document.getElementById("notify-hydration-title");
      const detailEl = document.getElementById("notify-hydration-detail");
      const tempEl = document.getElementById("notify-hydration-temp");
      const badgeEl = document.getElementById("notify-hydration-badge");

      if (titleEl) titleEl.textContent = hyd.title || "OFFICIAL COOLING BREAK";
      if (detailEl)
        detailEl.textContent =
          hyd.detail || "TEMPERATURE 32°C • 30' MINUTE";
      if (tempEl) tempEl.textContent = hyd.temp || "32°C";
      if (badgeEl)
        badgeEl.innerHTML = `<span>💧</span> ${hyd.badgeTitle || "HYDRATION BREAK"}`;

      notifyHydrationGsap(timelines.notifications, {
        overlay: notificationsOverlay,
        card: notifyHydrationCard,
      });
    }

    timelines.notifications.play();
  });

  // hides notifications by reversing the active animation
  socket.on("notifications:hide", (data) => {
    if (data.matchId !== matchId) return;
    timelines.notifications.reverse();
  });
}
