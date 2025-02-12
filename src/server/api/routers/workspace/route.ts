import { z } from "zod";

import { db } from "~/server/db";
import * as spaceApi from "./api";
import * as documentApi from "../document/api";
import { ACCESSTYPE } from "@prisma/client";
import { createTRPCRouter, privateProcedure } from "../../trpc";

export const workspaceRouter = createTRPCRouter({
  fetchAllSpaces: privateProcedure
  .input(
    z.object({
      organizationId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { userId } = ctx;

    const { spaces } = await spaceApi.fetchAllSpaceForUser(
      userId, 

      input.organizationId
    );
    return spaces;
  }),


  /**
 * Creates a new space in the database.
 * @param {Object} input - The input object.
 * @param {string} input.name- The name of the space.
 * @param {string} input.defaultSpace- The default space determines wether this space is the default space for the user.
 * @returns {Object} Returns the space created by the user.
 */
createSpace: privateProcedure
.input(
  z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    jobTitle: z.string().optional(),
    department: z.string().optional(),
    organizationName: z.string().optional(),
    subdomain: z.string().optional(),
    industry: z.string().optional(),
    organizationSize: z.string().optional(),
    WorkspaceName: z.string(),
    organizationId: z.string(),
  })
)
.mutation(async ({ input, ctx }) => {
  console.log("input", input);
  const {
    firstName,
    lastName,
    jobTitle,
    department,
    organizationName,
    subdomain,
    industry,
    organizationSize,
    WorkspaceName,
    organizationId,
  } = input;
  const { userId } = ctx;

  const { space } = await spaceApi.createSpace(
    userId,
    WorkspaceName,
    organizationId,
    firstName,
    lastName,
    jobTitle,
    department,
    organizationName,
    subdomain,
    industry,
    organizationSize
  );
  return space;
}),

/**
 * To edit the space name.
 * @param {Object} input - The input object.
 * @param {string} input.name- The name of the space.
 * @param {string} input.spaceId- The id of the space to edit.
 */
editSpace: privateProcedure
  .input(
    z.object({
      name: z.string(),
      spaceId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { name, spaceId } = input;
    const { userId } = ctx;

    await spaceApi.editSpace(name, userId, spaceId);
  }),

  /**
 * To remove the space from the database.
 * @param {Object} input - The input object.
 * @param {string} input.spaceId- The id of the space to remove.
 */
removeSpace: privateProcedure
.input(
  z.object({
    spaceId: z.string(),
    organizationId: z.string(),
  })
)
.mutation(async ({ input, ctx }) => {
  const { spaceId } = input;
  const { userId } = ctx;

  const { changeActiveSpace, space } = await spaceApi.removeSpace(
    userId,
    spaceId,
    input.organizationId
  );

  return { changeActiveSpace, space };
}),

inviteToSpace: privateProcedure
  .input(
    z.object({
      spaceId: z.string(),
      email: z.string().email({ message: "Please provide a valid email" }),
      memberRole: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { spaceId, email, memberRole } = input;
    const { member, workspace } = await spaceApi.inviteToSpace(
      email,
      spaceId,
      memberRole,
      ctx.userId
    );

    const documentsInSpace = await spaceApi.fetchSpaceDocs(spaceId);
    const accessType =
      memberRole === "VIEWER" ? ACCESSTYPE.READ : ACCESSTYPE.WRITE;
    documentsInSpace &&
      Promise.all(
        documentsInSpace.documents.map(async (document) => {
          await documentApi.replicateSpaceDoc(
            document,
            accessType,
            member.userId
          );
        })
      );

    return { member, workspace };
  }),

  /**
 * Fetches the invitees of a particular space
 * @param {Object} input - The input object.
 * @param {string} input.spaceId- The ID of the space for which invitees are to be fetched.
 * @returns {Object} Returns an array of invitees of a particular space
 */
fetchSpaceInvitees: privateProcedure
.input(
  z.object({
    spaceId: z.string(),
  })
)
.query(async ({ input }) => {
  const { spaceId } = input;

  const { invitees } = await spaceApi.fetchSpaceInvitees(spaceId);
  return invitees;
}),
revokeSpaceAccess: privateProcedure
  .input(
    z.object({
      email: z.string().email(),
      spaceId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { email, spaceId } = input;
    await spaceApi.revokeSpaceAccessForUser(email, spaceId, ctx.userId);
    return "Access Revoked";
  }),
  changeSpaceAccessType: privateProcedure
  .input(
    z.object({
      spaceId: z.string(),
      userId: z.string(),
      memberRole: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { spaceId, userId, memberRole } = input;
    await spaceApi.changeSpaceAccessTypeForUser(
      userId,
      spaceId,
      memberRole,
      ctx.userId
    );

    return "Updated Access";
  }),

  fetchJoinedSpaces: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
  
    const { joinedSpaces } = await spaceApi.fetchJoinedSpacesForUser(userId);
  
    return joinedSpaces;
  }),
  changeActiveSpace: privateProcedure
  .input(
    z.object({
      newActiveSpaceId: z.string(),
      organizationId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { newActiveSpaceId, organizationId } = input;

    const { newActiveSpace } = await spaceApi.changeActiveSpaceForUser(
      userId,
      newActiveSpaceId,
      organizationId
    );

    return newActiveSpace;
  }),

  /**
 * Fetches the default space of the user
 * @returns {Object} Returns the default space of the user.
 */
getDefaultSpace: privateProcedure
.input(
  z.object({
    organizationId: z.string(),
  })
)
.query(async ({ ctx, input }) => {
  const { userId } = ctx;
  const { organizationId } = input;

  const { defaultSpace } = await spaceApi.getDefaultSpaceForUser(
    userId,
    organizationId
  );
  return defaultSpace;
}),

/**
 * Fetches the active space for a user
 * @returns {Object} Returns the active space for the user.
 */
fetchActiveSpace: privateProcedure
  .input(
    z.object({
      organizationId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { userId } = ctx;
    const data = await spaceApi.fetchActiveSpaceForUser(
      userId,
      input.organizationId
    );
    if (data && !data.currentMember)
      await spaceApi.switchToDefaultSpace(userId, input.organizationId);
    return data;
  }),

  /**
 * Remove user as a collaborator in the space
 * @param {Object} input - The input object.
 * @param {string} input.spaceId- ID of the space
 * @returns {Object} Returns the active space as the default space for user
 */
leaveSpace: privateProcedure
.input(
  z.object({
    spaceId: z.string(),
    organizationId: z.string(),
  })
)
.mutation(async ({ ctx, input }) => {
  const { spaceId } = input;
  const { userId } = ctx;

  const { member } = await spaceApi.checkIfUserMemberOfSpace(userId, spaceId);

  // If the user is collaborator, then remove his corresponding member record from the members table
  spaceApi.deleteMemberFromSpace(member.id, spaceId);

  // After removing the member record for user, switch to default space the user has
  // and return activeSpace = defualtSpace
  const { defaultSpace } = await spaceApi.switchToDefaultSpace(
    userId,
    input.organizationId
  );

  return { activeSpace: defaultSpace };
}),
/**
 * Fetches the permissions of a currently active space
 * @returns {Object} Returns the Permisison of the currently active space (READ/WRITE)
 */
getActiveSpacePermissions: privateProcedure
  .input(
    z.object({
      organizationId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { userId } = ctx;

    // Check if the user is member of the active space or not
    const { member } = await spaceApi.checkIfUserMemberOfActiveSpace(userId);

    if (!member) {
      // If the user is not a member of active space, then switch to default space
      // and return the permissions for default space
      const { defaultSpace } = await spaceApi.switchToDefaultSpace(
        userId,
        input.organizationId
      );

      const member = await db.member.findFirst({
        where: {
          userId,
          workspaceId: defaultSpace?.id,
        },
      });

      return { permission: member?.memberRole };
    }

    // Else if the user is a member of active space, return permission for this active space
    return { permission: member.memberRole };
  }),
  switchToDefaultSpace: privateProcedure
  .input(
    z.object({
      organizationId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;

    const { defaultSpace } = await spaceApi.switchToDefaultSpace(
      userId,
      input.organizationId
    );

    return { activeSpace: defaultSpace };
  }),

})