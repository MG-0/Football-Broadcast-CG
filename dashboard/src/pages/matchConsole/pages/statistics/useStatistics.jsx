import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import api from "../../../../api/axios.js";
import { toast } from "react-toastify";

export default function useStatistics() {
  const { matchData, overLayStates, toggleOverlay, refreshMatchData } =
    useOutletContext();
  const { id } = useParams();

  const isLive = overLayStates.statistics || false;

  const [period, setPeriod] = useState("FULL TIME");
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [scale, setScale] = useState(1);

  const [stats, setStats] = useState({
    goals: { home: 0, away: 0 },
    possession: { home: 50, away: 50 },
    shots: { home: 0, away: 0 },
    shotsOnTarget: { home: 0, away: 0 },
    corners: { home: 0, away: 0 },
    fouls: { home: 0, away: 0 },
    yellowCards: { home: 0, away: 0 },
    redCards: { home: 0, away: 0 },
    offsides: { home: 0, away: 0 },
    saves: { home: 0, away: 0 },
    passes: { home: 0, away: 0 },
  });

  // Load saved match statistics on mount or when matchData updates
  useEffect(() => {
    if (matchData?.match?.graphics?.statistics) {
      const saved = matchData.match.graphics.statistics;
      const savedStats = saved.stats || saved;

      setStats(savedStats);
      if (saved.period) {
        setPeriod(saved.period);
      }
      setXOffset(saved.xOffset ?? 0);
      setYOffset(saved.yOffset ?? 0);
      setScale(saved.scale ?? 1);
    }
  }, [matchData]);

  // Update statistics dynamically, handling possession auto-balancing (must sum to 100)
  const handleUpdate = (statKey, team, value) => {
    const numericValue = Math.max(0, Number(value));

    setStats((prev) => {
      const newStats = { ...prev };

      newStats[statKey] = { ...newStats[statKey], [team]: numericValue };

      if (statKey === "possession") {
        const otherTeam = team === "home" ? "away" : "home";
        const clampedValue = Math.min(100, numericValue);

        newStats[statKey][team] = clampedValue;
        newStats[statKey][otherTeam] = 100 - clampedValue;
      }

      return newStats;
    });
  };

  const getPayload = (isUpdate = false) => ({
    period,
    stats,
    xOffset,
    yOffset,
    scale,
    isUpdate,
  });

  // Save current stats permanently to database.json
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.patch(`/routes/matches/${id}/statistics`, getPayload(false));
      if (refreshMatchData) {
        await refreshMatchData();
      }
      toast.success("Match Statistics saved to database!");
    } catch (error) {
      console.error("Failed to save match statistics:", error);
      toast.error("Failed to save match statistics.");
    }
  };

  // Single Live Toggle Handler
  const handleToggleLive = () => {
    if (isLive) {
      toggleOverlay("statistics", false);
    } else {
      toggleOverlay("statistics", true, { statistics: getPayload(false) });
    }
  };

  // Real-time Auto-Sync emitter when the graphic is live
  useEffect(() => {
    if (isLive) {
      toggleOverlay("statistics", true, { statistics: getPayload(true) }, true);
    }
  }, [stats, period, xOffset, yOffset, scale, isLive]);

  // Extract team data for preview
  const homeTeam = matchData?.homeTeam;
  const awayTeam = matchData?.awayTeam;
  const homeScore = stats.goals?.home ?? 0;
  const awayScore = stats.goals?.away ?? 0;

  const logoUrl = (img) =>
    img ? `/uploads/misc/${img}` : null;

  return {
    logoUrl,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    handleSave,
    handleUpdate,
    handleToggleLive,
    isLive,
    matchData,
    period,
    setPeriod,
    stats,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    scale,
    setScale,
  };
}
