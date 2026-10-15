import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import api from "../../../../api/axios.js";
import { toast } from "react-toastify";

export default function useLineup() {
  const { matchData, overLayStates, toggleOverlay, refreshMatchData } =
    useOutletContext();
  const { id } = useParams();

  const isLive = overLayStates.lineup || false;
  const isTacticalLive = overLayStates.tacticalLineup || false;

  const [activeTab, setActiveTab] = useState("home");
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [homeFormation, setHomeFormation] = useState("4-3-3");
  const [awayFormation, setAwayFormation] = useState("4-4-2");
  const [homeCoach, setHomeCoach] = useState("");
  const [awayCoach, setAwayCoach] = useState("");
  const [lineupAssignments, setLineupAssignments] = useState({});

  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [scale, setScale] = useState(1);

  // Add player form states
  const [playerName, setPlayerName] = useState("");
  const [playerNumber, setPlayerNumber] = useState("");
  const [playerPosition, setPlayerPosition] = useState("GK");

  // Fetch squad details and saved lineup configurations
  useEffect(() => {
    if (matchData) {
      setHomePlayers(matchData.homeTeam?.players || []);
      setAwayPlayers(matchData.awayTeam?.players || []);
      setHomeCoach(matchData.homeTeam?.coachName || "");
      setAwayCoach(matchData.awayTeam?.coachName || "");

      const existingLineup = matchData.match?.graphics?.lineup || {};
      const initialAssignments = {};

      if (existingLineup.home) {
        setHomeFormation(existingLineup.home.formation || "4-3-3");
        if (existingLineup.home.coachName)
          setHomeCoach(existingLineup.home.coachName);
        (existingLineup.home.starters || []).forEach((p) => {
          initialAssignments[p.id] = "starter";
        });
        (existingLineup.home.bench || []).forEach((p) => {
          initialAssignments[p.id] = "bench";
        });
      }

      if (existingLineup.away) {
        setAwayFormation(existingLineup.away.formation || "4-4-2");
        if (existingLineup.away.coachName)
          setAwayCoach(existingLineup.away.coachName);
        (existingLineup.away.starters || []).forEach((p) => {
          initialAssignments[p.id] = "starter";
        });
        (existingLineup.away.bench || []).forEach((p) => {
          initialAssignments[p.id] = "bench";
        });
      }

      setLineupAssignments(initialAssignments);
      setXOffset(existingLineup.xOffset ?? 0);
      setYOffset(existingLineup.yOffset ?? 0);
      setScale(existingLineup.scale ?? 1);
    }
  }, [matchData]);

  // Add a new player manually to the selected team roster list
  const handleAddPlayer = async (e) => {
    if (e) e.preventDefault();
    if (!playerName.trim() || !playerNumber.trim()) {
      toast.warning("Player name and number are required.");

      return;
    }

    const teamId =
      activeTab === "home" ? matchData.homeTeam?.id : matchData.awayTeam?.id;
    const activePlayers = activeTab === "home" ? homePlayers : awayPlayers;

    const newPlayer = {
      id: "temp_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      name: playerName.trim(),
      number: playerNumber.trim(),
      position: playerPosition,
    };

    const updatedPlayers = [...activePlayers, newPlayer];

    try {
      await api.put(`/routes/updateTeam/${teamId}`, {
        players: updatedPlayers,
      });

      if (activeTab === "home") {
        setHomePlayers(updatedPlayers);
      } else {
        setAwayPlayers(updatedPlayers);
      }

      setPlayerName("");
      setPlayerNumber("");
      setPlayerPosition("GK");
      toast.success("Player added to team roster successfully!");
    } catch (error) {
      console.error("Failed to add player:", error);
      toast.error("Failed to add player to database.");
    }
  };

  // Modify coach/manager name locally
  const handleUpdateCoach = (name) => {
    if (activeTab === "home") setHomeCoach(name);
    else setAwayCoach(name);
  };

  // Delete a player permanently from database
  const handleDeletePlayer = async (playerId) => {
    const teamId =
      activeTab === "home" ? matchData.homeTeam?.id : matchData.awayTeam?.id;
    const activePlayers = activeTab === "home" ? homePlayers : awayPlayers;

    if (!teamId) return;

    const updatedPlayers = activePlayers.filter((p) => p.id !== playerId);

    try {
      await api.put(`/routes/updateTeam/${teamId}`, {
        players: updatedPlayers,
      });

      if (activeTab === "home") {
        setHomePlayers(updatedPlayers);
      } else {
        setAwayPlayers(updatedPlayers);
      }

      setLineupAssignments((prev) => {
        const copy = { ...prev };

        delete copy[playerId];

        return copy;
      });

      toast.success("Player removed from roster.");
    } catch (error) {
      console.error("Failed to delete player:", error);
      toast.error("Failed to remove player.");
    }
  };

  // Assign player type (starter/bench/out) with validation limits
  const handleAssignPlayer = (playerId, type) => {
    if (type === "starter") {
      const currentAssignment = lineupAssignments[playerId];

      if (currentAssignment !== "starter") {
        const activePlayers = activeTab === "home" ? homePlayers : awayPlayers;
        const currentStartersCount = activePlayers.filter(
          (player) => lineupAssignments[player.id] === "starter",
        ).length;

        if (currentStartersCount >= 11) {
          toast.warning(
            "You cannot assign more than 11 starters! Remove a starter first.",
          );

          return;
        }
      }
    }

    setLineupAssignments((prev) => ({
      ...prev,
      [playerId]: type,
    }));
  };

  const getHomeStarters = () =>
    homePlayers.filter((p) => lineupAssignments[p.id] === "starter");
  const getHomeBench = () =>
    homePlayers.filter((p) => lineupAssignments[p.id] === "bench");

  const getAwayStarters = () =>
    awayPlayers.filter((p) => lineupAssignments[p.id] === "starter");
  const getAwayBench = () =>
    awayPlayers.filter((p) => lineupAssignments[p.id] === "bench");

  const getLineupData = () => {
    return {
      home: {
        formation: homeFormation,
        coachName: homeCoach,
        starters: getHomeStarters(),
        bench: getHomeBench(),
      },
      away: {
        formation: awayFormation,
        coachName: awayCoach,
        starters: getAwayStarters(),
        bench: getAwayBench(),
      },
      xOffset,
      yOffset,
      scale,
    };
  };

  // Save configurations permanently
  const handleSaveLineup = async () => {
    const payload = getLineupData();

    try {
      await api.patch(`/routes/matches/${id}/lineup`, payload);

      if (matchData.homeTeam?.id) {
        await api.put(`/routes/updateTeam/${matchData.homeTeam.id}`, {
          coachName: homeCoach,
        });
      }
      if (matchData.awayTeam?.id) {
        await api.put(`/routes/updateTeam/${matchData.awayTeam.id}`, {
          coachName: awayCoach,
        });
      }

      if (refreshMatchData) {
        await refreshMatchData();
      }

      toast.success("Lineups and Managers configurations saved!");
    } catch (error) {
      console.error("Failed to save lineups:", error);
      toast.error("Failed to save lineups.");
    }
  };

  // Handle showing classic listing graphic overlay
  const handleShowLineup = (silent = false) => {
    const isSilent = silent === true;

    toggleOverlay(
      "lineup",
      true,
      {
        lineup: {
          activeTeam: activeTab,
          teamName:
            activeTab === "home"
              ? matchData.homeTeam?.name
              : matchData.awayTeam?.name,
          teamLogo:
            activeTab === "home"
              ? matchData.homeTeam?.imageUrl
              : matchData.awayTeam?.imageUrl,
          homeTeamColors: {
            primary: matchData.homeTeam?.primaryColor,
            secondary: matchData.homeTeam?.secondaryColor,
          },
          awayTeamColors: {
            primary: matchData.awayTeam?.primaryColor,
            secondary: matchData.awayTeam?.secondaryColor,
          },
          isUpdate: isSilent,
          ...getLineupData(),
        },
      },
      isSilent,
    );
  };

  // Handle showing tactical pitch lineup graphic overlay
  const handleShowTacticalLineup = (silent = false) => {
    const isSilent = silent === true;

    toggleOverlay(
      "tacticalLineup",
      true,
      {
        lineup: {
          activeTeam: activeTab,
          teamName:
            activeTab === "home"
              ? matchData.homeTeam?.name
              : matchData.awayTeam?.name,
          teamLogo:
            activeTab === "home"
              ? matchData.homeTeam?.imageUrl
              : matchData.awayTeam?.imageUrl,
          homeTeamColors: {
            primary: matchData.homeTeam?.primaryColor,
            secondary: matchData.homeTeam?.secondaryColor,
          },
          awayTeamColors: {
            primary: matchData.awayTeam?.primaryColor,
            secondary: matchData.awayTeam?.secondaryColor,
          },
          isUpdate: isSilent,
          ...getLineupData(),
        },
      },
      isSilent,
    );
  };

  // Real-time synchronization when active
  useEffect(() => {
    if (isLive) {
      handleShowLineup(true);
    } else if (isTacticalLive) {
      handleShowTacticalLineup(true);
    }
  }, [xOffset, yOffset, scale]);

  return {
    matchData,
    isLive,
    isTacticalLive,
    toggleOverlay,
    activeTab,
    setActiveTab,
    homePlayers,
    awayPlayers,
    homeFormation,
    setHomeFormation,
    awayFormation,
    setAwayFormation,
    homeCoach,
    setHomeCoach,
    awayCoach,
    setAwayCoach,
    lineupAssignments,
    playerName,
    setPlayerName,
    playerNumber,
    setPlayerNumber,
    playerPosition,
    setPlayerPosition,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    scale,
    setScale,
    handleAddPlayer,
    handleUpdateCoach,
    handleDeletePlayer,
    handleAssignPlayer,
    getHomeStarters,
    getHomeBench,
    getAwayStarters,
    getAwayBench,
    handleSaveLineup,
    handleShowLineup,
    handleShowTacticalLineup,
  };
}
