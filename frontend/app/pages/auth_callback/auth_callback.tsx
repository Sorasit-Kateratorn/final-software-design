import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Container, Spinner } from "react-bootstrap";

export function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const hasExchanged = useRef(false);

    useEffect(() => {
        const tempCode = searchParams.get("code");
        const urlError = searchParams.get("error");

        if (urlError) {
            let errorMsg = urlError;
            if (urlError === "csrf_validation_failed") errorMsg = "Security validation failed. Please try again.";
            if (urlError === "missing_parameters") errorMsg = "Missing necessary login parameters.";
            if (urlError === "token_exchange_failed") errorMsg = "Failed to authenticate with Google.";
            setError(`Authorization error: ${errorMsg}`);
            return;
        }

        if (!tempCode) {
            setError("No authorization code found in URL.");
            return;
        }

        const exchangeToken = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
                const res = await fetch(`${backendUrl}/auth/google/exchange/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: tempCode }),
                });

                if (res.ok) {
                    const data = await res.json();
                    login(data.access, data.refresh, data.user);
                    navigate("/main", { replace: true });
                } else {
                    const data = await res.json();
                    setError(`Login failed: ${data.detail || "Invalid or expired temporary code."}`);
                }
            } catch (err) {
                console.error(err);
                setError("Network error during token exchange.");
            }
        };

        if (!hasExchanged.current) {
            hasExchanged.current = true;
            exchangeToken();
        }
    }, [searchParams, navigate, login]);

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <h3 className="text-danger mb-3">Authentication Error</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary mt-3" onClick={() => navigate("/login", { replace: true })}>
                        Return to Login
                    </button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
            <Spinner animation="border" variant="primary" role="status" className="mb-3" />
            <h5>Completing Google sign-in...</h5>
        </Container>
    );
}
