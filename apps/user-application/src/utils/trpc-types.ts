import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/worker/trpc/routers";

type TRPCOutput = inferRouterOutputs<AppRouter>;
export type LinkListItem = TRPCOutput["links"]["linkList"];
