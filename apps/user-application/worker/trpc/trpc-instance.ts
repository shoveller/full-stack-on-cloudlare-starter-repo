// apps/user-application/worker/trpc/trpc-instance.ts
import { initTRPC } from "@trpc/server";
import type { AuthContext } from "./context";

// 서버 전용 인스턴스. @trpc/server 패키지가 있어야 성립한다
// AuthContext 타입을 통해 컨텍스트 정보도 함께 전파한다.
export const t = initTRPC.context<AuthContext>().create();
