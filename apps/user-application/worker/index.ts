import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/routers";
import { createContext } from "./trpc/context";
import { initDatabase } from '@repo/data-ops/database'
import { WorkerEntrypoint } from 'cloudflare:workers';
import {App} from "@/worker/hono/app.ts";

export default class extends WorkerEntrypoint<Env> {
    constructor(ctx: ExecutionContext, env: Env) {
        super(ctx, env);
        initDatabase(env.DB)
    }
    fetch(request: Request) {
        return App.fetch(request, this.env, this.ctx, { userId, '12345' })
    }
}
