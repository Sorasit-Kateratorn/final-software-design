import { Modal, Button } from "react-bootstrap";

interface ConfirmModalProps {
    show: boolean;
    itemName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({ show, itemName, onConfirm, onCancel }: ConfirmModalProps) {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton closeVariant="white">
                <Modal.Title className="fs-5 d-flex align-items-center text-danger">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Confirm Deletion
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to remove <strong>{itemName}</strong> from the library?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-brand" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
