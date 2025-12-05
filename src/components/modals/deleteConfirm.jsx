import React from "react";
import { Modal, Button } from "antd";
import Icon from "../Icon"; // Ensure the correct path
import { useLocalization } from "../../LocalizationContext"; // Ensure the correct path

const DeleteConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  title = "Delete Item?",
  message = "Are you sure you want to delete this item?",
  dangerMessage = "This action cannot be undone.",
  isLoading,
  isLogout,
}) => {
  const { t } = useLocalization();
  return (
    <Modal
      title={title}
      open={visible} // `open` replaces `visible` in Ant Design v4
      footer={null} // Custom footer
      // onCancel={onClose} // Close modal on clicking outside
      centered
      width={400}
      closable={false}
    >
      <div>
        <span>{message}</span>
        <span className="danger">{dangerMessage}</span>
      </div>
      <div className="modal_footer">
        <Button
          key="cancel"
          type="none"
          className="custom-cancel-btn"
          onClick={onClose}
        >
          {t("Common").cancel}
        </Button>
        <Button
          key="delete"
          type="danger"
          className="custom-delete-btn"
          onClick={onConfirm}
          loading={isLoading}
        >
          <Icon icon={isLogout ? "ic_logout" : "ic_trash"} />
          {isLogout ? t("Pages").log_out : t("Common").delete}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
