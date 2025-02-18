import { db } from "~/server/db";
import { createTRPCRouter, privateProcedure } from "../../trpc";
import { z } from "zod";

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
	createUser: privateProcedure.input(
		z.object({
		  userId: z.string(),
		  email: z.string(),
		  name: z.string(),
		  image: z.string(),
		  firstName: z.string(),
		  lastName: z.string(),
		})
	  ).mutation(async ({ ctx, input }) => {
		const user = await db.user.create({
		  data: {
			id: input.userId, // Ensure the userId comes from the context (i.e., authenticated user)
			email: input.email,
			name: input.name,
			image: input.image,
			firstName: input.firstName,
			lastName: input.lastName,
		  },
		});
		return user;
	  }),
	  findUser: privateProcedure.input(z.object({
		id: z.string()
	  })).query(async({input}) => {
		const user = await db.user.findUnique({
			where: {
				id: input.id
			}
		})
		if (user) return user
		else return null
	  })
});