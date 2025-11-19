# TanStack React + tRPC + Cloudflare Worker 템플릿

이 템플릿은 TanStack React Router, tRPC, Cloudflare Workers가 완벽하게 통합된 설정을 제공하여, 엣지에서 실행되는 풀스택 애플리케이션을 구축할 수 있게 해줍니다.

## 기능

- [TanStack Router](https://tanstack.com/router) - 타입 안전하고 강력한 라우팅
- [TanStack Query](https://tanstack.com/query) - 데이터 가져오기 및 캐싱
- [tRPC](https://trpc.io/) - 엔드-투-엔드 타입 안전 API
- [Cloudflare Workers](https://workers.cloudflare.com/) - 엣지 컴퓨팅
- [Tailwind CSS](https://tailwindcss.com/) - 스타일링
- [TypeScript](https://www.typescriptlang.org/) - 타입 안전성

## 시작하기

### 사전 요구사항

- [Node.js](https://nodejs.org/) (v18 이상)
- [npm](https://www.npmjs.com/) (v7 이상)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) - Cloudflare Workers 개발용

### 설치

1. 의존성 설치:

```bash
npm install
```

2. 개발 서버 시작:

```bash
npm run dev
```

이렇게 하면 http://localhost:3000 에서 로컬 개발 서버가 시작됩니다.

## Cloudflare Worker 구성

### 서비스 바인딩 및 TypeScript

이 템플릿에는 Cloudflare Worker 바인딩에 대한 타입 정의가 포함되어 있습니다. 서비스 바인딩이나 다른 Cloudflare 리소스를 추가할 때 다음을 수행해야 합니다:

1. 바인딩에 대한 TypeScript 타입 생성:

```bash
npm run cf-typegen
```

이 명령어는 Cloudflare Worker 환경에 대한 타이핑을 생성하거나 업데이트합니다.

2. `service-bindings.d.ts` 파일의 `Service Bindings` 인터페이스 업데이트:

```typescript
interface ServiceBindings extends Env {
  // 여기에 추가적인 타입 바인딩을 추가할 수 있습니다
}
```

3. tRPC 컨텍스트 및 프로시저에서 타입이 지정된 바인딩 사용:

```typescript
// context.ts에서
export async function createContext({
  req,
  env,
  workerCtx,
}: {
  req: Request;
  env: ServiceBindings; // 타입이 지정된 바인딩이 포함됩니다
  workerCtx: ExecutionContext;
}) {
  return {
    req,
    env,
    workerCtx,
  };
}

// tRPC 프로시저에서
export const myProcedure = t.procedure
  .query(({ ctx }) => {
    // 타입이 지정된 바인딩에 접근
    const value = await ctx.env.MY_KV.get('some-key');
    return { value };
  });
```

## 배포

애플리케이션을 Cloudflare Workers에 배포하려면:

1. 애플리케이션 빌드:

```bash
npm run build
```

2. Cloudflare에 배포:

```bash
npm run deploy
```

이렇게 하면 애플리케이션이 Cloudflare Workers 계정에 배포됩니다. Wrangler가 Cloudflare 계정 자격 증명으로 구성되어 있는지 확인하십시오.

### 구성

`wrangler.toml` 파일을 편집하여 Cloudflare Worker 배포를 사용자 정의할 수 있습니다. 주요 구성은 다음과 같습니다:

- `name`: 워커의 이름
- `compatibility_date`: Cloudflare Workers 호환성 날짜
- `routes`: 워커에 대한 URL 패턴 매칭
- `site`: 정적 자산 제공을 위한 구성

## 프로젝트 구조

```
├── src/                  # 프론트엔드 React 애플리케이션
│   ├── routes/           # TanStack 라우터 경로
│   ├── trpcClient.ts     # tRPC 클라이언트 설정
│   └── main.tsx          # 애플리케이션 진입점
│
├── worker/               # Cloudflare Worker 백엔드
│   ├── index.ts          # 워커 진입점
│   └── trpc/             # tRPC 라우터 및 프로시저
│       ├── context.ts    # tRPC 컨텍스트 생성
│       ├── router.ts     # 메인 tRPC 라우터
│       └── routers/      # 개별 tRPC 라우트 핸들러
│
├── public/               # 정적 자산
└── wrangler.toml         # Cloudflare Worker 구성
```

## 추가 자료

- [TanStack Router 문서](https://tanstack.com/router/latest/docs/overview)
- [TanStack Query 문서](https://tanstack.com/query/latest/docs/react/overview)
- [tRPC 문서](https://trpc.io/docs)
- [Cloudflare Workers 문서](https://developers.cloudflare.com/workers/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)