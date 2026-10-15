import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios.js";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";

// connect socket
const socket = io();
const bc = typeof window !== "undefined" && window.BroadcastChannel ? new BroadcastChannel("football_cg_channel") : null;

// match console hook
export default function useMatchConsole() {
  const { id } = useParams();

  const [matchData, setMatchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [overLayStates, setOverLayStates] = useState({
    homeTeam: false,
    awayTeam: false,
    tournament: false,
    startScreen: false,
    sponsors: false,
    weather: false,
    lineup: false,
    tacticalLineup: false,
    scorebug: false,
    statistics: false,
    qrCode: false,
    lowerThird: false,
    notifications: false,
    playerSpotlight: false,
  });

  // Fetch match console metadata details (merged with match details because start-screen endpoint lacks match object)
  const refreshMatchData = useCallback(async () => {
    try {
      console.log("Refreshing match console data for match ID:", id);
      const startScreenResponse = await api.get(
        `/routes/matches/${id}/start-screen`,
      );
      const matchResponse = await api.get(`/routes/getMatch/${id}`);

      console.log("start-screen payload:", startScreenResponse.data);
      console.log("getMatch payload:", matchResponse.data);

      setMatchData({
        ...startScreenResponse.data,
        match: matchResponse.data.match,
      });
    } catch (error) {
      console.error("Failed to fetch/refresh match console details:", error);
      toast.error("Failed to refresh match details");
    }
  }, [id]);

  // fetch data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await refreshMatchData();
      setIsLoading(false);
    };

    fetchInitialData();
  }, [id, refreshMatchData]);

  // toggle specific graphic
  const toggleOverlay = (key, value, customPayload = {}, silent = false) => {
    setOverLayStates((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Redirect tacticalLineup and generalLowerThird to their corresponding socket channels
    let eventKey = key;

    if (key === "tacticalLineup") eventKey = "lineup";

    const eventName = `${eventKey}:${value ? "show" : "hide"}`;

    // Inject layout flag so the overlay can distinguish which graphic to render
    const layoutPayload =
      key === "tacticalLineup" && value
        ? { lineup: { layout: "tactical" } }
        : {};

    // Base payload with shared match metadata
    const finalPayload = {
      matchId: id,
      homeTeam: matchData?.homeTeam,
      awayTeam: matchData?.awayTeam,
      tournament: matchData?.tournament,
      ...layoutPayload,
    };

    // Merge nested lineup structures if present in customPayload
    if (customPayload.lineup) {
      finalPayload.lineup = {
        ...finalPayload.lineup,
        ...customPayload.lineup,
      };
    }

    // Merge scorebug payload directly onto the root if present
    if (customPayload.scorebug) {
      finalPayload.scorebug = customPayload.scorebug;
    }

    // Merge statistics payload directly onto the root if present
    if (customPayload.statistics) {
      finalPayload.statistics = customPayload.statistics;
    }

    // Merge qrCode payload directly onto the root if present
    if (customPayload.qrCode) {
      finalPayload.qrCode = customPayload.qrCode;
    }

    // Merge lowerThird payload directly onto the root if present
    if (customPayload.lowerThird) {
      finalPayload.lowerThird = customPayload.lowerThird;
    }

    // Merge notifications payload directly onto the root if present
    if (customPayload.notifications) {
      finalPayload.notifications = customPayload.notifications;
    }

    // Merge weather payload directly onto the root if present
    if (customPayload.weather) {
      finalPayload.weather = customPayload.weather;
    }

    // Merge sponsors payload directly onto the root if present
    if (customPayload.sponsors) {
      finalPayload.sponsors = customPayload.sponsors;
    }

    // Merge playerSpotlight payload directly onto the root if present
    if (customPayload.playerSpotlight) {
      finalPayload.playerSpotlight = customPayload.playerSpotlight;
    }

    // Merge tournament payload directly onto the root if present
    if (customPayload.tournament) {
      finalPayload.tournament = {
        ...finalPayload.tournament,
        ...customPayload.tournament,
      };
    }

    // Merge startScreen payload directly onto the root if present
    if (customPayload.startScreen) {
      finalPayload.startScreen = customPayload.startScreen;
    }

    socket.emit(eventName, finalPayload);
    if (bc) {
      bc.postMessage({ event: eventName, data: finalPayload });
    }
    if (!silent) {
      toast.info(
        `Graphics overlay '${key}' set to ${value ? "LIVE" : "OFFLINE"}`,
      );
    }
  };

  // Clear all live graphic overlays at once
  const clearAllGraphics = () => {
    Object.keys(overLayStates).forEach((key) => {
      if (overLayStates[key]) {
        // Emit websocket hide event for each active layer silently
        toggleOverlay(key, false, {}, true);
      }
    });
    toast.success("All live graphic overlays have been cleared!");
  };

  return {
    id,
    matchData,
    toggleOverlay,
    isLoading,
    overLayStates,
    refreshMatchData,
    clearAllGraphics,
  };
}
