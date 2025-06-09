import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/trpc";
import { NextResponse } from "next/server";

const handler = async (req: Request) => {
  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: async () => {
        const context = await createContext({ req, res: new Response() });
        return context;
      },
      onError:
        process.env.NODE_ENV === "development"
          ? ({ path, error }) => {
              console.error(
                `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
              );
              console.error(error.stack);
            }
          : undefined,
    });

    return response;
  } catch (error) {
    console.error("Error in tRPC handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export { handler as GET, handler as POST };
