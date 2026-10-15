import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import api from "../../../../api/axios.js";
import { toast } from "react-toastify";

export default function useTournament() {
  const { matchData, overLayStates, toggleOverlay, refreshMatchData } =
    useOutletContext();
  const { id } = useParams();

  const isLive = overLayStates.tournament || false;

  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [scale, setScale] = useState(1);

  // Load saved positions
  useEffect(() => {
    const saved = matchData?.match?.graphics?.tournament;

    if (saved) {
      setXOffset(saved.xOffset ?? 0);
      setYOffset(saved.yOffset ?? 0);
      setScale(saved.scale ?? 1);
    }
  }, [matchData]);

  // Save parameters to database
  const handleSave = async () => {
    try {
      await api.patch(`/routes/matches/${id}/tournament`, {
        xOffset,
        yOffset,
        scale,
      });
      toast.success("Tournament watermark settings saved successfully!");
      if (refreshMatchData) await refreshMatchData();
    } catch (error) {
      console.error("Failed to save tournament settings:", error);
      toast.error("Failed to save watermark settings.");
    }
  };

  const handleToggleLive = () => {
    if (isLive) {
      toggleOverlay("tournament", false);
    } else {
      toggleOverlay("tournament", true, {
        tournament: { xOffset, yOffset, scale },
      });
    }
  };

  // Real-time offset and scale tracking when live
  useEffect(() => {
    if (isLive) {
      toggleOverlay(
        "tournament",
        true,
        {
          tournament: { xOffset, yOffset, scale, isUpdate: true },
        },
        true,
      );
    }
  }, [xOffset, yOffset, scale, isLive]);

  return {
    matchData,
    isLive,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    scale,
    setScale,
    handleSave,
    handleToggleLive,
  };
}
