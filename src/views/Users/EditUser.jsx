import React, { useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { UserForm } from "../../components/UserForm";
import { useUserForm } from "../../hooks/useUserForm";
import API from "../../service/api";

export default function EditUsers() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showConfirmUpdate } = useOutletContext();

    const {
        formData,
        setFormData,
        showPassword,
        showConfirmPassword,
        handleChange,
        togglePasswordVisibility,
        validateForm,
        prepareDataForSubmit,
    } = useUserForm();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem("id_users");
                const response = await API.get(`/user/${userId}`);
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
            const userId = localStorage.getItem("id_users");
            await API.put(`/user/${userId}`, filteredData);
            navigate("/admin/users");
        } catch (err) {
            alert("Gagal memperbarui user!");
            console.error(err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showConfirmUpdate(() => handleUpdate());
    };

    return (
        <UserForm
            title="EDIT USERS"
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onBack={() => navigate("/admin/users")}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onTogglePassword={togglePasswordVisibility}
            submitButtonText="Update"
            isEdit={true}
        />
    );
}
