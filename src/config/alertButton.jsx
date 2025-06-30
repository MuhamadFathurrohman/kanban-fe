export const alertButton = {
    user: {
        formReq: [
            {
                label: "Cancel",
                variant: "cancel-formreq",
                action: "handleCloseAlertFormReq",
            },
            {
                label: "Confirm",
                variant: "confirm-formreq",
                action: "handleCloseAlertFormReq",
            },
        ],
    },

    userLead: {
        approve: [
            {
                label: "Cancel",
                variant: "cancel-userlead-approve",
                action: "closeAlert",
                params: ["approve"],
            },
            {
                label: "Confirm",
                variant: "confirm-userlead-approve",
                action: "closeAlert",
                params: ["approve"],
            },
        ],
        confirmReject: [
            {
                label: "Cancel",
                variant: "cancel-userlead-confirmreject",
                action: "handleCancel",
            },
            {
                label: "Reject",
                variant: "confirm-userlead-confirmreject",
                action: "handleConfirm",
            },
        ],
        rejectSuccess: [
            {
                label: "Confirm",
                variant: "cancel-userlead-successreject",
                action: "handleCloseSuccess",
            },
        ],
    },

    admin: {
        add: [
            {
                label: "Cancel",
                variant: "cancel-btn-add",
                action: "closeAlert",
                params: ["add"],
            },
            {
                label: "Confirm",
                variant: "confirm-btn-add",
                action: "closeAlert",
                params: ["add"],
            },
        ],
        confirmUpdate: [
            {
                label: "Cancel",
                variant: "cancel-confirm-update",
                action: "closeAlert",
                params: ["confirmUpdate"],
            },
            {
                label: "Save updates",
                variant: "confirm-confirm-update",
                action: "handleConfirmUpdate",
            },
        ],
        updateSuccess: [
            {
                label: "Ok",
                variant: "cancel-success-update",
                action: "closeAlert",
                params: ["updateSuccess"],
            },
        ],
        confirmDelete: [
            {
                label: "Cancel",
                variant: "cancel-confirm-delete",
                action: "closeAlert",
                params: ["confirmDelete"],
            },
            {
                label: "Delete",
                variant: "confirm-confirm-delete",
                action: "handleConfirmDelete",
            },
        ],
        deleteSuccess: [
            {
                label: "Ok",
                variant: "cancel-success-delete",
                action: "closeAlert",
                params: ["deleteSuccess"],
            },
        ],
    },

    pcLead: {
        approve: [
            {
                label: "Cancel",
                variant: "cancel-pclead-approve",
                action: "closeAlert",
                params: ["approve"],
            },
            {
                label: "Confirm",
                variant: "confirm-pclead-approve",
                action: "closeAlert",
                params: ["approve"],
            },
        ],
        confirmReject: [
            {
                label: "Cancel",
                variant: "cancel-pclead-confirmreject",
                action: "closeAlert",
                params: ["confirmReject"],
            },
            {
                label: "Reject",
                variant: "confirm-pclead-confirmreject",
                action: "handleConfirmPCLead",
            },
        ],
        rejectSuccess: [
            {
                label: "Confirm",
                variant: "cancel-pclead-successreject",
                action: "closeAlert",
                params: ["rejectSuccess"],
            },
        ],
    },
};

// Utility function untuk membuat onClick handler
const createOnClickHandler = (action, params, handlers, closeAlert) => {
    switch (action) {
        case "closeAlert":
            return () => closeAlert(...params);
        case "handleCloseAlertFormReq":
            return handlers.handleCloseAlertFormReq;
        case "handleCancel":
            return handlers.handleCancel;
        case "handleConfirm":
            return handlers.handleConfirm;
        case "handleCloseSuccess":
            return handlers.handleCloseSuccess;
        case "handleConfirmUpdate":
            return handlers.handleConfirmUpdate;
        case "handleConfirmDelete":
            return handlers.handleConfirmDelete;
        case "handleConfirmPCLead":
            return handlers.handleConfirmPCLead;
        default:
            return () => {};
    }
};

export const getButtonsForAlert = (
    layoutType,
    alertType,
    handlers,
    closeAlert
) => {
    const config = alertButton[layoutType]?.[alertType];

    if (!config) {
        return [];
    }

    return config.map((buttonConfig) => ({
        label: buttonConfig.label,
        variant: buttonConfig.variant,
        onClick: createOnClickHandler(
            buttonConfig.action,
            buttonConfig.params || [],
            handlers,
            closeAlert
        ),
    }));
};
