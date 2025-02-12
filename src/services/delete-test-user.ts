import { db } from "~/server/db";

export const deleteTestUser = async () => {
  await db.user.delete({
    where: {
      email: process.env.TEST_USER_EMAIL!,
    },
  });
};
