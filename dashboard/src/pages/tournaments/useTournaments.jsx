import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function useTournaments() {
  const [form, setForm] = useState({
    name: "",
    logo: null,
  });

  const [tournaments, setTournaments] = useState([]);
  const [editTournamentId, setEditTournamentId] = useState(null);

  // Deletion Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState(null);

  // Fetch all tournaments
  const fetchTournaments = async () => {
    try {
      const response = await api.get("/routes/getAllTournaments");

      setTournaments(response.data.tournaments || []);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      toast.error("Failed to load tournaments list!");
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.warning("Tournament name is required!");

      return;
    }

    const formData = new FormData();

    formData.append("name", form.name);

    if (form.logo) {
      formData.append("logo", form.logo);
    }

    try {
      if (editTournamentId) {
        // Update existing tournament
        const response = await api.put(
          `/routes/updateTournament/${editTournamentId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        console.log("Server response:", response.data);
        toast.success("Tournament updated successfully! 🏆");
      } else {
        // Create new tournament
        if (!form.logo) {
          toast.warning("Please select a tournament logo file! 🛡️");

          return;
        }

        const response = await api.post("/routes/createTournament", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Server response:", response.data);
        toast.success("Tournament added successfully! 🎉");
      }

      handleCancelEdit();
      fetchTournaments();
    } catch (error) {
      console.error("Error submitting tournament:", error);
      toast.error(
        error.response?.data?.message || "Failed to save tournament details.",
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({
        ...prev,
        logo: e.target.files[0],
      }));
    }
  };

  const handleEditSelect = (tournament) => {
    setEditTournamentId(tournament.id);
    setForm({
      name: tournament.name,
      logo: null,
    });
    toast.info(`Editing ${tournament.name}...`);
  };

  const handleCancelEdit = () => {
    setEditTournamentId(null);
    setForm({
      name: "",
      logo: null,
    });
  };

  const triggerDelete = (id) => {
    setTournamentToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setTournamentToDelete(null);
  };

  const confirmDelete = async () => {
    if (!tournamentToDelete) return;
    try {
      const response = await api.delete(
        `/routes/deleteTournament/${tournamentToDelete}`,
      );

      console.log("Delete response:", response.data);
      toast.success("Tournament deleted successfully! 🗑️");

      if (editTournamentId === tournamentToDelete) {
        handleCancelEdit();
      }

      fetchTournaments();
    } catch (error) {
      console.error("Error deleting tournament:", error);
      toast.error("Failed to delete tournament.");
    } finally {
      closeDeleteModal();
    }
  };

  return {
    form,
    tournaments,
    editTournamentId,
    handleSubmit,
    handleChange,
    handleFileChange,
    handleEditSelect,
    handleCancelEdit,
    deleteModalOpen,
    triggerDelete,
    closeDeleteModal,
    confirmDelete,
  };
}
