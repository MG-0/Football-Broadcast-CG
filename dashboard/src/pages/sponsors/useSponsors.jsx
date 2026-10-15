import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function useSponsors() {
  const [form, setForm] = useState({
    name: "",
    logo: null,
  });

  const [sponsors, setSponsors] = useState([]);
  const [editSponsorId, setEditSponsorId] = useState(null);

  // Deletion Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sponsorToDelete, setSponsorToDelete] = useState(null);

  // Fetch all sponsors
  const fetchSponsors = async () => {
    try {
      const response = await api.get("/routes/getAllSponsors");

      setSponsors(response.data.sponsors || []);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      toast.error("Failed to load sponsors list!");
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.warning("Sponsor name is required!");

      return;
    }

    const formData = new FormData();

    formData.append("name", form.name);

    if (form.logo) {
      formData.append("logo", form.logo);
    }

    try {
      if (editSponsorId) {
        // Update existing sponsor
        const response = await api.put(
          `/routes/updateSponsor/${editSponsorId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        console.log("Server response:", response.data);
        toast.success("Sponsor updated successfully! 🤝");
      } else {
        // Create new sponsor (logo is required on create)
        if (!form.logo) {
          toast.warning("Please select a sponsor logo file! 🛡️");

          return;
        }

        const response = await api.post("/routes/createSponsor", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Server response:", response.data);
        toast.success("Sponsor added successfully! 🎉");
      }

      handleCancelEdit();
      fetchSponsors();
    } catch (error) {
      console.error("Error submitting sponsor:", error);
      toast.error(
        error.response?.data?.message || "Failed to save sponsor details.",
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

  const handleEditSelect = (sponsor) => {
    setEditSponsorId(sponsor.id);
    setForm({
      name: sponsor.name,
      logo: null,
    });
    toast.info(`Editing ${sponsor.name}...`);
  };

  const handleCancelEdit = () => {
    setEditSponsorId(null);
    setForm({
      name: "",
      logo: null,
    });
  };

  const triggerDelete = (id) => {
    setSponsorToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSponsorToDelete(null);
  };

  const confirmDelete = async () => {
    if (!sponsorToDelete) return;
    try {
      const response = await api.delete(
        `/routes/deleteSponsor/${sponsorToDelete}`,
      );

      console.log("Delete response:", response.data);
      toast.success("Sponsor deleted successfully! 🗑️");

      if (editSponsorId === sponsorToDelete) {
        handleCancelEdit();
      }

      fetchSponsors();
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      toast.error("Failed to delete sponsor.");
    } finally {
      closeDeleteModal();
    }
  };

  return {
    form,
    sponsors,
    editSponsorId,
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
