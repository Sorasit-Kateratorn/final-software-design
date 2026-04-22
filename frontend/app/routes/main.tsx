import type { Route } from "./+types/main";
import { Main } from "../pages/main/main";

export function meta({}: Route.MetaArgs) {
    return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function MainRoute() {
    return <Main />;
}
