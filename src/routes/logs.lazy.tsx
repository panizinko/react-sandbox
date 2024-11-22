import { createLazyFileRoute } from "@tanstack/react-router";
import { LogsPage } from "../pages/LogsPage";

export const Route = createLazyFileRoute("/logs")({
  component: LogsPage,
});
