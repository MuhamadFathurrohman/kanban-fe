import React from "react";
import "../sass/components/Alert/AlertSession/AlertSession.css";
import changeIcon from "../assets/icons/change-icon.svg";

const SessionExpiredModal = ({ onConfirm, alertConfirm, fadeOutConfirm }) => {
    return (
        <div className="modal-backdrop">
            {alertConfirm && (
                <div
                    className={`alert-box-session-confirm ${
                        fadeOutConfirm ? "fade-out" : "fade-in"
                    }`}
                >
                    <div className="alert-icon-session-confirm">
                        <div className="icon-circle-session-confirm">
                            <img src={changeIcon} alt="" />
                        </div>
                    </div>
                    <div className="alert-content-session-confirm">
                        <h2>Sesi Habis</h2>
                        <p>
                            Sesi login Anda telah habis. Silakan login kembali.
                        </p>
                    </div>
                    <div className="alert-buttons-session-confirm">
                        <button
                            className="btn-session-confirm cancel-session-confirm"
                            onClick={onConfirm}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionExpiredModal;
