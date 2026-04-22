import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/login", "routes/login.tsx"),
    route("/signup", "routes/signup.tsx"),
    route("/generation", "routes/generation.tsx"),
    route("/main", "routes/main.tsx")
] satisfies RouteConfig;
