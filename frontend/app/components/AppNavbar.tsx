import { Navbar, Container, Button } from "react-bootstrap";
import { Link } from "react-router";

interface AppNavbarProps {
    rightElement?: React.ReactNode;
}

export function AppNavbar({ rightElement }: AppNavbarProps) {
    return (
        <Navbar variant="dark" expand="lg" className="py-3 border-bottom border-dark" style={{ backgroundColor: 'transparent' }}>
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold fs-4 text-white">
                    <i className="bi bi-music-note-beamed text-brand me-2"></i>
                    AI Music Studio
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    {rightElement}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
