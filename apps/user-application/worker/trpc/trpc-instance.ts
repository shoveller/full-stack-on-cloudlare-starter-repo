import { initTRPC } from "@trpc/server";
import type { Context } from "./context";

// 서버 전용 인스턴스. @trpc/server 패키지가 있어야 성립한다
// trpc 용 라우터 생성에만 사용한다.
export const t = initTRPC.context<Context>().create();
