import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { UserForm } from "../../components/UserForm";
import { useUserForm } from "../../hooks/useUserForm";
import API from "../../service/api";

export default function AddUsers() {
    const navigate = useNavigate();
    const { handleShowAlertAdd } = useOutletContext();

    const {
        formData,
        showPassword,
        showConfirmPassword,
        handleChange,
        togglePasswordVisibility,
        validateForm,
        prepareDataForSubmit,
    } = useUserForm();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        handleShowAlertAdd(true);

        const dataToSend = prepareDataForSubmit();

        try {
            await API.post("/user", dataToSend);
            navigate("/admin/users");
        } catch (error) {
            alert("Gagal menambahkan user!");
            console.error(error);
        }
    };

    return (
        <UserForm
            title="ADD USERS"
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onBack={() => navigate("/admin/users")}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onTogglePassword={togglePasswordVisibility}
            submitButtonText="Save"
        />
    );
}
