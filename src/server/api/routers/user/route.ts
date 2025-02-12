import { db } from "~/server/db";
import { createTRPCRouter, privateProcedure } from "../../trpc";

export const userRouter = createTRPCRouter({
	getCurrentLoggedInUser: privateProcedure.query(
		async ({ ctx }) => {
			const user = await db.user.findUnique({
				where: {
					id: ctx.userId,
				},
			});
			if (user) return user;
			else return null;
		}
	),
});