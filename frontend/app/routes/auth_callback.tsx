import type { Route } from "./+types/auth_callback";
import { AuthCallback } from "../pages/auth_callback/auth_callback";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Google Login - AI Music Studio" }];
}

export default function AuthCallbackRoute() {
    return <AuthCallback />;
}
