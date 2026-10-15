import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import api from "../../../../api/axios.js";
import { toast } from "react-toastify";

export default function useSponsors() {
  const { matchData, overLayStates, toggleOverlay, refreshMatchData } =
    useOutletContext();
  const { id } = useParams();

  const [sponsorsList, setSponsorsList] = useState([]);
  const [selectedSponsorIds, setSelectedSponsorIds] = useState([]);
  const [isLoadingSponsors, setIsLoadingSponsors] = useState(true);
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [scale, setScale] = useState(1);

  const isLive = overLayStates.sponsors || false;

  // Fetch assigned sponsors for this match
  useEffect(() => {
    const fetchMatchSponsors = async () => {
      try {
        setIsLoadingSponsors(true);
        const response = await api.get(`/routes/matches/${id}/sponsors`);
        const sponsors = response.data.sponsors || [];

        setSponsorsList(sponsors);

        // Default to all selected if no settings saved yet
        if (!matchData?.match?.graphics?.sponsors) {
          setSelectedSponsorIds(sponsors.map((s) => s.id));
        }
      } catch (error) {
        console.error("Failed to load match sponsors:", error);
      } finally {
        setIsLoadingSponsors(false);
      }
    };

    fetchMatchSponsors();
  }, [id, matchData]);

  // Load saved configuration settings
  useEffect(() => {
    const settings = matchData?.match?.graphics?.sponsors;

    if (settings) {
      if (settings.selectedSponsorIds) {
        setSelectedSponsorIds(settings.selectedSponsorIds);
      }
      setXOffset(settings.xOffset ?? 0);
      setYOffset(settings.yOffset ?? 0);
      setScale(settings.scale ?? 1);
    }
  }, [matchData]);

  // Toggle selection check state
  const toggleSponsorSelection = (sponsorId) => {
    setSelectedSponsorIds((prev) =>
      prev.includes(sponsorId)
        ? prev.filter((id) => id !== sponsorId)
        : [...prev, sponsorId],
    );
  };

  const getSelectedSponsorsList = () => {
    return sponsorsList.filter((s) => selectedSponsorIds.includes(s.id));
  };

  // Emit show payload to socket
  const handleToggleLive = () => {
    const payload = {
      sponsors: {
        list: getSelectedSponsorsList(),
        xOffset,
        yOffset,
        scale,
      },
    };

    toggleOverlay("sponsors", !isLive, payload);
  };

  // Save selection configurations to DB
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.patch(`/routes/matches/${id}/sponsors`, {
        selectedSponsorIds,
        xOffset,
        yOffset,
        scale,
      });
      if (refreshMatchData) await refreshMatchData();
      toast.success("Sponsors configuration saved to database!");
    } catch (err) {
      console.error("Save sponsors settings error:", err);
      toast.error("Failed to save sponsors configuration.");
    }
  };

  // Real-time synchronization with active socket overlays when settings change
  useEffect(() => {
    if (isLive) {
      toggleOverlay(
        "sponsors",
        true,
        {
          sponsors: {
            list: getSelectedSponsorsList(),
            xOffset,
            yOffset,
            scale,
            isUpdate: true,
          },
        },
        true,
      );
    }
  }, [selectedSponsorIds, xOffset, yOffset, scale, isLive]);

  return {
    matchData,
    sponsorsList,
    selectedSponsorIds,
    isLoadingSponsors,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    scale,
    setScale,
    isLive,
    toggleSponsorSelection,
    getSelectedSponsorsList,
    handleToggleLive,
    handleSaveSettings,
  };
}
