import type { Route } from "./+types/signup";
import { Signup } from "../pages/signup/signup";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Sign Up - AI Music Studio" }];
}

export default function SignupRoute() {
    return <Signup />;
}
