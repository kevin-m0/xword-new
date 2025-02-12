import { db } from "~/server/db";
import { ACCESSTYPE, Document, ROLE } from "@prisma/client";

export const replicateSpaceDoc = async (
  document: Document,
  access: ACCESSTYPE,
  collaboratorId: string,
) => {
  const newDocument = await db.document.create({
    data: {
      title: document.title,
      redirectId: document.redirectId,
      access: access === "WRITE" ? ACCESSTYPE.WRITE : ACCESSTYPE.READ,
      role: ROLE.USER,
      userId: collaboratorId,
      folderId: document.folderId,
      spaceId: document.spaceId,
      thumbnailImageUrl: document.thumbnailImageUrl,
      thumbnailImageId: document.thumbnailImageId,
      createdBy: document.createdBy,
    },
  });
  return newDocument;
};
