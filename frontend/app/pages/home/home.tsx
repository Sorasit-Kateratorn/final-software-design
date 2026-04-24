import { Button, Container, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { AppNavbar } from "../../components/AppNavbar";
import { useAuth } from "../../context/AuthContext";

export function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className="d-flex flex-column min-vh-100">
            <AppNavbar />
            
            <main className="flex-grow-1 d-flex align-items-center">
                <Container className="text-center">
                    <div className="mb-4">
                        <Badge 
                            pill 
                            bg="transparent" 
                            className="border border-brand text-brand py-2 px-3 fw-normal"
                            style={{ borderColor: 'var(--ams-green)', fontSize: '0.9rem' }}
                        >
                            <i className="bi bi-stars me-2"></i>
                            AI-Powered Music Generation
                        </Badge>
                    </div>
                    
                    <h1 className="display-3 fw-bold mb-4" style={{ letterSpacing: '-0.02em', color: '#bbf7d0' }}>
                        Create Music with AI
                    </h1>
                    
                    <p className="lead mx-auto mb-5 text-muted" style={{ maxWidth: '600px', fontSize: '1.25rem' }}>
                        Transform your ideas into beautiful music. Generate, customize, and 
                        manage your AI-created tracks all in one place.
                    </p>
                    
                    <Button 
                        variant="primary-brand" 
                        size="lg" 
                        onClick={() => isAuthenticated ? navigate('/main') : navigate('/login')}
                        className="px-5 py-3 fw-bold rounded-pill"
                    >
                        Start Creating
                    </Button>
                </Container>
            </main>
        </div>
    );
}
