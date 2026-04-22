import { Link } from "react-router";
import { Form, Button } from "react-bootstrap";
import type { ReactNode } from "react";

interface AuthCardProps {
    title: string;
    subtitle: ReactNode;
    children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
    return (
        <div className="auth-card-wrapper position-relative">
            <div className="d-flex flex-column align-items-center w-100">
                <div className="mb-4 text-center">
                    <Link to="/" className="text-decoration-none d-flex align-items-center justify-content-center fw-bold fs-4 text-white">
                        <i className="bi bi-music-note-beamed text-brand me-2"></i>
                        AI Music Studio
                    </Link>
                </div>
                
                <div className="auth-card p-4 p-sm-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold mb-2">{title}</h2>
                        <div className="text-muted">{subtitle}</div>
                    </div>
                    {children}
                </div>
                <div className="mt-4 text-muted small text-center px-3" style={{ maxWidth: "420px" }}>
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </div>
            </div>
        </div>
    );
}
