// TODO: 이 추상계층은 왜 만든거지?
export async function createContext({
  req,
  env,
  workerCtx,
  userInfo
}: {
  req: Request;
  env: ServiceBindings;
  workerCtx: ExecutionContext;
  userInfo: { userId: string }
}) {
  return {
    req,
    env,
    workerCtx,
    userInfo,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
