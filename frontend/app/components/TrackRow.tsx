import { ProgressBar } from "react-bootstrap";

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
}

export function TrackRow({ track }: TrackRowProps) {
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
                    <a href={track.audioUrl} download={`${track.title.replace(/\s+/g, '_')}.mp3`} target="_blank" rel="noopener noreferrer" className="icon-button me-3 text-success" title="Download">
                        <i className="bi bi-download"></i>
                    </a>
                )}
                {!track.audioUrl && (
                    <button className="icon-button me-3" title="Play">
                        <i className="bi bi-play-fill fs-5"></i>
                    </button>
                )}
                <button className="icon-button me-3" title="Edit">
                    <i className="bi bi-pencil-square"></i>
                </button>
                <button className="icon-button" title="Delete">
                    <i className="bi bi-trash"></i>
                </button>
            </div>
            </div>
            {track.audioUrl && (
                <div className="w-100 mt-3">
                    <audio controls src={track.audioUrl} className="w-100" style={{ height: "40px" }} />
                </div>
            )}
        </div>
    );
}
