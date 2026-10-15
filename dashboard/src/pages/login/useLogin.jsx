import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

// custom hook for user authentication login
export default function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // fields state for login credentials
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // operational validation and loading states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // toggle text/password input visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // update credentials form state
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

  // client-side input validation
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

  // process credentials submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Send actual login request to the backend
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login Success:", response.data);
      setIsLoading(false);
      setAuthSuccess(true);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Login Error:", err);
      setIsLoading(false);
      setErrors({
        submit:
          err.response?.data?.message ||
          "Login failed. Please check your credentials.",
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
