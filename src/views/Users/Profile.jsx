import React, { useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { UserForm } from "../../components/UserForm";
import { useUserForm } from "../../hooks/useUserForm";
import API from "../../service/api";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showConfirmUpdate } = useOutletContext();

  const {
    formData,
    showPassword,
    showConfirmPassword,
    loading,
    setLoading,
    setFormData,
    handleChange,
    togglePasswordVisibility,
    validateForm,
    prepareDataForSubmit,
  } = useUserForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userStorage = JSON.parse(localStorage.getItem("user"));
        const userId = userStorage.id_users;
        const response = await API.get(`/user/me/${userId}`);
        const userData = response.data.data;

        setFormData((prev) => ({
          ...prev,
          name: userData.name,
          no_hp: userData.no_hp,
          id_department: userData.department.name,
          role: userData.role,
          email: userData.email,
        }));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id, setFormData]);

  const handleUpdate = async () => {
    if (!validateForm(true)) return;

    const filteredData = prepareDataForSubmit(true);

    try {
      setLoading(true);
      const userId = localStorage.getItem("id_users");
      await API.put(`/user/me/${userId}`, filteredData);
      navigate("/admin/users");
    } catch (err) {
      setLoading(false);
      alert("Gagal memperbarui user!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showConfirmUpdate(() => handleUpdate());
  };

  return (
    <UserForm
      title="PROFILE"
      formData={formData}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onBack={null}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      onTogglePassword={togglePasswordVisibility}
      submitButtonText="Update"
      isEdit={true}
      loading={loading}
    />
  );
}
