import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

// custom hook for dashboard page logic
export default function useDashboard() {
  // state for match list and data feeds
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Deletion Modal States
  // deletion modal control state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);

  // fetch all matches and config files from server
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [matchesRes, teamsRes, tournamentsRes] = await Promise.all([
        api.get("/routes/getAllMatches"),
        api.get("/routes/getAllTeams"),
        api.get("/routes/getAllTournaments"),
      ]);

      setMatches(matchesRes.data.matches || []);
      setTeams(teamsRes.data.teams || []);
      setTournaments(tournamentsRes.data.tournaments || []);
    } catch (error) {
      console.error("Failed to load dashboard matches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // open dialog to confirm match removal
  const triggerDeleteMatch = (id) => {
    setMatchToDelete(id);
    setDeleteModalOpen(true);
  };

  // hide match delete dialog
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setMatchToDelete(null);
  };

  // request backend to delete match
  const confirmDeleteMatch = async () => {
    if (!matchToDelete) return;
    try {
      await api.delete(`/routes/deleteMatch/${matchToDelete}`);
      toast.success("Match deleted successfully! 🗑️");
      loadDashboardData();
    } catch (error) {
      console.error("Failed to delete match:", error);
      toast.error("Failed to delete match workspace.");
    } finally {
      closeDeleteModal();
    }
  };

  // change match phase (live, pending, finished)
  const updateMatchStatus = async (id, newStatus) => {
    try {
      await api.put(`/routes/updateMatch/${id}`, { status: newStatus });
      toast.success(`Match status updated to ${newStatus.toUpperCase()}! ⚽`);
      loadDashboardData();
    } catch (error) {
      console.error("Failed to update match status:", error);
      toast.error("Failed to change match status.");
    }
  };

  // Map IDs to actual objects for rendering
  const resolvedMatches = matches.map((match) => {
    const homeTeam = teams.find((t) => t.id === match.homeTeamId);
    const awayTeam = teams.find((t) => t.id === match.awayTeamId);
    const tournament = tournaments.find((t) => t.id === match.tournamentId);

    return {
      ...match,
      homeTeam,
      awayTeam,
      tournament,
    };
  });

  return {
    matches: resolvedMatches,
    isLoading,
    deleteModalOpen,
    triggerDeleteMatch,
    closeDeleteModal,
    confirmDeleteMatch,
    updateMatchStatus,
    refreshMatches: loadDashboardData,
  };
}
