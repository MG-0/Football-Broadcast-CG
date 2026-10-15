import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import api from "../../../../api/axios.js";
import { toast } from "react-toastify";
import { DEFAULT_NOTIFICATIONS_STATE } from "../../config/layersConfig.js";

export default function useNotifications() {
  const { matchData, overLayStates, toggleOverlay, refreshMatchData } =
    useOutletContext();
  const { id } = useParams();

  const isLive = overLayStates.notifications || false;
  const [form, setForm] = useState(DEFAULT_NOTIFICATIONS_STATE);
  const [activeTab, setActiveTab] = useState("substitution");
  const [activeShotStatus, setActiveShotStatus] = useState("goal");

  // Load saved data from DB on mount/matchData update
  useEffect(() => {
    const saved =
      matchData?.match?.graphics?.notifications ||
      matchData?.match?.graphics?.notification;

    if (saved) {
      setForm({ ...DEFAULT_NOTIFICATIONS_STATE, ...saved });
      if (saved.type) setActiveTab(saved.type);
    }
  }, [matchData]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const adjustOffset = (key, amount) => {
    setForm((prev) => {
      const minVal = key === "xOffset" ? -800 : 0;
      const maxVal = key === "xOffset" ? 800 : 600;

      return {
        ...prev,
        [key]: Math.max(minVal, Math.min(maxVal, (prev[key] || 0) + amount)),
      };
    });
  };

  // Add a shot on the penalty goal net
  const handleGoalClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newShot = { x, y, status: activeShotStatus };

    handleChange("penaltyShots", [...(form.penaltyShots || []), newShot]);
  };

  const clearShots = () => {
    handleChange("penaltyShots", []);
  };

  // Get list of players for home/away teams
  const homeTeam = matchData?.homeTeam || {};
  const awayTeam = matchData?.awayTeam || {};
  const homeStarters = matchData?.match?.graphics?.lineup?.home?.starters || [];
  const homeBench = matchData?.match?.graphics?.lineup?.home?.bench || [];
  const awayStarters = matchData?.match?.graphics?.lineup?.away?.starters || [];
  const awayBench = matchData?.match?.graphics?.lineup?.away?.bench || [];

  const getSubPlayers = (teamKey) => {
    if (teamKey === "home") {
      return { starters: homeStarters, bench: homeBench };
    }

    return { starters: awayStarters, bench: awayBench };
  };

  const getCardPlayers = (teamKey) => {
    if (teamKey === "home") {
      return [...homeStarters, ...homeBench];
    }

    return [...awayStarters, ...awayBench];
  };

  const getPayload = () => {
    const payload = {
      ...form,
      type: activeTab,
      yOffset: form.yOffset !== undefined ? form.yOffset : 50,
      xOffset: form.xOffset !== undefined ? form.xOffset : 0,
      scale: form.scale !== undefined ? form.scale : 1,
    };

    if (activeTab === "substitution") {
      const { starters, bench } = getSubPlayers(form.subTeam);
      const playerOut =
        starters.find((p) => p.id === form.subPlayerOutId) || starters[0];
      const playerIn =
        bench.find((p) => p.id === form.subPlayerInId) || bench[0];
      const teamDetails = form.subTeam === "home" ? homeTeam : awayTeam;

      payload.substitution = {
        team: form.subTeam,
        teamName: teamDetails.name,
        teamColor: teamDetails.primaryColor,
        playerOut: playerOut
          ? { name: playerOut.name, number: playerOut.number }
          : null,
        playerIn: playerIn
          ? { name: playerIn.name, number: playerIn.number }
          : null,
      };
    } else if (activeTab === "card") {
      const players = getCardPlayers(form.cardTeam);
      const player =
        players.find((p) => p.id === form.cardPlayerId) || players[0];
      const teamDetails = form.cardTeam === "home" ? homeTeam : awayTeam;

      payload.card = {
        team: form.cardTeam,
        teamName: teamDetails.name,
        player: player ? { name: player.name, number: player.number } : null,
        cardType: form.cardType,
      };
    } else if (activeTab === "var") {
      payload.varCheck = {
        title: form.varTitle,
        detail: form.varDetail,
      };
    } else if (activeTab === "penalty") {
      const teamDetails = form.penaltyTeam === "home" ? homeTeam : awayTeam;

      payload.penalty = {
        team: form.penaltyTeam,
        teamName: teamDetails.name,
        teamColor: teamDetails.primaryColor,
        text: form.penaltyText,
        playerName: form.penaltyPlayerName,
        shots: form.penaltyShots || [],
      };
    } else if (activeTab === "offside") {
      const teamDetails = form.offsideTeam === "home" ? homeTeam : awayTeam;
      const offsidePlayers = getCardPlayers(form.offsideTeam);
      const offsidePlayer =
        offsidePlayers.find((p) => p.id === form.offsidePlayerId) || null;

      payload.offside = {
        team: form.offsideTeam,
        teamName: teamDetails.name,
        teamColor: teamDetails.primaryColor,
        playerName: offsidePlayer ? offsidePlayer.name : "",
      };
    } else if (activeTab === "custom") {
      const teamDetails = form.customTeam === "home" ? homeTeam : awayTeam;

      payload.custom = {
        team: form.customTeam,
        teamName: teamDetails.name,
        teamColor: teamDetails.primaryColor,
        playerName: form.customPlayerName || "",
        customText: form.customText || "",
        badgeTitle: form.customBadgeTitle || "PLAYER PROFILE",
      };
    } else if (activeTab === "hydration") {
      const minute = form.hydrationMinute || "30'";
      const temp = form.hydrationTemp || "32°C";
      const detail =
        form.hydrationDetail?.trim() || `TEMPERATURE ${temp} • ${minute} MINUTE`;

      payload.hydration = {
        title: form.hydrationTitle || "OFFICIAL COOLING BREAK",
        detail: detail,
        minute: minute,
        badgeTitle: form.hydrationBadgeTitle || "HYDRATION BREAK",
        temp: temp,
      };
    }

    return payload;
  };

  // Save current configurations permanently
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.patch(`/routes/matches/${id}/notifications`, getPayload());
      if (refreshMatchData) await refreshMatchData();
      toast.success("Notification settings saved successfully!");
    } catch (error) {
      console.error("Failed to save notification settings:", error);
      toast.error("Failed to save notification settings.");
    }
  };

  // Single Live Toggle
  const handleToggleLive = () => {
    if (isLive) {
      toggleOverlay("notifications", false);
    } else {
      toggleOverlay("notifications", true, { notifications: getPayload() });
    }
  };

  // Real-time updates when live (with isUpdate: true flag to prevent GSAP flashing)
  useEffect(() => {
    if (isLive) {
      toggleOverlay(
        "notifications",
        true,
        {
          notifications: { ...getPayload(), isUpdate: true },
        },
        true,
      );
    }
  }, [form, activeTab, isLive]);

  const currentPayload = getPayload();

  return {
    isLive,
    form,
    setForm,
    activeTab,
    setActiveTab,
    activeShotStatus,
    setActiveShotStatus,
    handleChange,
    adjustOffset,
    handleGoalClick,
    clearShots,
    homeTeam,
    awayTeam,
    getSubPlayers,
    getCardPlayers,
    handleSave,
    handleToggleLive,
    currentPayload,
  };
}
