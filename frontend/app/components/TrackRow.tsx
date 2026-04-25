import { useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { ConfirmModal } from "./ConfirmModal";

export interface TrackData {
    id: string;
    title: string;
    tags: string;
    duration: string;
    audioUrl?: string;
    
    // Job specific fields
    isJob?: boolean;
    status?: string;
    progress?: number;
    onRetry?: () => void;
}

interface TrackRowProps {
    track: TrackData;
    onDelete?: () => void;
    onShowToast?: (msg: string, variant?: "success" | "danger" | "warning") => void;
}

export function TrackRow({ track, onDelete, onShowToast }: TrackRowProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!track.audioUrl) return;

        try {
            const response = await fetch(track.audioUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${track.title.replace(/\s+/g, '_')}.mp3`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            if (onShowToast) onShowToast("Failed to download file", "danger");
        }
    };

    const handleShare = () => {
        if (!track.audioUrl) return;

        const isMock = track.audioUrl.includes("localhost") || track.audioUrl.includes("mock_music");
        
        if (isMock) {
            if (onShowToast) onShowToast("Mock music cannot be shared", "warning");
            return;
        }

        navigator.clipboard.writeText(track.audioUrl)
            .then(() => {
                if (onShowToast) onShowToast("Link copied to clipboard!", "success");
            })
            .catch(() => {
                if (onShowToast) onShowToast("Failed to copy link", "danger");
            });
    };

    if (track.isJob) {
        return (
            <div className="track-row p-3 d-flex flex-column border-start border-3 border-brand bg-dark bg-opacity-50">
                <div className="d-flex align-items-center w-100">
                    <div className="me-3 fs-5 text-muted">
                        {track.status === "FAILED" ? <i className="bi bi-exclamation-triangle text-danger"></i> : <i className="bi bi-gear-wide-connected spin-icon"></i>}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                        <div className="fw-bold text-truncate text-muted">{track.title}</div>
                        <div className="text-muted small text-truncate">
                            {track.tags} &bull; {track.status === "FAILED" ? <span className="text-danger">Generation Failed</span> : <span>Generating...</span>}
                        </div>
                    </div>
                    <div className="d-flex align-items-center ms-3">
                        {track.status === "FAILED" && (
                            <button className="btn btn-sm btn-outline-danger" onClick={track.onRetry} title="Retry">
                                <i className="bi bi-arrow-clockwise me-1"></i> Retry
                            </button>
                        )}
                    </div>
                </div>
                {track.status !== "FAILED" && (
                    <div className="w-100 mt-2">
                        <ProgressBar animated variant="success" now={track.progress || 0} style={{ height: "6px" }} />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="track-row p-3 d-flex flex-column">
            <div className="d-flex align-items-center w-100">
            <div className="me-3 fs-5" style={{ color: 'var(--ams-green)' }}>
                <i className="bi bi-music-note-beamed"></i>
            </div>
            <div className="flex-grow-1 min-w-0">
                <div className="fw-bold text-truncate">{track.title}</div>
                <div className="text-muted small text-truncate">
                    {track.tags} &bull; {track.duration}
                </div>
            </div>
            <div className="d-flex align-items-center ms-3">
                {track.audioUrl && (
                    <button onClick={handleDownload} className="icon-button me-3 text-success border-0 bg-transparent" title="Download">
                        <i className="bi bi-download"></i>
                    </button>
                )}
                {!track.audioUrl && (
                    <button className="icon-button me-3" title="Play">
                        <i className="bi bi-play-fill fs-5"></i>
                    </button>
                )}
                <button className="icon-button me-3" title="Share" onClick={handleShare}>
                    <i className="bi bi-share"></i>
                </button>
                <button className="icon-button" title="Delete" onClick={() => setShowDeleteConfirm(true)}>
                    <i className="bi bi-trash"></i>
                </button>
            </div>
            </div>
            {track.audioUrl && (
                <div className="w-100 mt-3">
                    <audio controls src={track.audioUrl} className="w-100" style={{ height: "40px" }} />
                </div>
            )}
            <ConfirmModal 
                show={showDeleteConfirm} 
                itemName={track.title} 
                onConfirm={() => {
                    setShowDeleteConfirm(false);
                    if (onDelete) onDelete();
                }} 
                onCancel={() => setShowDeleteConfirm(false)} 
            />
        </div>
    );
}
