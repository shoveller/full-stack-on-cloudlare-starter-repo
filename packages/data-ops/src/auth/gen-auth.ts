// packages/data-ops/src/auth/gen-auth.ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {getAuth} from "@/auth/auth";

const sqlite = new Database("./sqlite.db");
const drizzleDB = drizzle(sqlite);
const adapter = drizzleAdapter(drizzleDB, {
    provider: "sqlite"
})

export const auth = getAuth({ adapter });