import type { Route } from "./+types/generation";
import { Generation } from "../pages/generationmusic/generation";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
    return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function GenerationRoute() {
    return (
        <ProtectedRoute>
            <Generation />
        </ProtectedRoute>
    );
}
