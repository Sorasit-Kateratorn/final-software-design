import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Container, Row, Col, Form, Button, Modal, Spinner, Alert, Toast, ToastContainer } from "react-bootstrap";
import { AppNavbar } from "../../components/AppNavbar";
import { LibraryCard } from "../../components/LibraryCard";
import type { TrackData } from "../../components/TrackRow";

export interface GenerationJob {
    taskId: string;
    libraryId: string;
    title: string;
    genre: string;
    occasion: string;
    status: string; // PENDING, GENERATING, FAILED
    progress: number;
}

const STATUS_PROGRESS_MAP: Record<string, number> = {
    PENDING: 25,
    TEXT_SUCCESS: 50,
    FIRST_SUCCESS: 75,
    GENERATING: 50,
    SUCCESS: 100,
};

export function Main() {
    const navigate = useNavigate();
    const [libraries, setLibraries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeJobs, setActiveJobs] = useState<GenerationJob[]>([]);
    
    // Library Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [currentLibId, setCurrentLibId] = useState<string | null>(null);
    const [libName, setLibName] = useState("");
    const [libDesc, setLibDesc] = useState(""); 

    // Generate Music State
    const [showGenModal, setShowGenModal] = useState(false);
    const [genLibId, setGenLibId] = useState<string | null>(null);
    const [genTitle, setGenTitle] = useState("");
    const [genGenre, setGenGenre] = useState("Pop");
    const [genOccasion, setGenOccasion] = useState("Party");
    const [genError, setGenError] = useState("");

    // Search and Toast States
    const [searchQuery, setSearchQuery] = useState("");
    const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

    const showToast = (message: string, variant: "success" | "danger" | "warning" | "info" = "success") => {
        setToast({ show: true, message, variant });
    };

    // Custom fetch wrapper to handle auth and refresh token
    const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
        let token = localStorage.getItem("access") || localStorage.getItem("access_token");
        let headers = new Headers(options.headers || {});
        if (token) headers.set("Authorization", `Bearer ${token}`);

        let response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
            const refreshToken = localStorage.getItem("refresh") || localStorage.getItem("refresh_token");
            if (refreshToken) {
                try {
                    const refreshRes = await fetch("http://localhost:8000/auth/token/refresh/", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ refresh: refreshToken })
                    });
                    
                    if (refreshRes.ok) {
                        const data = await refreshRes.json();
                        const newAccess = data.access || data.access_token;
                        localStorage.setItem("access", newAccess);
                        localStorage.setItem("access_token", newAccess);
                        
                        headers.set("Authorization", `Bearer ${newAccess}`);
                        response = await fetch(url, { ...options, headers });
                    } else {
                        navigate("/login");
                    }
                } catch (err) {
                    navigate("/login");
                }
            } else {
                navigate("/login");
            }
        }
        return response;
    }, [navigate]);

    const fetchLibraries = useCallback(async () => {
        try {
            const token = localStorage.getItem("access") || localStorage.getItem("access_token");
            if (!token) {
                navigate("/login");
                return;
            }

            const res = await fetchWithAuth("http://localhost:8000/library/", {
                headers: { "Content-Type": "application/json" }
            });
            
            if (res.ok) {
                const data = await res.json();
                const formatted = data.map((lib: any) => ({
                    id: lib.id.toString(),
                    name: lib.name,
                    description: "Created on " + new Date(lib.created_at).toLocaleDateString(),
                    tracks: (lib.tracks || []).map((t: any) => ({
                        id: t.id.toString(),
                        title: t.title,
                        tags: `${t.genre} • ${t.status}`,
                        duration: t.duration_time ? `${t.duration_time}s` : "0:00",
                        audioUrl: t.audio_url
                    }))
                }));
                setLibraries(formatted);
            }
        } catch (err) {
            console.error("Error fetching libraries", err);
        } finally {
            setIsLoading(false);
        }
    }, [fetchWithAuth, navigate]);

    useEffect(() => {
        fetchLibraries();
    }, [fetchLibraries]);

    const handleClose = () => setShowModal(false);

    const handleShowCreate = () => {
        setModalMode("create");
        setLibName("");
        setLibDesc("");
        setShowModal(true);
    };

    const handleShowEdit = (lib: any) => {
        setModalMode("edit");
        setCurrentLibId(lib.id);
        setLibName(lib.name);
        setLibDesc("");
        setShowModal(true);
    };

    const handleSave = async () => {
        if (modalMode === "create") {
            try {
                const res = await fetchWithAuth("http://localhost:8000/library/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: libName || "New Library" })
                });
                if (res.ok) fetchLibraries();
            } catch (err) {
                console.error("Failed to create library", err);
            }
        } else {
            try {
                const res = await fetchWithAuth(`http://localhost:8000/library/${currentLibId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: libName })
                });
                if (res.ok) fetchLibraries();
            } catch (err) {
                console.error("Failed to update library", err);
            }
        }
        handleClose();
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetchWithAuth(`http://localhost:8000/library/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchLibraries();
                showToast("Library deleted", "success");
            }
        } catch (err) {
            console.error("Failed to delete library", err);
            showToast("Failed to delete library", "danger");
        }
    };

    const handleDeleteTrack = async (libId: string, trackId: string) => {
        try {
            const res = await fetchWithAuth(`http://localhost:8000/library/${libId}/track/${trackId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchLibraries();
                showToast("Track removed from library", "success");
            } else {
                showToast("Failed to remove track", "danger");
            }
        } catch (err) {
            console.error("Failed to remove track", err);
            showToast("Failed to remove track", "danger");
        }
    };

    // Generate Music Methods
    const handleShowGenerate = (libId: string) => {
        setGenLibId(libId);
        setGenTitle("");
        setGenGenre("Pop");
        setGenOccasion("Party");
        setGenError("");
        setShowGenModal(true);
    };

    const handleGenerateClose = () => {
        setShowGenModal(false);
    };

    const handleGenerateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenError("");

        try {
            const response = await fetchWithAuth("http://localhost:8000/musicprompt/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    title: genTitle, 
                    genre: genGenre, 
                    occasion: genOccasion,
                    library_id: genLibId 
                })
            });

            if (response.status === 401) return;

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || data.error || "Failed to start generation");

            setShowGenModal(false);
            if (genLibId) {
                setActiveJobs(prev => [...prev, {
                    taskId: data.taskId,
                    libraryId: genLibId,
                    title: genTitle,
                    genre: genGenre,
                    occasion: genOccasion,
                    status: "PENDING",
                    progress: 25
                }]);
            }
        } catch (err: any) {
            setGenError(err.message);
        }
    };

    const handleRetryJob = async (job: GenerationJob) => {
        setActiveJobs(prev => prev.filter(j => j.taskId !== job.taskId));
        
        try {
            const response = await fetchWithAuth("http://localhost:8000/musicprompt/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    title: job.title, 
                    genre: job.genre, 
                    occasion: job.occasion,
                    library_id: job.libraryId 
                })
            });

            if (response.status === 401) return;

            const data = await response.json();
            if (response.ok && data.taskId) {
                setActiveJobs(prev => [...prev, {
                    ...job,
                    taskId: data.taskId,
                    status: "PENDING",
                    progress: 25
                }]);
            }
        } catch (err) {
            console.error("Retry failed", err);
        }
    };

    useEffect(() => {
        const incompleteJobs = activeJobs.filter(j => j.status !== "SUCCESS" && j.status !== "FAILED");
        if (incompleteJobs.length === 0) return;

        let isMounted = true;
        const interval = setInterval(async () => {
            for (const job of incompleteJobs) {
                if (!isMounted) break;
                try {
                    const response = await fetchWithAuth(`http://localhost:8000/musicprompt/status/${job.taskId}`);
                    if (response.ok && isMounted) {
                        const data = await response.json();
                        const newStatus = data.status || "PENDING";
                        
                        if (newStatus === "SUCCESS") {
                            setActiveJobs(prev => prev.filter(j => j.taskId !== job.taskId));
                            fetchLibraries();
                        } else if (newStatus === "FAILED") {
                            setActiveJobs(prev => prev.map(j => j.taskId === job.taskId ? { ...j, status: "FAILED" } : j));
                        } else {
                            setActiveJobs(prev => prev.map(j => j.taskId === job.taskId ? { ...j, status: newStatus, progress: STATUS_PROGRESS_MAP[newStatus] || 50 } : j));
                        }
                    }
                } catch (err) {
                    console.error("Error polling status:", err);
                }
            }
        }, 5000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [activeJobs, fetchWithAuth, fetchLibraries]);

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
                        <input 
                            type="text" 
                            className="form-control ps-5" 
                            placeholder="Search libraries..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="primary-brand" onClick={handleShowCreate} className="d-flex align-items-center text-nowrap">
                        <i className="bi bi-plus-square me-2"></i>
                        New Library
                    </Button>
                </div>

                {isLoading ? (
                    <div className="text-center mt-5">
                        <Spinner animation="border" variant="success" />
                        <p className="mt-3 text-muted">Loading your libraries...</p>
                    </div>
                ) : libraries.length === 0 ? (
                    <div className="text-center mt-5 py-5 border border-secondary rounded bg-dark">
                        <i className="bi bi-folder-x fs-1 text-muted mb-3 d-block"></i>
                        <h4 className="fw-bold">No libraries yet</h4>
                        <p className="text-muted">Create your first library to start generating and organizing your AI music!</p>
                        <Button variant="outline-success" className="mt-2" onClick={handleShowCreate}>
                            <i className="bi bi-plus-circle me-2"></i>Create Library
                        </Button>
                    </div>
                ) : (
                    <Row className="g-4">
                        {libraries.filter(lib => lib.name.toLowerCase().includes(searchQuery.toLowerCase())).map((lib) => {
                            const libJobs: TrackData[] = activeJobs.filter(j => j.libraryId === lib.id).map(j => ({
                                id: j.taskId,
                                title: j.title,
                                tags: `${j.genre} • ${j.occasion}`,
                                duration: "",
                                isJob: true,
                                status: j.status,
                                progress: j.progress,
                                onRetry: () => handleRetryJob(j)
                            }));
                            const combinedTracks = [...lib.tracks, ...libJobs];

                            return (
                                <Col lg={6} key={lib.id}>
                                    <LibraryCard 
                                        id={lib.id} 
                                        name={lib.name} 
                                        description={lib.description} 
                                        tracks={combinedTracks} 
                                        onEdit={() => handleShowEdit(lib)} 
                                        onDelete={() => handleDelete(lib.id)} 
                                        onGenerateMusic={() => handleShowGenerate(lib.id)}
                                        onDeleteTrack={(trackId) => handleDeleteTrack(lib.id, trackId)}
                                        onShowToast={showToast}
                                    />
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Container>

            {/* Create/Edit Library Modal */}
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

            {/* Generate Music Modal */}
            <Modal show={showGenModal} onHide={handleGenerateClose} centered>
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title className="fs-5 d-flex align-items-center">
                        <i className="bi bi-magic me-2 text-brand"></i>
                        Generate AI Music
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {genError && <Alert variant="danger">{genError}</Alert>}
                    <Form onSubmit={handleGenerateSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-semibold">Song Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter an epic title..." 
                                value={genTitle} 
                                onChange={(e) => setGenTitle(e.target.value)}
                                required 
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-semibold">Genre</Form.Label>
                                    <Form.Select 
                                        value={genGenre} 
                                        onChange={(e) => setGenGenre(e.target.value)}
                                    >
                                        <option value="Pop">Pop</option>
                                        <option value="Rock">Rock</option>
                                        <option value="Jazz">Jazz</option>
                                        <option value="Hiphop">Hip-Hop</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-semibold">Occasion</Form.Label>
                                    <Form.Select 
                                        value={genOccasion} 
                                        onChange={(e) => setGenOccasion(e.target.value)}
                                    >
                                        <option value="Party">Party</option>
                                        <option value="Birthday">Birthday</option>
                                        <option value="Workout">Workout</option>
                                        <option value="Relax">Relax</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Button variant="primary-brand" type="submit" className="w-100">
                            Start Generating
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Toast Container */}
            <ToastContainer position="bottom-end" className="p-3" style={{ position: "fixed", zIndex: 9999 }}>
                <Toast bg={toast.variant} show={toast.show} onClose={() => setToast(prev => ({ ...prev, show: false }))} delay={3000} autohide>
                    <Toast.Body className={toast.variant === "warning" ? "text-dark" : "text-white"}>
                        {toast.message}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}
