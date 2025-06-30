import { useState, useEffect } from "react";
import API from "../service/api";
import { ID_DEPARTMENT_MAP } from "../utils/constants";

export const useUserForm = (initialData = {}) => {
    const [formData, setFormData] = useState({
        name: "",
        no_hp: "",
        id_department: "",
        role: "",
        email: "",
        password: "",
        confirmPassword: "",
        ...initialData,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (type) => {
        if (type === "password") {
            setShowPassword((prev) => !prev);
        } else {
            setShowConfirmPassword((prev) => !prev);
        }
    };

    const validateForm = (isEdit = false) => {
        if (formData.password !== formData.confirmPassword) {
            alert("Password dan konfirmasi password tidak cocok!");
            return false;
        }

        if (!isEdit) {
            const isFormValid = Object.entries(formData)
                .filter(([key]) => key !== "confirmPassword")
                .every(([, value]) => value.trim() !== "");

            if (!isFormValid) {
                alert("Mohon lengkapi semua kolom sebelum menyimpan.");
                return false;
            }
        }

        const departmentId = ID_DEPARTMENT_MAP[formData.id_department];
        if (formData.id_department && !departmentId) {
            alert("Departemen tidak valid!");
            return false;
        }

        return true;
    };

    const prepareDataForSubmit = (isEdit = false) => {
        const departmentId = ID_DEPARTMENT_MAP[formData.id_department];

        if (isEdit) {
            const filteredData = Object.entries(formData).reduce(
                (acc, [key, value]) => {
                    if (value.trim() !== "" && key !== "confirmPassword") {
                        acc[key] = value;
                    }
                    return acc;
                },
                {}
            );

            if (filteredData.id_department) {
                filteredData.id_department = departmentId;
            }

            return filteredData;
        }

        return {
            ...formData,
            id_department: departmentId,
        };
    };

    return {
        formData,
        setFormData,
        showPassword,
        showConfirmPassword,
        loading,
        setLoading,
        handleChange,
        togglePasswordVisibility,
        validateForm,
        prepareDataForSubmit,
    };
};
