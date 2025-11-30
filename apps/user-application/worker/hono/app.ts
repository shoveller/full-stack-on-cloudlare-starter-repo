import {Hono} from "hono";
import {fetchRequestHandler} from "@trpc/server/adapters/fetch";
import {appRouter} from "@/worker/trpc/routers";
import {createContext} from "@/worker/trpc/context.ts";
import {getDb} from '@repo/data-ops/database';
import {getAuth} from "@repo/data-ops/auth/auth";
import {createAdapter} from "@repo/data-ops/auth/adapter";

export const App = new Hono<{
    Bindings: ServiceBindings
    Variables: { userId: string }
}>()

const getAuthInstance = (env: Env) => {
    const adapter = createAdapter(getDb())

    return getAuth({
        adapter,
        socialProviders: {
            google: {
                clientId: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET,
            }
        }
    })
};

App.all('/trpc/*', (c) => {
    const userId = c.get('userId') || "demo-user"

    return fetchRequestHandler({
        endpoint: "/trpc",
        req: c.req.raw,
        router: appRouter,
        createContext: () =>
            createContext({req: c.req.raw, env: c.env, workerCtx: c.executionCtx, userInfo: {userId}}),
    });
})

// better auth 의 hono 레시피를 따름
// https://www.better-auth.com/docs/integrations/hono
App.on(['POST', 'GET'], '/api/auth/*', (c) => {
    const auth = getAuthInstance(c.env)

    return auth.handler(c.req.raw)
})