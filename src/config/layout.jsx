import successIcon from "../assets/icons/success-icon.svg";
import changeIcon from "../assets/icons/change-icon.svg";
import confirmIcon from "../assets/icons/confirm-icon.svg";

const LAYOUT_CONFIGS = {
    user: {
        sidebarType: "user",
        redirectPath: "/user/request-kanban",
        alerts: {
            formReq: {
                icon: successIcon,
                title: "Request Kanban Successfully Sent",
                content: (
                    <>
                        <p>
                            Request kanban successfully sent. Please check your
                            department email
                        </p>
                        <p>
                            You can see the kanban approval in the request
                            details.
                        </p>
                    </>
                ),
                className: "formreq",
            },
        },
        handlers: (showAlert, closeAlert) => ({
            handleShowAlertFormReq: () => showAlert("formReq"),
            handleCloseAlertFormReq: () => closeAlert("formReq"),
        }),
    },

    userLead: {
        sidebarType: "userLead",
        redirectPath: "/user-lead/approve-user-lead",
        alerts: {
            approve: {
                icon: successIcon,
                title: "Request Kanban Successfully Approved.",
                content: (
                    <>
                        <p>
                            Request kanban successfully approved. Please check
                            your department email
                        </p>
                        <p>
                            You can see the request approval in the approval
                            details.
                        </p>
                    </>
                ),
                className: "userlead-approve",
            },
            confirmReject: {
                icon: confirmIcon,
                title: "Reject Request Kanban",
                content:
                    "Are you sure you want to reject request kanban This action cannot be undone.",
                className: "userlead-confirmreject",
            },
            rejectSuccess: {
                icon: successIcon,
                title: "Request Kanban Successfully Rejected.",
                content: (
                    <>
                        <p>
                            Request kanban successfully Rejected. Please check
                            your department email
                        </p>
                        <p>
                            You can see the request approval in the approval
                            details.
                        </p>
                    </>
                ),
                className: "userlead-successreject",
            },
        },
        handlers: (showAlert, closeAlert, alerts) => {
            const handleConfirm = () => {
                const onConfirm = alerts.confirmReject?.onConfirm;
                closeAlert("confirmReject", 0);
                showAlert("rejectSuccess");
                if (onConfirm) onConfirm();
            };

            return {
                handleShowAlertUserLeadApprove: () => showAlert("approve"),
                showConfirmReject: (onConfirm) =>
                    showAlert("confirmReject", { onConfirm }),
                handleConfirm,
                handleCancel: () => closeAlert("confirmReject"),
                handleCloseSuccess: () => closeAlert("rejectSuccess"),
            };
        },
    },

    admin: {
        sidebarType: "admin",
        redirectPath: "/admin/users",
        alerts: {
            add: {
                icon: successIcon,
                title: "Successfully Added Users",
                className: "add",
            },
            confirmUpdate: {
                icon: changeIcon,
                title: "Unsaved Updates",
                content: "Do you want to save or cancel updates?",
                className: "confirm-update",
            },
            updateSuccess: {
                icon: successIcon,
                title: "Successfully Updates User",
                className: "success-update",
            },
            confirmDelete: {
                icon: confirmIcon,
                title: "Delete User?",
                className: "confirm-delete",
            },
            deleteSuccess: {
                icon: successIcon,
                title: "Successfully Delete User",
                className: "success-delete",
            },
        },
        handlers: (showAlert, closeAlert, alerts) => {
            const handleConfirmUpdate = () => {
                const onConfirm = alerts.confirmUpdate?.onConfirm;
                closeAlert("confirmUpdate", 0);
                showAlert("updateSuccess");
                if (onConfirm) onConfirm();
            };

            const handleConfirmDelete = () => {
                const onConfirm = alerts.confirmDelete?.onConfirm;
                closeAlert("confirmDelete", 0);
                showAlert("deleteSuccess");
                if (onConfirm) onConfirm();
            };

            return {
                handleShowAlertAdd: () => showAlert("add"),
                showConfirmUpdate: (onConfirm) =>
                    showAlert("confirmUpdate", { onConfirm }),
                showConfirmDelete: (user, onConfirm) =>
                    showAlert("confirmDelete", { user, onConfirm }),
                handleConfirmUpdate,
                handleConfirmDelete,
            };
        },
    },

    pcLead: {
        sidebarType: "pcLead",
        redirectPath: "/pc-lead/approve-pc-lead",
        alerts: {
            approve: {
                icon: successIcon,
                title: "Request Kanban Successfully Approved.",
                content: (
                    <>
                        <p>
                            Request kanban successfully approved. Please check
                            your department email
                        </p>
                        <p>
                            You can see the request approval in the approval
                            details.
                        </p>
                    </>
                ),
                className: "pclead-approve",
            },
            confirmReject: {
                icon: confirmIcon,
                title: "Reject Request Kanban",
                content:
                    "Are you sure you want to reject request kanban This action cannot be undone.",
                className: "pclead-confirmreject",
            },
            rejectSuccess: {
                icon: successIcon,
                title: "Request Kanban Successfully Rejected.",
                content: (
                    <>
                        <p>
                            Request kanban successfully Rejected. Please check
                            your department email
                        </p>
                        <p>
                            You can see the request approval in the approval
                            details.
                        </p>
                    </>
                ),
                className: "pclead-successreject",
            },
        },
        handlers: (showAlert, closeAlert, alerts) => {
            const handleConfirmPCLead = () => {
                const onConfirm = alerts.confirmReject?.onConfirm;
                closeAlert("confirmReject", 0);
                showAlert("rejectSuccess");
                if (onConfirm) onConfirm();
            };

            return {
                handleShowAlertPCLeadApprove: () => showAlert("approve"),
                showConfirmRejectPCLead: (onConfirm) =>
                    showAlert("confirmReject", { onConfirm }),
                handleConfirmPCLead,
            };
        },
    },
};

export default LAYOUT_CONFIGS