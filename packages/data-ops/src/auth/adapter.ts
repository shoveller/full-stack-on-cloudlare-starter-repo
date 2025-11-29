// packages/data-ops/src/auth/adapter.ts
import {drizzle} from "drizzle-orm/d1";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {account, session, user, verification} from "@/drizzle-out/auth-schema";

export const createAdapter = (drizzleDB: ReturnType<typeof drizzle>) => {
    return drizzleAdapter(drizzleDB, {
        provider: "sqlite",
        schema: {
            user,
            session,
            account,
            verification,
        },
    })
}