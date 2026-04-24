import { useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { AppNavbar } from "../../components/AppNavbar";
import { LibraryCard } from "../../components/LibraryCard";
import type { TrackData } from "../../components/TrackRow";

// Mock Data
const MOCK_LIBRARIES = [
    {
        id: "1",
        name: "Chill Vibes",
        description: "Relaxing and ambient tracks",
        tracks: [
            { id: "t1", title: "Ambient Dreams", tags: "Ambient • Relaxing", duration: "3:45" },
            { id: "t2", title: "Morning Meditation", tags: "Ambient • Calm", duration: "4:15" },
        ] as TrackData[],
    },
    {
        id: "2",
        name: "Energetic Beats",
        description: "High-energy electronic music",
        tracks: [{ id: "t3", title: "Electric Pulse", tags: "Electronic • Energetic", duration: "4:20" }] as TrackData[],
    },
];

export function Main() {
    const [libraries, setLibraries] = useState(MOCK_LIBRARIES);
    const [showModal, setShowModal] = useState(false);

    // For simplicity, handle both Create/Edit with same modal state
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [currentLibId, setCurrentLibId] = useState<string | null>(null);
    const [libName, setLibName] = useState("");
    const [libDesc, setLibDesc] = useState("");

    const handleClose = () => setShowModal(false);

    const handleShowCreate = () => {
        setModalMode("create");
        setLibName("");
        setLibDesc("");
        setShowModal(true);
    };

    const handleShowEdit = (lib: (typeof MOCK_LIBRARIES)[0]) => {
        setModalMode("edit");
        setCurrentLibId(lib.id);
        setLibName(lib.name);
        setLibDesc(lib.description);
        setShowModal(true);
    };

    const handleSave = () => {
        if (modalMode === "create") {
            const newLib = {
                id: Date.now().toString(),
                name: libName || "New Library",
                description: libDesc,
                tracks: [],
            };
            setLibraries([...libraries, newLib]);
        } else {
            setLibraries(libraries.map((lib) => (lib.id === currentLibId ? { ...lib, name: libName, description: libDesc } : lib)));
        }
        handleClose();
    };

    const handleDelete = (id: string) => {
        // Placeholder local delete
        setLibraries(libraries.filter((lib) => lib.id !== id));
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <AppNavbar />

            <Container className="py-5">
                <div className="mb-5">
                    <h1 className="fw-bold mb-2">My Music Libraries</h1>
                    <p className="text-muted">Organize your AI-generated music into collections</p>
                </div>

                <div className="d-flex gap-3 mb-4">
                    <div className="position-relative flex-grow-1">
                        <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input type="text" className="form-control ps-5" placeholder="Search libraries..." />
                    </div>
                    <Button variant="primary-brand" onClick={handleShowCreate} className="d-flex align-items-center text-nowrap">
                        <i className="bi bi-plus-square me-2"></i>
                        New Library
                    </Button>
                </div>

                <Row className="g-4">
                    {libraries.map((lib) => (
                        <Col lg={6} key={lib.id}>
                            <LibraryCard id={lib.id} name={lib.name} description={lib.description} tracks={lib.tracks} onEdit={() => handleShowEdit(lib)} onDelete={() => handleDelete(lib.id)} />
                        </Col>
                    ))}
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title className="fs-5 d-flex align-items-center">
                        <i className={`bi ${modalMode === "create" ? "bi-folder-plus" : "bi-folder2-open"} me-2 text-brand`}></i>
                        {modalMode === "create" ? "Create New Library" : "Edit Library"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted small mb-3">{modalMode === "create" ? "Create a new library to organize your music." : "Update your library details."}</p>
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold">Library Name</Form.Label>
                        <Form.Control type="text" placeholder="My Library" value={libName} onChange={(e) => setLibName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold">Description</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Describe this library..." value={libDesc} onChange={(e) => setLibDesc(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-brand" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary-brand" onClick={handleSave}>
                        {modalMode === "create" ? "Create Library" : "Save Changes"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
