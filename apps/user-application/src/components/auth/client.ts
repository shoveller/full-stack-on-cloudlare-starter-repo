// apps/user-application/src/components/auth/client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // 엔드포인트 주소를 커스텀할 수 있다.
    // baseURL: "http://localhost:5173"
});

export type ClientSession = typeof authClient.$Infer.Session
