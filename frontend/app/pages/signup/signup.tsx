import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { AuthCard } from "../../components/AuthCard";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function Signup() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
        try {
            const res = await fetch(`${backendUrl}/user/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                // After successful signup, redirect to login
                navigate("/login");
            } else {
                const data = await res.json();
                setError(`Signup failed: ${JSON.stringify(data)}`);
            }
        } catch (err) {
            console.error(err);
            setError("Network error during signup.");
        }
    };

    const handleGoogleSignup = () => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
        window.location.href = `${backendUrl}/auth/google/login/`;
    };

    return (
        <AuthCard title="Create an account" subtitle="Enter your details to create your account">
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label className="fw-semibold small">Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                    <Form.Label className="fw-semibold small">Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <Button variant="primary-brand" type="submit" className="w-100 mb-4 py-2">
                    Sign Up
                </Button>

                <div className="position-relative mb-4">
                    <hr className="border-secondary" />
                    <div className="position-absolute top-50 start-50 translate-middle px-2" style={{ backgroundColor: "var(--ams-card-bg)" }}>
                        <span className="small text-muted" style={{ fontSize: "0.75rem" }}>
                            OR CONTINUE WITH
                        </span>
                    </div>
                </div>

                <div className="d-flex justify-content-center mb-4" style={{ minHeight: "40px" }}>
                    <div style={{ display: "inline-block", width: "100%" }}>
                        <Button 
                            variant="outline-secondary" 
                            className="w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                            onClick={handleGoogleSignup}
                            type="button"
                        >
                            <i className="bi bi-google"></i>
                            Sign up with Google
                        </Button>
                    </div>
                </div>

                <div className="text-center small">
                    <span className="text-muted">Already have an account? </span>
                    <Link to="/login" className="text-brand text-decoration-none">
                        Sign In
                    </Link>
                </div>
            </Form>
        </AuthCard>
    );
}
