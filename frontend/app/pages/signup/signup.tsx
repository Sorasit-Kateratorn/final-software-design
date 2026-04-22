import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { AuthCard } from "../../components/AuthCard";

export function Signup() { 
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/main');
    };

    return (
        <AuthCard 
            title="Create an account" 
            subtitle="Enter your details to create your account"
        >
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label className="fw-semibold small">Email</Form.Label>
                    <Form.Control type="email" placeholder="Email address" required defaultValue="111111111" />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                    <Form.Label className="fw-semibold small">Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required defaultValue="password" />
                </Form.Group>

                <Button variant="primary-brand" type="submit" className="w-100 mb-4 py-2">
                    Sign Up
                </Button>

                <div className="position-relative mb-4">
                    <hr className="border-secondary" />
                    <div className="position-absolute top-50 start-50 translate-middle px-2" style={{ backgroundColor: 'var(--ams-card-bg)' }}>
                        <span className="small text-muted" style={{ fontSize: '0.75rem' }}>OR CONTINUE WITH</span>
                    </div>
                </div>

                <Button 
                    variant="outline-brand" 
                    type="button" 
                    onClick={() => navigate('/main')}
                    className="w-100 py-2 mb-4 d-flex align-items-center justify-content-center"
                >
                    <i className="bi bi-google me-2"></i>
                    Sign up with Google
                </Button>

                <div className="text-center small">
                    <span className="text-muted">Already have an account? </span>
                    <Link to="/login" className="text-brand text-decoration-none">Sign In</Link>
                </div>
            </Form>
        </AuthCard>
    );
}
