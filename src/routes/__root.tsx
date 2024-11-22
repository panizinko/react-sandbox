import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Shell } from "../components/Shell";

export const Route = createRootRoute({
  component: () => (
    <Shell>
      <Outlet />
      <TanStackRouterDevtools />
    </Shell>
  ),
});
