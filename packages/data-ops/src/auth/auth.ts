// packages/data-ops/src/auth/auth.ts
import {betterAuth, type BetterAuthPlugin} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import type {SocialProviders} from "better-auth/social-providers";

let auth: ReturnType<typeof betterAuth>;

type GetAuth = {
    adapter: ReturnType<typeof drizzleAdapter>,
    socialProviders?: SocialProviders,
    plugins?: BetterAuthPlugin[]
}

export function getAuth({adapter, plugins, socialProviders}: GetAuth): ReturnType<typeof betterAuth> {
    if (auth) return auth;

    auth = betterAuth({
        database: adapter,
        emailAndPassword: {
            enabled: false,
        },
        socialProviders,
        plugins
    });

    return auth;
}
