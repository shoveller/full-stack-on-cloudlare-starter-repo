import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/routers";
import { createContext } from "./trpc/context";
import { initDatabase } from '@repo/data-ops/database'
import { WorkerEntrypoint } from 'cloudflare:workers';

export default class extends WorkerEntrypoint<Env> {
    constructor(ctx: ExecutionContext, env: Env) {
        super(ctx, env);
        initDatabase(env.DB)
    }
    fetch(request: Request) {
        const url = new URL(request.url);

        if (url.pathname.startsWith("/trpc")) {
            return fetchRequestHandler({
                endpoint: "/trpc",
                req: request,
                router: appRouter,
                createContext: () =>
                    createContext({ req: request, env: this.env, workerCtx: this.ctx }),
            });
        }
        return this.env.ASSETS.fetch(request);
    }
}

// export default {
//   fetch(request, env, ctx) {
//     initDatabase(env.DB)
//     const url = new URL(request.url);
//
//     if (url.pathname.startsWith("/trpc")) {
//       return fetchRequestHandler({
//         endpoint: "/trpc",
//         req: request,
//         router: appRouter,
//         createContext: () =>
//           createContext({ req: request, env: env, workerCtx: ctx }),
//       });
//     }
//     return env.ASSETS.fetch(request);
//   },
// } satisfies ExportedHandler<ServiceBindings>;
