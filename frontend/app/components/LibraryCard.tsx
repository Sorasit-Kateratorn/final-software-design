import { Button } from "react-bootstrap";
import { TrackRow, type TrackData } from "./TrackRow";

interface LibraryCardProps {
    id: string;
    name: string;
    description: string;
    tracks: TrackData[];
    onEdit: () => void;
    onDelete: () => void;
}

export function LibraryCard({ name, description, tracks, onEdit, onDelete }: LibraryCardProps) {
    return (
        <div className="library-card p-4">
            <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h4 className="fw-bold mb-1">{name}</h4>
                    <p className="text-muted small mb-1">{description}</p>
                    <p className="text-muted small mb-4">{tracks.length} track{tracks.length !== 1 ? 's' : ''}</p>
                </div>
                <div>
                    <button className="icon-button me-3" onClick={onEdit} title="Edit Library">
                        <i className="bi bi-pencil"></i>
                    </button>
                    <button className="icon-button" onClick={onDelete} title="Delete Library">
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            </div>

            <div className="d-flex mb-4 gap-3">
                <div className="position-relative flex-grow-1">
                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input 
                        type="text" 
                        className="form-control ps-5" 
                        placeholder="Search in this library..." 
                    />
                </div>
                <Button variant="primary-brand" className="d-flex align-items-center flex-shrink-0 text-nowrap">
                    <i className="bi bi-plus text-black me-2 fs-5 line-height-1"></i>
                    Generate Music
                </Button>
            </div>

            <div className="d-flex flex-column gap-2">
                {tracks.map(track => (
                    <TrackRow key={track.id} track={track} />
                ))}
            </div>
        </div>
    );
}
