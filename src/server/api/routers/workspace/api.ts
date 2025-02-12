import { db } from "~/server/db";
import { MEMBERROLE, Workspace } from "@prisma/client";
import { TRPCError } from "@trpc/server";

/**
 * Switches the user to their default space.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<{ defaultSpace: Space }>} - A promise that resolves to an object containing the default space.
 * @throws {TRPCError} - If the user does not have a default space.
 */
export const switchToDefaultSpace = async (
  userId: string,
  organizationId: string
) => {
  if (organizationId.length === 0) {
    const workspace: Workspace[] = [];
    return { workspace };
  }

  // Find the default space of the user and assign it to him
  const defaultSpace = await db.workspace.findFirst({
    where: {
      userId,
      defaultSpace: true,
      organizationId,
    },
    include: {
      members: true,
    },
  });

  console.log("default", defaultSpace);
  console.log("user", userId);
  console.log("org", organizationId);

  // If the user does not have a default space, create one for him. This happens when the user is invited to join a new organization by someone else.
  if (!defaultSpace && userId.length > 0 && organizationId.length > 0) {

    const space = await db.workspace.create({
      data: {
        name: "DEFAULT_SPACE",
        userId,
        defaultSpace: true,
        organizationId,
      }
    });

    let activeSpaceDetails = await db.activeWorkSpace.findFirst({
      where: {
        userId,
      },
    });

    if (!activeSpaceDetails) {
      activeSpaceDetails = await db.activeWorkSpace.create({
        data: {
          userId,
          activeWorkSpaceId: space.id,
          organizationId,
        },
      });
    }

    await db.activeWorkSpace.update({
      where: {
        id: activeSpaceDetails.id,
      },
      data: {
        activeWorkSpaceId: space.id,
      },
    });

    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) throw new TRPCError({
      message: "User not found",
      code: "NOT_FOUND",
    });

    // Create a member for it (the user who created the space)
    await db.member.create({
      data: {
        workspaceId: space?.id,
        userId,
        email: user.email || "",
        memberRole: MEMBERROLE.ADMIN,
      },
    });
    console.log("space created", space);




    // throw new TRPCError({
    //   message: "The user does not have a default space",
    //   code: "NOT_FOUND",
    // });
    return { defaultSpace: space };
  }
  return { defaultSpace };
};

/**
 * Checks if a user is a member of the active space.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<{ member: Member }>} - A promise that resolves to an object containing the member information.
 * @throws {TRPCError} - Throws an error if there is no active space for the user.
 */
export const checkIfUserMemberOfActiveSpace = async (userId: string) => {
  const activeSpaceTable = await db.activeWorkSpace.findFirst({
    where: {
      userId,
    },
    select: {
      activeWorkSpace: true,
    },
  });

  if (!activeSpaceTable) {
    throw new TRPCError({
      message: "No active space for this user",
      code: "NOT_FOUND",
    });
  }

  const { member } = await checkIfUserMemberOfSpace(
    userId,
    activeSpaceTable.activeWorkSpace.id
  );

  return { member };
};

/**
 * Checks if a user is a member of a specific space.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} spaceId - The ID of the space.
 * @returns {Promise<{ member: Member }>} - A promise that resolves to an object containing the member information if the user is a member of the space.
 * @throws {TRPCError} - Throws a TRPCError with a message and code if the user is not a collaborator in the space.
 */
export const checkIfUserMemberOfSpace = async (
  userId: string,
  spaceId: string
) => {
  // First make sure that user is a collaborator in this space
  const member = await db.member.findFirst({
    where: {
      workspaceId: spaceId,
      userId,
    },
  });

  if (!member) {
    throw new TRPCError({
      message: "User is not a collaborator in this Space",
      code: "BAD_REQUEST",
    });
  }

  return { member };
};

/**
 * Deletes a member from a space.
 *
 * @param {string} memberId - The ID of the member to delete.
 * @param {string} spaceId - The ID of the space from which to delete the member.
 * @throws {TRPCError} - If the member is not found in the space.
 * @returns {Promise<void>} - A promise that resolves when the member is successfully deleted.
 */
export const deleteMemberFromSpace = async (
  memberId: string,
  spaceId: string
) => {
  const member = await db.member.findUnique({
    where: {
      id: memberId,
      workspaceId: spaceId,
    },
  });

  if (!member) {
    throw new TRPCError({
      message: "User is not a member of this space",
      code: "BAD_REQUEST",
    });
  }

  // If the user is collaborator, then remove his corresponding member record from the members table
  await db.member.delete({
    where: {
      id: member.id,
      workspaceId: spaceId,
    },
  });
};

/**
 * Fetches the active space for a given user.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<{ activeSpace: Space }>} - A promise that resolves to an object containing the active space.
 * @throws {TRPCError} - If the user does not have an active space.
 */
export const fetchActiveSpaceForUser = async (
  userId: string,
  organizationId: string
) => {
  const activeSpaces = await db.activeWorkSpace.findMany({
    where: {

      organizationId,
    },
    include: {
      activeWorkSpace: {
        include: {
          members: {
            select: {
              userId: true,
            },
          },
        },
      },

    },
  });

  const activeSpaceTable = activeSpaces.filter(
    (space) => space.activeWorkSpace.members.some((member) => member.userId === userId)
  );
  // if(activeSpaceTable?.userId !== userId){
  //   throw new TRPCError({
  //     message: "User is not a member of this space",
  //     code: "BAD_REQUEST",
  //   });
  // }
  // console.log("activeSpaceTable", activeSpaceTable[0]);
  let _workspace;
  let _defaultSpace;

  if (!activeSpaceTable) {
    const { defaultSpace, workspace } = await switchToDefaultSpace(
      userId,
      organizationId
    );
    if (workspace) {
      _workspace = workspace;
    } else {
      _defaultSpace = defaultSpace;
    }
  }

  const activeSpace = await db.workspace.findFirst({
    where: {
      id: _workspace
        ? _workspace[0]?.id
        : _defaultSpace
          ? _defaultSpace.id
          : activeSpaceTable[0]?.activeWorkSpaceId,
      // organizationId: organizationId,
    },
    include: {
      _count: {
        select: {
          members: true,
        },
      },
      members: {
        select: {
          memberRole: true,
          userId: true,
        },
      },
    },
  });



  if (!activeSpace) {
    switchToDefaultSpace(userId, organizationId);
    return;
  }
  const currentMember = activeSpace.members.find(
    (member) => member.userId === userId
  );
  return { ...activeSpace, currentMember };
};

/**
 * Retrieves the default space for a given user.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<{ defaultSpace: Space }>} - A promise that resolves to an object containing the default space.
 * @throws {TRPCError} - Throws an error if the user does not have a default space.
 */
export const getDefaultSpaceForUser = async (
  userId: string,
  organizationId: string
) => {
  const defaultSpace = await db.workspace.findFirst({
    where: {
      userId,
      defaultSpace: true,
      organizationId,
    },
  });

  if (!defaultSpace) {
    throw new TRPCError({
      message: "The user does not have a default space",
      code: "NOT_FOUND",
    });
  }

  return { defaultSpace };
};

/**
 * Changes the active space for a user.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} newSpaceId - The ID of the new space.
 * @returns {Object} - The new active space.
 * @throws {TRPCError} - If the user does not have an active space.
 */
export const changeActiveSpaceForUser = async (
  userId: string,
  newSpaceId: string,
  organizationId: string
) => {
  const activeSpaceTable = await db.activeWorkSpace.findFirst({
    where: {
      userId,
    },
  });

  if (!activeSpaceTable) {
    throw new TRPCError({
      message: "The user does not have an active space",
      code: "NOT_FOUND",
    });
  }

  await db.activeWorkSpace.update({
    where: {
      id: activeSpaceTable.id,
    },
    data: {
      activeWorkSpaceId: newSpaceId,
    },
  });

  const newActiveSpace = await db.workspace.findUnique({
    where: {
      id: newSpaceId,
    },
  });

  return { newActiveSpace };
};

export const fetchJoinedSpacesForUser = async (userId: string) => {
  const member = await db.member.findMany({
    where: {
      userId,
    },
    select: {
      workspace: {
        include: {
          members: {
            select: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!member) {
    throw new TRPCError({
      message: "The user is not a member of any space",
      code: "BAD_REQUEST",
    });
  }

  let joinedSpaces = member
    .map((member) => ({
      ...member,
      space: {
        ...member.workspace,
        members: [
          ...member.workspace.members.map((members) => ({
            user: members.user,
          })),
        ],
      },
    }))
    .map((item) => item.space)
    .filter((space) => space.userId !== userId);

  return { joinedSpaces };
};

export const changeSpaceAccessTypeForUser = async (
  userId: string,
  spaceId: string,
  memberRole: MEMBERROLE,
  currentUserId: string
) => {
  const space = await db.workspace.findFirst({
    where: {
      id: spaceId,
    },
    include: { members: true, documents: true },
  });
  if (!space)
    throw new TRPCError({
      message: "No Space found!",
      code: "NOT_FOUND",
    });

  const isAdmin = space.members.some(
    (member) =>
      member.userId === currentUserId && member.memberRole === MEMBERROLE.ADMIN
  );
  if (!isAdmin) {
    throw new TRPCError({
      message:
        "You can't change space access role for members with current permissions.",
      code: "FORBIDDEN",
    });
  }

  const member = space.members.find(
    (member) => member.userId === userId && member.workspaceId === spaceId
  );
  if (!member) {
    throw new TRPCError({
      message: "The user is not a member of this space",
      code: "BAD_REQUEST",
    });
  }

  await db.member.update({
    data: {
      memberRole,
    },
    where: {
      id: member?.id,
    },
  });
  await Promise.all(
    space.documents
      .filter((document) => document.userId === userId)
      .map(async (document) => {
        document.access = memberRole === MEMBERROLE.VIEWER ? "READ" : "WRITE";
        await db.document.update({
          where: { id: document.id },
          data: { access: document.access },
        });
      })
  );
};

/**
 * Revoke space access for a user.
 *
 * @param email - The email of the user.
 * @param spaceId - The ID of the space.
 * @throws {TRPCError} - If the user is not found or is not a member of the space.
 * @returns {Promise<void>} - A promise that resolves when the space access is revoked.
 */
export const revokeSpaceAccessForUser = async (
  email: string,
  spaceId: string,
  currentUserId: string
) => {
  const user = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (!user)
    throw new TRPCError({
      message: "User not found",
      code: "NOT_FOUND",
    });

  const space = await db.workspace.findFirst({
    where: {
      id: spaceId,
    },
    include: {
      members: true,
    },
  });

  if (!space) {
    throw new TRPCError({
      message: "We couldn't find the space you are looking for.",
      code: "NOT_FOUND",
    });
  }

  const isAdmin = space.members.some(
    (member) =>
      member.userId === currentUserId && member.memberRole === MEMBERROLE.ADMIN
  );

  if (!isAdmin) {
    throw new TRPCError({
      message:
        "You can't revoke space access from members with current permissions.",
      code: "FORBIDDEN",
    });
  }

  const member = space?.members.find((member) => member.email === email);

  if (!member) {
    throw new TRPCError({
      message: "The user is not a member of this space",
      code: "BAD_REQUEST",
    });
  }

  await db.member.delete({
    where: {
      id: member?.id,
      workspaceId: spaceId,
    },
  });
};

/**
 * Fetches the invitees for a given space.
 *
 * @param spaceId - The ID of the space.
 * @returns An object containing the invitees for the space.
 * @throws {TRPCError} If the space has no members.
 */
export const fetchSpaceInvitees = async (spaceId: string) => {
  const space = await db.workspace.findFirst({
    where: {
      id: spaceId,
    },
  });

  const members = await db.member.findMany({
    where: {
      workspaceId: spaceId,
    },
    select: {
      user: true,
      memberRole: true,
    },
  });

  if (!members) {
    throw new TRPCError({
      message: "The space has no members in it",
      code: "NOT_FOUND",
    });
  }

  const invitees = members.map((member) => ({
    user: member.user,
    isOwner: member.user.id === space?.userId,
    memberRole: member.memberRole,
  }));

  return { invitees };
};

/**
 * Invites a user to a space with the specified access type.
 *
 * @param email - The email of the user to invite.
 * @param spaceId - The ID of the space to invite the user to.
 * @param accessType - The access type for the user in the space. Must be either "READ" or "WRITE".
 * @returns The created member object.
 * @throws {TRPCError} If the user or space is not found, or if the user is already a member of the space.
 */
export const inviteToSpace = async (
  email: string,
  workspaceId: string,
  memberRole: MEMBERROLE,
  currentUserId: string
) => {
  const user = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new TRPCError({
      message: "User not found",
      code: "NOT_FOUND",
    });
  }

  const workspace = await db.workspace.findFirst({
    where: {
      id: workspaceId,
    },
    include: {
      members: true,
    },
  });

  if (!workspace) {
    throw new TRPCError({
      message: "Workspace not found",
      code: "NOT_FOUND",
    });
  }
  const isAdmin = workspace.members.some((member) => {
    return (
      member.userId === currentUserId && member.memberRole === MEMBERROLE.ADMIN
    );
  });

  if (!isAdmin) {
    throw new TRPCError({
      message:
        "You can't invite members to workspace with current permissions.",
      code: "FORBIDDEN",
    });
  }

  const existingMember = await db.member.findFirst({
    where: {
      userId: user.id as string,
      workspaceId: workspaceId,
    },
  });

  if (existingMember) {
    throw new TRPCError({
      message: "User is already a member of the workspace",
      code: "FORBIDDEN",
    });
  }

  const member = await db.member.create({
    data: {
      userId: user?.id,
      email: user.email as string,
      workspaceId: workspace.id,
      memberRole: memberRole,
    },
  });

  return {
    member: { ...member, name: user.name },
    workspace,
  };
};

/**
 * Removes a space for a given user.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} spaceId - The ID of the space to be removed.
 * @throws {TRPCError} If the space is not found or if it is the user's default space.
 * @returns {Promise<void>} A promise that resolves when the space is successfully removed.
 */
export const removeSpace = async (
  userId: string,
  spaceId: string,
  organizationId: string
) => {
  const existingSpace = await db.workspace.findFirst({
    where: {
      id: spaceId,
      userId,
    },
    include: {
      members: true,
    },
  });
  if (!existingSpace) {
    throw new TRPCError({
      message: "We couldn't find the space you are looking for.",
      code: "NOT_FOUND",
    });
  }

  const isAdmin = existingSpace.members.some(
    (member) =>
      member.userId === userId && member.memberRole === MEMBERROLE.ADMIN
  );
  if (!isAdmin) {
    throw new TRPCError({
      message: "You can't remove space with current permissions.",
      code: "FORBIDDEN",
    });
  }

  const activeSpace = await db.activeWorkSpace.findFirst({
    where: { userId },
    select: { activeWorkSpaceId: true },
  });

  let changeActiveSpace = false; // To determine whether we need to change the active space for the user
  let space = existingSpace; // For return value

  if (activeSpace?.activeWorkSpaceId === spaceId) {
    const { defaultSpace } = await switchToDefaultSpace(userId, organizationId);
    space = defaultSpace ? {...defaultSpace,members: space.members} : space;
    changeActiveSpace = true;
  }

  if (existingSpace.defaultSpace) {
    throw new TRPCError({
      message: "You cannot remove your default space.",
      code: "BAD_REQUEST",
    });
  }

  // Delete the space from DB
  await db.workspace.delete({
    where: {
      id: spaceId,
      userId,
    },
  });

  return { changeActiveSpace, space };
};

/**
 * Edits a space with the given name for the specified user.
 *
 * @param name - The new name for the space.
 * @param userId - The ID of the user who owns the space.
 * @param spaceId - The ID of the space to be edited.
 * @throws {TRPCError} - If the space is not found.
 */
export const editSpace = async (
  name: string,
  userId: string,
  spaceId: string
) => {
  const existingSpace = await db.workspace.findFirst({
    where: {
      id: spaceId,
      userId: userId,
    },
    include: {
      members: true,
    },
  });

  if (!existingSpace) {
    throw new TRPCError({
      message: "We couldn't find the space you are looking for.",
      code: "NOT_FOUND",
    });
  }

  const isAdmin = existingSpace.members.some(
    (member) =>
      member.userId === userId && member.memberRole === MEMBERROLE.ADMIN
  );

  if (!isAdmin) {
    throw new TRPCError({
      message: "You can't edit space with current permissions.",
      code: "FORBIDDEN",
    });
  }

  await db.workspace.update({
    where: {
      id: spaceId,
      userId: userId,
    },
    data: {
      name,
    },
  });
};

/**
 * Creates a new space for a user.
 *
 * @param userId - The ID of the user creating the space.
 * @param name - The name of the space.
 * @returns An object containing the created space.
 */
export const createSpace = async (
  userId: string,
  WorkspaceName: string,
  organizationId: string,
  firstName?: string,
  lastName?: string,
  jobTitle?: string,
  department?: string,
  organizationName?: string,
  subdomain?: string,
  industry?: string,
  organizationSize?: string,
  // default_space?: boolean
) => {
  console.log("dasdas")
  // return {spa:"jsjs"};
  // update the user
  //QUESTION I CAN DIRECTLY UPDATE THE USER OR I HAVE TI FIND THE USER FIRST ?
  // ONE DB CALL OR TWO DB CALL?
  let onBoardingMode =
    !industry ||
    !department ||
    !organizationName ||
    !firstName ||
    !lastName ||
    !jobTitle ||
    !subdomain ||
    !organizationSize;
  let user;
  if (onBoardingMode) {
    user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });
  } else {
    user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName,
        lastName,
        jobTitle,
        department,
        organizationName,
        subdomain,
        industry,
        organizationSize,
      },
    });
  }

  if (!user)
    throw new TRPCError({
      message: "User not found",
      code: "NOT_FOUND",
    });

  const defaultSpace = await db.workspace.findFirst({
    where: {
      userId,
      defaultSpace: true,
      organizationId,
    },
  });
  const space = await db.workspace.create({
    data: {
      name: WorkspaceName,
      userId,
      defaultSpace: defaultSpace?.id ? false : true,
      organizationId,
    },
  });

  // Create a record to save the active space for this user
  let activeSpaceDetails = await db.activeWorkSpace.findFirst({
    where: {
      userId,
    },
  });

  if (!activeSpaceDetails) {
    activeSpaceDetails = await db.activeWorkSpace.create({
      data: {
        userId,
        activeWorkSpaceId: space.id,
        organizationId,
      },
    });
  }

  await db.activeWorkSpace.update({
    where: {
      id: activeSpaceDetails.id,
    },
    data: {
      activeWorkSpaceId: space.id,
    },
  });

  // Create a member for it (the user who created the space)
  await db.member.create({
    data: {
      workspaceId: space?.id,
      userId,
      email: user.email || "",
      memberRole: MEMBERROLE.ADMIN,
    },
  });
  console.log("space created", space);
  return { space };
};

/**
 * Fetches all spaces for a given user.
 *
 * @param userId - The ID of the user.
 * @returns An object containing the fetched spaces.
 */
export const fetchAllSpaceForUser = async (
  userId: string,
  organizationId: string
) => {
  // const spaces = await db.workspace.findMany({
  //   where: {

  //     organizationId,
  //     members: {
  //       some: {
  //         userId,
  //       },
  //     },
  //   },
  // orderBy: {
  //   createdAt: "asc",
  // },
  //   include: {
  //     members: {
  //       select: {
  //         user: true,
  //       },
  //     },
  //   },
  // });


  const memberInSpaces = await db.member.findMany({
    where: {
      userId,
    },

    include: {
      workspace: {
        include: {
          members: {

            select: {
              user: true,

            },
          },
        },
      },

    },
  });

  const spaces = memberInSpaces.map((member) => member.workspace);
  // console.log("spaces", spaces);
  // const spaceIds = await db.member.findMany({
  //   where: {
  //     userId,
  //   },
  //   select: {
  //     workspaceId: true,
  //   },
  // });

  // console.log("spaceIds", spaceIds);
  return { spaces };
};

export const fetchSpaceDocs = async (spaceId: string) => {
  const documents = await db.workspace.findFirst({
    where: { id: spaceId },
    orderBy: { createdAt: "asc" },
    select: { documents: { where: { role: "OWNER" } } },
  });
  return documents;
};
