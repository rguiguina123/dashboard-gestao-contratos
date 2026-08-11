import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { approveImport, getCurrentDashboardData, listImportHistory, prepareImport } from "./dataImports";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  dataImports: router({
    current: publicProcedure.query(() => getCurrentDashboardData()),
    history: publicProcedure.query(() => listImportHistory()),
    prepare: publicProcedure.input(z.object({
      fileName: z.string().min(5).max(255),
      fileBase64: z.string().min(20).max(8_000_000),
    })).mutation(async ({ ctx, input }) => {
      try {
        const result = await prepareImport(input.fileName, Buffer.from(input.fileBase64, "base64"), 0);
        return { state: "ready" as const, ...result };
      } catch (error) {
        const message = error instanceof Error ? error.message : "A validação da planilha falhou.";
        return { state: "invalid" as const, errors: message.split("\n").filter(Boolean) };
      }
    }),
    approve: publicProcedure.input(z.object({ importId: z.number().int().positive() }))
      .mutation(({ input }) => approveImport(input.importId, 0)),
  }),
});

export type AppRouter = typeof appRouter;
