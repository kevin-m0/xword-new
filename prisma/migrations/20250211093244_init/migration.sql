-- CreateEnum
CREATE TYPE "ACCESSTYPE" AS ENUM ('READ', 'WRITE');

-- CreateEnum
CREATE TYPE "MEMBERROLE" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('OWNER', 'USER');

-- CreateEnum
CREATE TYPE "Prompt" AS ENUM ('TEXT', 'IMAGE', 'DOCUMENT', 'UNKNOWN', 'AUDIO', 'URL');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'ai');

-- CreateEnum
CREATE TYPE "RecordingType" AS ENUM ('file', 'youtube');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('audio', 'video');

-- CreateEnum
CREATE TYPE "TranscriptStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "FolderType" AS ENUM ('USER_CREATED', 'AI_GENERATED_IMAGE');

-- CreateEnum
CREATE TYPE "GenerationType" AS ENUM ('TEXT_TO_IMAGE', 'REALTIME_IMAGE', 'USER_ADDED');

-- CreateEnum
CREATE TYPE "promptType" AS ENUM ('CONTENT_GEN', 'AUDIO_GEN', 'VIDEO_GEN');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('IMAGE', 'AUDIO', 'VIDEO', 'DOCUMENT', 'URL', 'AI_GENERATED_IMAGE');

-- CreateEnum
CREATE TYPE "SpeedOptions" AS ENUM ('slowest', 'slow', 'normal', 'fast', 'fastest', 'double');

-- CreateEnum
CREATE TYPE "RedirectType" AS ENUM ('General', 'Social');

-- CreateEnum
CREATE TYPE "AudioProjectType" AS ENUM ('Upload', 'YouTube');

-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('PROCESSING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('UPLOAD', 'YOUTUBE');

-- CreateEnum
CREATE TYPE "SocialMediaPlatform" AS ENUM ('twitter', 'linkedin', 'instagram', 'youtube', 'facebook');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('draft', 'scheduled', 'posted', 'failed');

-- CreateTable
CREATE TABLE "ActiveWorkSpace" (
    "id" TEXT NOT NULL,
    "activeWorkSpaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "ActiveWorkSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioScript" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "finalKey" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioScript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioModel" (
    "id" TEXT NOT NULL,
    "audioKey" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "persona" TEXT,
    "personaId" TEXT,
    "emotion" TEXT,
    "speed" "SpeedOptions" NOT NULL DEFAULT 'normal',
    "audioScriptId" TEXT,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" TEXT,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "role" "ROLE" NOT NULL DEFAULT 'OWNER',
    "access" "ACCESSTYPE" NOT NULL DEFAULT 'WRITE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "folderId" TEXT,
    "organizationId" TEXT,
    "spaceId" TEXT,
    "isStarred" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER DEFAULT 0,
    "redirectId" TEXT,
    "thumbnailImageUrl" TEXT,
    "thumbnailImageId" TEXT,
    "content" TEXT,
    "variations" TEXT[],
    "previewType" TEXT,
    "docId" TEXT,
    "redirectType" "RedirectType",
    "isFirstOpen" BOOLEAN NOT NULL DEFAULT true,
    "promptId" TEXT,
    "assetFolderId" TEXT,
    "createdBy" TEXT NOT NULL,
    "images" TEXT[],

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "folderName" TEXT NOT NULL,
    "spaceId" TEXT,
    "emojiUrl" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditorBrandVoice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "tone" TEXT[],
    "emotions" TEXT[],
    "character" TEXT[],
    "genre" TEXT[],
    "languageStyle" TEXT[],
    "brandVoice" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditorBrandVoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageData" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "resolution" TEXT,
    "imageKey" TEXT NOT NULL,
    "imageUrl" TEXT,
    "generationType" "GenerationType" NOT NULL,
    "userId" TEXT,
    "workspaceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "memberRole" "MEMBERROLE" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "defaultSpace" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT,
    "lastName" TEXT,
    "jobTitle" TEXT,
    "department" TEXT,
    "organizationName" TEXT,
    "subdomain" TEXT,
    "industry" TEXT,
    "organizationSize" TEXT,
    "isFirstTimeUser" BOOLEAN NOT NULL DEFAULT true,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "stripe_current_period_end" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVoice" (
    "id" TEXT NOT NULL,
    "voiceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audioFileKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserVoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SonicMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,
    "brandVoice" JSONB,
    "lastMessages" TEXT[],
    "mode" TEXT,
    "fileIds" JSONB[],
    "category" TEXT,
    "publishDate" TEXT,
    "includeDomains" TEXT[],
    "Urls" TEXT[],
    "otherFiles" JSONB,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "sources" TEXT,

    CONSTRAINT "SonicMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SonicChat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lastPromptPayload" TEXT,

    CONSTRAINT "SonicChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioProjectChat" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audioProjectId" TEXT,

    CONSTRAINT "AudioProjectChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "subtitles" TEXT NOT NULL,
    "words" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "processStatus" "ProcessStatus" NOT NULL,
    "storageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "type" "AudioProjectType" NOT NULL,

    CONSTRAINT "AudioProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assets" (
    "id" TEXT NOT NULL,
    "assetKey" TEXT NOT NULL,
    "assetName" TEXT,
    "assetUrl" TEXT,
    "assetType" "AssetType" NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "folderId" TEXT NOT NULL,
    "prompt" TEXT,
    "generationType" "GenerationType",

    CONSTRAINT "Assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetsFolder" (
    "id" TEXT NOT NULL,
    "folderName" TEXT NOT NULL,
    "spaceId" TEXT,
    "emojiUrl" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "folderType" "FolderType" NOT NULL DEFAULT 'USER_CREATED',

    CONSTRAINT "AssetsFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoModel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ytChapters" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "subtitles" TEXT NOT NULL,
    "words" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "processStatus" "ProcessStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "videoType" "VideoType" NOT NULL,
    "projectState" TEXT,
    "thumbnailUrl" TEXT,
    "path" TEXT,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "VideoModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViralClips" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "parentVideoId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "subtitles" TEXT NOT NULL,
    "words" TEXT,
    "processStatus" "ProcessStatus" NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "ViralClips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiptapDoc" (
    "id" TEXT NOT NULL,
    "docId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TiptapDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "SocialMediaPlatform" NOT NULL,
    "postType" TEXT,
    "content" TEXT NOT NULL,
    "media" JSONB NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "PostStatus" NOT NULL,
    "platformSpecific" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExportedVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "ExportedVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveWorkSpace_id_key" ON "ActiveWorkSpace"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveWorkSpace_userId_key" ON "ActiveWorkSpace"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripe_customer_id_key" ON "User"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripe_subscription_id_key" ON "User"("stripe_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "Assets_assetKey_key" ON "Assets"("assetKey");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "Post"("userId");

-- CreateIndex
CREATE INDEX "Post_platform_status_idx" ON "Post"("platform", "status");

-- AddForeignKey
ALTER TABLE "ActiveWorkSpace" ADD CONSTRAINT "ActiveWorkSpace_activeWorkSpaceId_fkey" FOREIGN KEY ("activeWorkSpaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveWorkSpace" ADD CONSTRAINT "ActiveWorkSpace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioScript" ADD CONSTRAINT "AudioScript_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioModel" ADD CONSTRAINT "AudioModel_audioScriptId_fkey" FOREIGN KEY ("audioScriptId") REFERENCES "AudioScript"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioModel" ADD CONSTRAINT "AudioModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_assetFolderId_fkey" FOREIGN KEY ("assetFolderId") REFERENCES "AssetsFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditorBrandVoice" ADD CONSTRAINT "EditorBrandVoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageData" ADD CONSTRAINT "ImageData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVoice" ADD CONSTRAINT "UserVoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonicMessage" ADD CONSTRAINT "SonicMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SonicChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SonicChat" ADD CONSTRAINT "SonicChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioProjectChat" ADD CONSTRAINT "AudioProjectChat_audioProjectId_fkey" FOREIGN KEY ("audioProjectId") REFERENCES "AudioProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioProject" ADD CONSTRAINT "AudioProject_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioProject" ADD CONSTRAINT "AudioProject_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "AssetsFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetsFolder" ADD CONSTRAINT "AssetsFolder_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetsFolder" ADD CONSTRAINT "AssetsFolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoModel" ADD CONSTRAINT "VideoModel_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoModel" ADD CONSTRAINT "VideoModel_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViralClips" ADD CONSTRAINT "ViralClips_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViralClips" ADD CONSTRAINT "ViralClips_parentVideoId_fkey" FOREIGN KEY ("parentVideoId") REFERENCES "VideoModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiptapDoc" ADD CONSTRAINT "TiptapDoc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiptapDoc" ADD CONSTRAINT "TiptapDoc_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
