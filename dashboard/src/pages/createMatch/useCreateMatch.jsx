import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";

// custom hook for match form page
export default function useCreateMatch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editMatchId = searchParams.get("edit"); // Check if we are in edit mode

  // form input state
  const [form, setForm] = useState({
    homeTeamId: "",
    awayTeamId: "",
    tournamentId: "",
    sponsorIds: [],
    matchDate: "",
  });

  // dynamic lists fetched from database
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load selection lists and active match data if editing
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch selections first
        const [teamsRes, tournamentsRes, sponsorsRes] = await Promise.all([
          api.get("/routes/getAllTeams"),
          api.get("/routes/getAllTournaments"),
          api.get("/routes/getAllSponsors"),
        ]);

        setTeams(teamsRes.data.teams || []);
        setTournaments(tournamentsRes.data.tournaments || []);
        setSponsors(sponsorsRes.data.sponsors || []);

        // If editing, fetch the specific match details
        if (editMatchId) {
          const matchRes = await api.get(`/routes/getMatch/${editMatchId}`);
          const match = matchRes.data.match;

          if (match) {
            // Format matchDate to yyyy-MM-ddThh:mm for datetime-local input
            const dateStr = match.matchDate
              ? match.matchDate.substring(0, 16)
              : "";

            setForm({
              homeTeamId: match.homeTeamId,
              awayTeamId: match.awayTeamId,
              tournamentId: match.tournamentId,
              sponsorIds: match.sponsorIds || [],
              matchDate: dateStr,
            });
          }
        }
      } catch (error) {
        console.error("Failed to load match creation data:", error);
        toast.error("Failed to load database assets.");
      }
    };

    loadData();
  }, [editMatchId]);

  // handle standard input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // add or remove sponsor from selection
  const handleSponsorToggle = (sponsorId) => {
    setForm((prev) => {
      const alreadySelected = prev.sponsorIds.includes(sponsorId);
      const newSponsorIds = alreadySelected
        ? prev.sponsorIds.filter((id) => id !== sponsorId)
        : [...prev.sponsorIds, sponsorId];

      return {
        ...prev,
        sponsorIds: newSponsorIds,
      };
    });
  };

  // save match to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.homeTeamId ||
      !form.awayTeamId ||
      !form.tournamentId ||
      !form.matchDate
    ) {
      toast.warning("Please fill in all required fields!");

      return;
    }

    if (form.homeTeamId === form.awayTeamId) {
      toast.warning("Home and Away teams cannot be the same!");

      return;
    }

    setIsLoading(true);

    try {
      if (editMatchId) {
        // Edit existing match: PUT /routes/updateMatch/:id
        const response = await api.put(`/routes/updateMatch/${editMatchId}`, {
          homeTeamId: form.homeTeamId,
          awayTeamId: form.awayTeamId,
          tournamentId: form.tournamentId,
          sponsorIds: form.sponsorIds,
          matchDate: form.matchDate,
        });

        console.log("Match updated response:", response.data);
        toast.success("Match updated successfully! ⚽");
      } else {
        // Create new match: POST /routes/createMatch
        const response = await api.post("/routes/createMatch", {
          homeTeamId: form.homeTeamId,
          awayTeamId: form.awayTeamId,
          tournamentId: form.tournamentId,
          sponsorIds: form.sponsorIds,
          matchDate: form.matchDate,
        });

        console.log("Match created response:", response.data);
        toast.success("Match created successfully! 🎉");
      }

      // Reset form
      setForm({
        homeTeamId: "",
        awayTeamId: "",
        tournamentId: "",
        sponsorIds: [],
        matchDate: "",
      });

      // Redirect back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save match:", error);
      toast.error(error.response?.data?.message || "Failed to save match.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    teams,
    tournaments,
    sponsors,
    isLoading,
    editMatchId,
    handleChange,
    handleSponsorToggle,
    handleSubmit,
  };
}
