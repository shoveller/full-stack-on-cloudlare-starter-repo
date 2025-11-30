import {Hono} from "hono";
import {fetchRequestHandler} from "@trpc/server/adapters/fetch";
import {appRouter} from "@/worker/trpc/routers";
import {createAuthContext} from "@/worker/trpc/context.ts";
import {getDb} from '@repo/data-ops/database';
import {getAuth} from "@repo/data-ops/auth/auth";
import {createAdapter} from "@repo/data-ops/auth/adapter";
import {createMiddleware} from "hono/factory";

type HonoContext = {
    Bindings: ServiceBindings
    Variables: { userId?: string }
}

export const App = new Hono<HonoContext>()

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

const authMiddleware = createMiddleware<HonoContext>(async (c, next) => {
    const auth = getAuthInstance(c.env)
    const session = await auth.api.getSession({
        headers: c.req.raw.headers
    })
    // 검증 조건은 인증 수단에 따라 다양하게 수정
    if (!session?.user) {
        return c.text('Unauthorized', 401)
    }

    const userId = session?.user.id
    c.set('userId', userId)
    // 이 지점에 컨텍스트를 더 추가할 수 있다.
    await next()
})

App.all('/trpc/*', authMiddleware, (c) => {
    const userId = c.get('userId') || ''

    return fetchRequestHandler({
        endpoint: "/trpc",
        req: c.req.raw,
        router: appRouter,
        createContext: () =>
            createAuthContext({req: c.req.raw, env: c.env, workerCtx: c.executionCtx, userId}),
    });
})

// better auth 의 hono 레시피를 따름. 이 부분의 보안은 걱정하지 않아도 됨.
// https://www.better-auth.com/docs/integrations/hono
App.on(['POST', 'GET'], '/api/auth/*', (c) => {
    const auth = getAuthInstance(c.env)

    return auth.handler(c.req.raw)
})