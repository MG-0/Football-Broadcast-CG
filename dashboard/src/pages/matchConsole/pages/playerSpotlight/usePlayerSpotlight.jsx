import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import api from "../../../../api/axios.js";
import { toast } from "react-toastify";
import { DEFAULT_SPOTLIGHT_STATE } from "../../config/layersConfig.js";

export default function usePlayerSpotlight() {
  const { matchData, overLayStates, toggleOverlay, refreshMatchData } =
    useOutletContext();
  const { id } = useParams();

  const isLive = overLayStates.playerSpotlight || false;
  const [form, setForm] = useState(DEFAULT_SPOTLIGHT_STATE);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Manage local image file blob url for instant dashboard preview
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);

      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl("");
    }
  }, [imageFile]);

  // Load saved data from DB on mount/update
  useEffect(() => {
    const saved = matchData?.match?.graphics?.playerSpotlight;

    if (saved) {
      const cleaned = {};

      Object.keys(DEFAULT_SPOTLIGHT_STATE).forEach((key) => {
        if (saved[key] !== undefined) {
          cleaned[key] = saved[key];
        }
      });
      setForm({ ...DEFAULT_SPOTLIGHT_STATE, ...cleaned });
      setImageFile(null); // Reset upload input on reload
    }
  }, [matchData]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const adjustOffset = (key, amount) => {
    setForm((prev) => {
      const minVal = key === "xOffset" ? -800 : -600;
      const maxVal = key === "xOffset" ? 800 : 600;

      return {
        ...prev,
        [key]: Math.max(minVal, Math.min(maxVal, (prev[key] || 0) + amount)),
      };
    });
  };

  // Get lists of players for home/away teams from lineup settings
  const homeTeam = matchData?.homeTeam || {};
  const awayTeam = matchData?.awayTeam || {};
  const homeStarters = matchData?.match?.graphics?.lineup?.home?.starters || [];
  const homeBench = matchData?.match?.graphics?.lineup?.home?.bench || [];
  const awayStarters = matchData?.match?.graphics?.lineup?.away?.starters || [];
  const awayBench = matchData?.match?.graphics?.lineup?.away?.bench || [];

  const getTeamPlayers = (teamKey) => {
    if (teamKey === "home") {
      return [...homeStarters, ...homeBench];
    }

    return [...awayStarters, ...awayBench];
  };

  // Auto-fill position when player changes
  const handlePlayerChange = (playerId) => {
    const players = getTeamPlayers(form.team);
    const selectedPlayer = players.find((p) => p.id === playerId);

    if (selectedPlayer) {
      setForm((prev) => ({
        ...prev,
        playerId: selectedPlayer.id,
        playerName: selectedPlayer.name,
        position: selectedPlayer.position || prev.position,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        playerId: "",
        playerName: "",
      }));
    }
  };

  const getPayload = () => {
    const teamDetails = form.team === "home" ? homeTeam : awayTeam;
    let resolvedImg = previewUrl || form.playerImgUrl;

    // Resolve relative path if it's a saved local filename from express upload
    if (
      resolvedImg &&
      !resolvedImg.startsWith("http://") &&
      !resolvedImg.startsWith("https://") &&
      !resolvedImg.startsWith("blob:") &&
      !resolvedImg.startsWith("data:")
    ) {
      resolvedImg = `/uploads/players/${resolvedImg}`;
    }

    return {
      ...form,
      playerImgUrl: resolvedImg,
      teamName: teamDetails.name,
      teamShortName: teamDetails.shortName || teamDetails.name,
      teamLogo: teamDetails.imageUrl,
      teamColor: teamDetails.primaryColor || "#3b82f6",
    };
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      const payload = getPayload();

      const formData = new FormData();

      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Append all form keys
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      formData.append("teamName", payload.teamName);
      formData.append("teamShortName", payload.teamShortName);
      formData.append("teamLogo", payload.teamLogo);
      formData.append("teamColor", payload.teamColor);

      await api.patch(`/routes/matches/${id}/player-spotlight`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Player Spotlight settings saved successfully!");
      setImageFile(null); // Clear local file state
      if (refreshMatchData) await refreshMatchData();
    } catch (error) {
      console.error("Failed to save player spotlight settings:", error);
      toast.error("Failed to save spotlight settings.");
    }
  };

  const handleToggleLive = () => {
    if (imageFile) {
      toast.warning(
        "Please save to database first to upload the image before showing it live!",
      );

      return;
    }

    if (isLive) {
      toggleOverlay("playerSpotlight", false);
    } else {
      toggleOverlay("playerSpotlight", true, { playerSpotlight: getPayload() });
    }
  };

  // Real-time updates when live (with isUpdate: true flag to prevent GSAP flashing)
  useEffect(() => {
    if (isLive) {
      toggleOverlay(
        "playerSpotlight",
        true,
        {
          playerSpotlight: { ...getPayload(), isUpdate: true },
        },
        true,
      );
    }
  }, [form, previewUrl, isLive]);

  const currentPayload = getPayload();

  return {
    isLive,
    form,
    setForm,
    imageFile,
    setImageFile,
    previewUrl,
    handleChange,
    adjustOffset,
    homeTeam,
    awayTeam,
    getTeamPlayers,
    handlePlayerChange,
    handleSave,
    handleToggleLive,
    currentPayload,
  };
}
