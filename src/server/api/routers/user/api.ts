import { db } from "~/server/db";

export const getUserFromEmail = async (email: string) => {
	const user = await db.user.findFirst({
		where: { email },
		select: { id: true, name: true, email: true },
	});
	return user;
};
