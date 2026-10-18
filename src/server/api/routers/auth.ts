import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  getProfile: privateProcedure.query(async ({ ctx }) => {
    let profile = await ctx.db.profiles.findFirst({
      where: {
        id: ctx.user.id,
      },
    });

    if (!profile && ctx.user.email) {
      try {
        profile = await ctx.db.profiles.create({
          data: {
            id: ctx.user.id,
            email: ctx.user.email,
            fullName:
              (ctx.user.user_metadata?.full_name as string) ||
              (ctx.user.user_metadata?.name as string) ||
              null,
          },
        });
      } catch (e) {
        // In case trigger created it concurrently, re-fetch
        profile = await ctx.db.profiles.findFirst({
          where: {
            id: ctx.user.id,
          },
        });
      }
    }

    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;
  }),
});
