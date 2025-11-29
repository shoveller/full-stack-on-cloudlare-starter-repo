import {Hono} from "hono";
import {fetchRequestHandler} from "@trpc/server/adapters/fetch";
import {appRouter} from "@/worker/trpc/routers";
import {createContext} from "@/worker/trpc/context.ts";

export const App = new Hono<{
    Bindings: ServiceBindings
    Variables: { userId: string }
}>()

App.all('/trpc/*', (c) => {
    const userId = c.get('userId') || "demo-user"

    return fetchRequestHandler({
        endpoint: "/trpc",
        req: c.req.raw,
        router: appRouter,
        createContext: () =>
          createContext({req: c.req.raw, env: c.env, workerCtx: c.executionCtx, userInfo: { userId }}),
    });
})