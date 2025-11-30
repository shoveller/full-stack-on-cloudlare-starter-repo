// 인증정보 컨텍스트 생성함수
export async function createAuthContext({
    req,
    env,
    workerCtx,
    userId
}: {
    req: Request;
    env: ServiceBindings;
    workerCtx: ExecutionContext;
    userId: string
}) {
    return {
        req,
        env,
        workerCtx,
        userInfo: {
            userId,
        },
    };
}

// 파일을 분리해서 이 타입의 순환참조를 막는다.
export type AuthContext = Awaited<ReturnType<typeof createAuthContext>>;
