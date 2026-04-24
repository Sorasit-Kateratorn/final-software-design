import { Navbar, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Dropdown from 'react-bootstrap/Dropdown';

interface AppNavbarProps {
    rightElement?: React.ReactNode;
}

export function AppNavbar({ rightElement }: AppNavbarProps) {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar variant="dark" expand="lg" className="py-3 border-bottom border-dark" style={{ backgroundColor: 'transparent' }}>
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold fs-4 text-white">
                    <i className="bi bi-music-note-beamed text-brand me-2"></i>
                    AI Music Studio
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    {rightElement || (
                        <div className="d-flex align-items-center gap-3">
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/login" className="text-white text-decoration-none fw-semibold">Log In</Link>
                                    <Button as={Link} to="/signup" variant="primary-brand" className="fw-semibold px-4">
                                        Sign Up
                                    </Button>
                                </>
                            ) : (
                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-profile" className="icon-button border rounded p-2 px-3 border-secondary d-flex align-items-center gap-2">
                                        <i className="bi bi-person text-white"></i>
                                        <span className="text-white small d-none d-md-inline">{user?.username || 'Profile'}</span>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu variant="dark">
                                        <Dropdown.Item onClick={handleLogout} className="text-danger">
                                            <i className="bi bi-box-arrow-right me-2"></i> Logout
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </div>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
