import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { AuthCard } from "../../components/AuthCard";
import { GoogleLogin } from '@react-oauth/google';
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function Login() { 
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("password");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://127.0.0.1:8000/auth/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const data = await res.json();
                // We need to fetch the user object. For now we can construct a basic one,
                // or just store the username.
                const userData = { username };
                login(data.access, data.refresh, userData);
                navigate('/main');
            } else {
                const data = await res.json();
                setError(`Login failed: ${data.detail || JSON.stringify(data)}`);
            }
        } catch (err) {
            console.error(err);
            setError("Network error during login.");
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const res = await fetch("http://127.0.0.1:8000/auth/google/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential
                })
            });

            if (res.ok) {
                const data = await res.json();
                login(data.access, data.refresh, data.user);
                navigate('/main');
            } else {
                const data = await res.json();
                setError(`Google login failed: ${data.detail || JSON.stringify(data)}`);
            }
        } catch (err) {
            console.error(err);
            setError("Network error during Google login.");
        }
    };

    return (
        <AuthCard 
            title="Welcome back" 
            subtitle="Enter your credentials to access your music library"
        >
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label className="fw-semibold small">Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-2" controlId="formPassword">
                    <Form.Label className="fw-semibold small">Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>


                <Button variant="primary-brand" type="submit" className="w-100 mb-4 py-2">
                    Sign In
                </Button>

                <div className="position-relative mb-4">
                    <hr className="border-secondary" />
                    <div className="position-absolute top-50 start-50 translate-middle px-2" style={{ backgroundColor: 'var(--ams-card-bg)' }}>
                        <span className="small text-muted" style={{ fontSize: '0.75rem' }}>OR CONTINUE WITH</span>
                    </div>
                </div>

                <div className="d-flex justify-content-center mb-4" style={{ minHeight: '40px' }}>
                    <div style={{ display: 'inline-block' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Login Failed')}
                            useOneTap
                            locale="en"
                        />
                    </div>
                </div>

                <div className="text-center small">
                    <span className="text-muted">Don't have an account? </span>
                    <Link to="/signup" className="text-brand text-decoration-none">Sign Up</Link>
                </div>
            </Form>
        </AuthCard>
    );
}