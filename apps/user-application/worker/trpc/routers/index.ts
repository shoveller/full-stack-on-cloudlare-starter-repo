import { t } from "@/worker/trpc/trpc-instance.ts";
import { linksTrpcRoutes } from "@/worker/trpc/routers/links.ts";
import { evaluationsTrpcRoutes } from "@/worker/trpc/routers/evaluations.ts";

export const appRouter = t.router({
  links: linksTrpcRoutes,
  evaluations: evaluationsTrpcRoutes,
});

export type AppRouter = typeof appRouter;
