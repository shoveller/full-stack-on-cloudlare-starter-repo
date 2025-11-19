- FE 프로젝트이다. 데이터 서비스와는 별도로 배포해야 한다.
- wrangler 로 배포하는게 가장 간단하다. 
  - 배포할때 로그인 토큰(CLOUDFLARE_API_TOKEN)이 환경변수에 지정되어 있으면 문제가 발생하지 않지만, 브라우저 로그인으로도 충분하다.

# 배포 원리
- wrangler.jsonc 에 assets 바인딩을 사용한다고 선언하고 ASSETS 라는 이름을 붙인다.
- assets 는 빌드타임에만 리소스를 넣을 수 있는 읽기전용 저장소이다.
```json
  "assets": {
    "binding": "ASSETS",
    "not_found_handling": "single-page-application"
  },
```

- vite.config.ts 의 cloudflare 플러그인이 빌드타임에 정적 리소스의 위치를 `apps/user-application/dist/user_application/wrangler.json` 에 기록한다.

- apps/user-application/worker/index.ts 는 trpc 핸들러와 assets 핸들러를 결합하여 요청을 처리한다.
- env.ASSETS 가 일종의 만능 라우터 역활을 한다.
  - 다른 보일러플레이트 코드에는 이 부분이 추상화되어 있다.
```ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/router";
import { createContext } from "./trpc/context";

export default {
  fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/trpc")) {
      return fetchRequestHandler({
        endpoint: "/trpc",
        req: request,
        router: appRouter,
        createContext: () =>
          createContext({ req: request, env: env, workerCtx: ctx }),
      });
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<ServiceBindings>;
```