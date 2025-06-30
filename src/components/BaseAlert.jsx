import "../sass/components/Alert/AlertUser/AlertReqKanbanSuccess/AlertSuccess.css";
import "../sass/components/Alert/AlertUserLead/AlertFormApprove/AlertFormApprove.css";
import "../sass/components/Alert/AlertUserLead/AlertFormReject/AlertFormReject.css";
import "../sass/components/Alert/AlertAdmin/AlertAddUsers/AlertSuccessAdd.css";
import "../sass/components/Alert/AlertAdmin/AlertEditUsers/AlertEditUsers.css";
import "../sass/components/Alert/AlertAdmin/AlertDeleteUsers/AlertDeleteUsers.css";
import "../sass/components/Alert/AlertPCLead/AlertFormApprove/AlertFormApprove.css";
import "../sass/components/Alert/AlertPCLead/AlertFormReject/AlertFormReject.css";

export default function BaseAlert({
    isVisible,
    fadeOut,
    icon,
    title,
    content,
    buttons,
    className = "base-alert",
}) {
    if (!isVisible) return null;

    return (
        <div className={`overlay-${className}`}>
            <div
                className={`alert-box-${className} ${
                    fadeOut ? "fade-out" : "fade-in"
                }`}
            >
                {icon && (
                    <div className={`alert-icon-${className}`}>
                        <div className={`icon-circle-${className}`}>
                            <img src={icon} alt="" />
                        </div>
                    </div>
                )}
                <div className={`alert-content-${className}`}>
                    <h3>{title}</h3>
                    {typeof content === "string" ? <p>{content}</p> : content}
                </div>
                <div className={`alert-buttons-${className}`}>
                    {buttons.map((button, index) => (
                        <button
                            key={index}
                            className={`btn-${className} ${
                                button.variant || ""
                            }`}
                            onClick={button.onClick}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};