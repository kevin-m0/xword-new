"use server";
import { currentUser, type User } from "@clerk/nextjs/server";

import { db } from "~/server/db";

// Clerk utility to get user from the session
export async function getUser() {
  const user = await currentUser();

  try {
    if (!user) return null;

    //checking if user exists in database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (dbUser) return user;

    const parsedFirstName = user.firstName ?? "";
    const parsedLastName = user.lastName ?? "";

    const isUsernameEmpty =
      parsedFirstName.length === 0 && parsedLastName.length === 0;

    const newUser = await db.user.create({
      data: {
        id: user.id,
        email: user?.emailAddresses[0]?.emailAddress,
        name: isUsernameEmpty ? "User" : `${parsedFirstName} ${parsedLastName}`,
        image: user.imageUrl,
      },
    });

    if (!newUser) {
      throw new Error("Cannot create a user!");
    }

    return JSON.parse(JSON.stringify(newUser)) as User;
  } catch (error) {
    console.log(error);
    return null;
  }
}
