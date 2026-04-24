import type { Route } from "./+types/main";
import { Main } from "../pages/main/main";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
    return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function MainRoute() {
    return (
        <ProtectedRoute>
            <Main />
        </ProtectedRoute>
    );
}
