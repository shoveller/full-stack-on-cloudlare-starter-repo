import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

import { routeTree } from "./routeTree.gen";
import type { AppRouter } from "@/worker/trpc/routers";
import Pending from "@/components/common/pending";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

export const queryClient = new QueryClient();

// 웹 브라우저용 trpc 클라이언트. @trpc/client , @trpc/react-query 가 있어야 성립한다
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient({
    links: [
      httpBatchLink({
        url: "/trpc",
      }),
    ],
  }),
  queryClient,
});

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    context: {
      trpc,
      queryClient,
    },
    defaultPendingComponent: () => <Pending />,
    Wrap: function WrapComponent({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    },
  });

  return router;
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
