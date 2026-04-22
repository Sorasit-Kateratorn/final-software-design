import type { Route } from "./+types/generation";
import { Generation } from "../pages/generationmusic/generation";

export function meta({}: Route.MetaArgs) {
    return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function GenerationRoute() {
    return <Generation />;
}
