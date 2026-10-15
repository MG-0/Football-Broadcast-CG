import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

// custom hook for operator registration
export default function useRegister() {
  const navigate = useNavigate();

  // user fields form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // form errors and indicators
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // reveal or hide password input
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // change handler for register inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // validate signup credentials
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // submit credentials to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Send actual registration request to the backend
      const response = await api.post("/users/register", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Registration Success:", response.data);
      setIsLoading(false);
      setAuthSuccess(true);

      // Redirect to login after successful register
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration Error:", err);
      setIsLoading(false);
      setErrors({
        submit:
          err.response?.data?.message ||
          "Registration failed. Please check your information.",
      });
    }
  };

  return {
    formData,
    errors,
    isLoading,
    showPassword,
    authSuccess,
    togglePasswordVisibility,
    handleChange,
    handleSubmit,
    setErrors,
  };
}
