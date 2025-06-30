import React, { useState } from "react";
import "../sass/Report/Report.css";
import Pdf from "../assets/icons/pdf.svg";
import Excel from "../assets/icons/excel.svg";
import API from "../service/api";

export default function Report() {
  const [form, setForm] = useState({
    month: "",
    year: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDownload = async (e, type) => {
    e.preventDefault();

    const endpoints = {
      pdf: {
        // API endpoint untuk export PDF
        url: `/report/monthly-pdf?month=${form.month}&year=${form.year}`,
        mime: "application/pdf",
        extension: "pdf",
      },
      excel: {
        // API endpoint untuk export Excel
        url: `/report/monthly-excel?month=${form.month}&year=${form.year}`,
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        extension: "xlsx",
      },
    };

    const file = endpoints[type];
    if (!file) return alert("Tipe file tidak dikenali.");

    try {
      const response = await API.get(file.url, { responseType: "blob" });

      const blob = new Blob([response.data], { type: file.mime });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Laporan-Kanban-${form.month}-${form.year}.${file.extension}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert(`Gagal mendownload laporan`, err);
    }
  };

  return (
    <div className="report-container">
      <h2 className="report-title">KANBAN REQUEST REPORT</h2>

      <div className="form-group-report">
        <label htmlFor="month">
          <strong>
            <i>Month</i>
          </strong>
        </label>
        <input
          type="text"
          name="month"
          id="month"
          className="input-field"
          placeholder="cth: 1 (Masukkan dalam bentuk angka)"
          onChange={handleChange}
        />
      </div>

      <div className="form-group-report">
        <label htmlFor="year">
          <strong>
            <i>Year</i>
          </strong>
        </label>
        <input
          type="text"
          name="year"
          id="year"
          className="input-field"
          placeholder="cth: 2025 (Masukkan dalam bentuk angka)"
          onChange={handleChange}
        />
      </div>

      <div className="button-group-report">
        <div className="export-buttons">
          <button
            className="btn pdf-btn"
            onClick={(e) => handleDownload(e, "pdf")}
          >
            <img src={Pdf} alt="" /> Export PDF
          </button>
          <button
            className="btn excel-btn"
            onClick={(e) => handleDownload(e, "excel")}
          >
            <img src={Excel} alt="" /> Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}
