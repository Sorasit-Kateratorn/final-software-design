export interface TrackData {
    id: string;
    title: string;
    tags: string;
    duration: string;
}

interface TrackRowProps {
    track: TrackData;
}

export function TrackRow({ track }: TrackRowProps) {
    return (
        <div className="track-row p-3 d-flex align-items-center">
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
                <button className="icon-button me-3" title="Play">
                    <i className="bi bi-play-fill fs-5"></i>
                </button>
                <button className="icon-button me-3" title="Edit">
                    <i className="bi bi-pencil-square"></i>
                </button>
                <button className="icon-button" title="Delete">
                    <i className="bi bi-trash"></i>
                </button>
            </div>
        </div>
    );
}
