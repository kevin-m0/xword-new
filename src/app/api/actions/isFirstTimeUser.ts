"use server";

import { db } from "~/server/db";

export async function isFirstTimeUser(id:string, image:string, email:string, firstName:string, lastName:string) {
    const doesUserExist = await db.user.findFirst({
        where: {
            id: id,
        },
    });

    if (!doesUserExist){
        const newUser = await db.user.create({
            data:{
                id: id,
                isFirstTimeUser: true,
                firstName: firstName,
                lastName: lastName,
                email: email,
                image: image,
            }
        })
        return newUser;
    }


    return false
}