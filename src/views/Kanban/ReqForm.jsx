import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import API from "../../service/api";
import { DEPARTMENT_MAP } from "../../utils/constants";
import "../../sass/Kanban/ReqForm/ReqForm.css";

export default function ReqForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tgl_produksi: "",
    parts_number: "",
    nama_requester: "",
    klasifikasi: "",
    customClassification: "",
    box: "",
    lokasi: "",
    keterangan: "",
  });
  const [process, setProcess] = useState("");

  const fetchProcess = async () => {
    try {
      const userStorage = JSON.parse(localStorage.getItem("user"));
      const userId = userStorage.id_users;
      await API.get(`user/me/${userId}`).then((res) =>
        setProcess(`${DEPARTMENT_MAP[res.data.data?.department?.name]}`)
      );
    } catch (error) {
      error;
    }
  };

  fetchProcess();

  const { handleShowAlertFormReq } = useOutletContext();

  const inputRef = useRef(null);

  useEffect(() => {
    if (formData.klasifikasi === "Lainnya" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [formData.klasifikasi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tanggal = new Date(formData.tgl_produksi).toISOString();
    const dataToSend = {
      ...formData,
      klasifikasi:
        formData.klasifikasi === "Lainnya"
          ? formData.customClassification
          : formData.klasifikasi,
      tgl_produksi: tanggal,
    };

    const formDataSent = {
      ...formData,
      tgl_produksi: tanggal,
    };

    delete dataToSend.customClassification;

    try {
      await API.post("/kanban/request", dataToSend);

      // Tampilkan alert sukses
      handleShowAlertFormReq(true);
    } catch (error) {
      error;
    }
  };

  return (
    <div className="req-form-container">
      <h2>KANBAN INTERNAL REISSUE REQUEST FORMAT</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="production-date">
            <label>Production Date</label>
            <div className="date-input-container">
              <input
                type="date"
                name="tgl_produksi"
                onChange={handleChange}
                id="date-input"
                onClick={() => {
                  // Perlu ini untuk desktop
                  document
                    .querySelector('input[name="tgl_produksi"]')
                    .showPicker();
                }}
              />
              <FaCalendarAlt
                className="calendar-icon-clickable"
                onClick={() =>
                  document.getElementById("date-input").showPicker()
                }
              />
            </div>
          </div>
          <div className="parts-number">
            <label>Parts Number</label>
            <input type="text" name="parts_number" onChange={handleChange} />
          </div>
          <div className="request-name">
            <label>Requesting Name</label>
            <input type="text" name="nama_requester" onChange={handleChange} />
          </div>
          <div className="classification">
            <label>Classification</label>
            {formData.klasifikasi === "Lainnya" ? (
              <>
                <input
                  type="text"
                  name="customClassification"
                  placeholder="Masukkan klasifikasi lainnya"
                  value={formData.customClassification || ""}
                  onChange={handleChange}
                  ref={inputRef}
                  className="classification-input"
                  onBlur={() => {
                    // Jika user mengosongkan field "lainnya", kembali ke select
                    if (!formData.customClassification) {
                      setFormData((prev) => ({
                        ...prev,
                        klasifikasi: "",
                        customClassification: "",
                      }));
                    }
                  }}
                />
                {/* Tombol opsional untuk kembali ke dropdown */}
                <button
                  type="button"
                  className="btn-cancel-lainnya"
                  onClick={() => {
                    if (formData.customClassification) {
                      // Update klasifikasi jadi custom yang ditulis
                      setFormData((prev) => ({
                        ...prev,
                        klasifikasi: prev.customClassification,
                      }));
                    } else {
                      // Kalau kosong, balik ke default
                      setFormData((prev) => ({
                        ...prev,
                        klasifikasi: "",
                      }));
                    }
                  }}
                >
                  <FaArrowLeft size={14} className="arrow-icon" />
                </button>
              </>
            ) : (
              <select
                name="klasifikasi"
                value={formData.klasifikasi}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    klasifikasi: value,
                    // Kosongkan custom jika pindah dari "Lainnya"
                    ...(value !== "Lainnya" && {
                      customClassification: "",
                    }),
                  }));
                }}
                className="classification-select"
              >
                <option
                  value={
                    formData.customClassification !== ""
                      ? `${formData.customClassification}`
                      : ""
                  }
                >
                  {formData.customClassification !== ""
                    ? `${formData.customClassification}`
                    : "Select an Option"}
                </option>
                <option value="Baru">Baru</option>
                <option value="Rusak">Rusak</option>
                <option value="Hilang">Hilang</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            )}
          </div>

          <div className="box">
            <label>Box</label>
            <input type="text" name="box" onChange={handleChange} />
          </div>
          <div className="process">
            <label>Process</label>
            <input type="text" name="process" readOnly value={process} />
          </div>
          <div className="location">
            <label>Location</label>
            <input type="text" name="lokasi" onChange={handleChange} />
          </div>
          <div className="information">
            <label>Information</label>
            <textarea
              typeof="text"
              name="keterangan"
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <div className="form-buttons">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/user/request-kanban")}
          >
            Back
          </button>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
