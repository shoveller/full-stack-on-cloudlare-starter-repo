// Cloudflare D1 바인딩을 Drizzle ORM으로 변환해주는 어댑터 유틸리티
import { drizzle } from "drizzle-orm/d1";

let db: ReturnType<typeof drizzle>;

export function initDatabase(bindingDb: D1Database) {
  db = drizzle(bindingDb);
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}
