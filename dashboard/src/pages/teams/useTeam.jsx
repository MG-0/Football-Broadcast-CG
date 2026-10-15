import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function useTeams() {
  const [form, setForm] = useState({
    name: "",
    shortName: "",
    coachName: "",
    primaryColor: "#10b981",
    secondaryColor: "#0052d4",
    image: null,
  });

  const [teams, setTeams] = useState([]);
  const [editTeamId, setEditTeamId] = useState(null); // ID of the team being edited

  // Deletion Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  // Fetch all teams from JSON DB
  const fetchTeams = async () => {
    try {
      const response = await api.get("/routes/getAllTeams");

      setTeams(response.data.teams || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load registered teams!");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("shortName", form.shortName);
    formData.append("coachName", form.coachName);
    formData.append("primaryColor", form.primaryColor);
    formData.append("secondaryColor", form.secondaryColor);

    // Append image if selected (optional for edit, required for create)
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      if (editTeamId) {
        // Update existing team
        const response = await api.put(
          `/routes/updateTeam/${editTeamId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        console.log("Server response:", response.data);
        toast.success("Team updated successfully! ⚽");
      } else {
        // Create new team
        if (!form.image) {
          toast.warning("Please select a club logo file! 🛡️");

          return;
        }

        const response = await api.post("/routes/createTeam", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Server response:", response.data);
        toast.success("Team registered successfully! 🎉");
      }

      // Reset form fields and edit state
      handleCancelEdit();

      // Reload the dynamic list
      fetchTeams();
    } catch (error) {
      console.error("Error submitting team:", error);
      toast.error(
        error.response?.data?.message || "Failed to save team details.",
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
        image: e.target.files[0],
      }));
    }
  };

  const handleEditSelect = (team) => {
    setEditTeamId(team.id);
    setForm({
      name: team.name,
      shortName: team.shortName,
      coachName: team.coachName,
      primaryColor: team.primaryColor,
      secondaryColor: team.secondaryColor,
      image: null,
    });
    toast.info(`Editing ${team.name}...`);
  };

  const handleCancelEdit = () => {
    setEditTeamId(null);
    setForm({
      name: "",
      shortName: "",
      coachName: "",
      primaryColor: "#10b981",
      secondaryColor: "#0052d4",
      image: null,
    });
  };

  const triggerDelete = (id) => {
    setTeamToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setTeamToDelete(null);
  };

  const confirmDelete = async () => {
    if (!teamToDelete) return;
    try {
      const response = await api.delete(`/routes/deleteTeam/${teamToDelete}`);

      console.log("Delete response:", response.data);
      toast.success("Team deleted successfully! 🗑️");

      // If we are currently editing the deleted team, cancel edit mode
      if (editTeamId === teamToDelete) {
        handleCancelEdit();
      }

      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team.");
    } finally {
      closeDeleteModal();
    }
  };

  return {
    handleSubmit,
    handleChange,
    form,
    handleFileChange,
    teams,
    editTeamId,
    handleEditSelect,
    handleCancelEdit,
    deleteModalOpen,
    triggerDelete,
    closeDeleteModal,
    confirmDelete,
  };
}
