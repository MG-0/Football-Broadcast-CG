import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import api from "../../../../api/axios.js";
import { toast } from "react-toastify";
import { DEFAULT_LOWER_THIRD_STATE } from "../../config/layersConfig.js";

export default function useLowerThird() {
  const { matchData, overLayStates, toggleOverlay, refreshMatchData } =
    useOutletContext();
  const { id } = useParams();

  const isLive = overLayStates.lowerThird || false;
  const [form, setForm] = useState(DEFAULT_LOWER_THIRD_STATE);

  // Load saved data from DB on mount or when matchData updates
  useEffect(() => {
    const saved = matchData?.match?.graphics?.lowerThird;

    if (saved) {
      setForm({ ...DEFAULT_LOWER_THIRD_STATE, ...saved });
    }
  }, [matchData]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const adjustOffset = (amount) => {
    setForm((prev) => ({
      ...prev,
      yOffset: Math.max(0, Math.min(600, (prev.yOffset || 50) + amount)),
    }));
  };

  // Calculates color dynamically based on themeMode
  const getPayload = () => {
    let resolvedColor = form.customColor;

    if (form.themeMode === "home") {
      resolvedColor = matchData?.homeTeam?.primaryColor || "#6366f1";
    } else if (form.themeMode === "away") {
      resolvedColor = matchData?.awayTeam?.primaryColor || "#ec4899";
    }

    return {
      ...form,
      resolvedColor,
    };
  };

  // Save current configurations permanently to database.json
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.patch(`/routes/matches/${id}/lower-third`, getPayload());
      if (refreshMatchData) await refreshMatchData();
      toast.success("Lower Third saved successfully!");
    } catch (error) {
      console.error("Failed to save lowerthird:", error);
      toast.error("Failed to save Lower Third.");
    }
  };

  // Single Toggle Handler
  const handleToggleLive = () => {
    if (isLive) {
      toggleOverlay("lowerThird", false);
    } else {
      toggleOverlay("lowerThird", true, { lowerThird: getPayload() });
    }
  };

  // Real-time updates when live (with isUpdate: true flag to prevent GSAP flashing)
  useEffect(() => {
    if (isLive) {
      toggleOverlay(
        "lowerThird",
        true,
        {
          lowerThird: { ...getPayload(), isUpdate: true },
        },
        true,
      );
    }
  }, [form, isLive]);

  const currentPayload = getPayload();

  return {
    isLive,
    form,
    setForm,
    handleChange,
    adjustOffset,
    handleSave,
    handleToggleLive,
    currentPayload,
    matchData,
  };
}
