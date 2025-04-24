import { Media } from "~/atoms/calendarAtoms";
import { Prisma } from "@prisma/client";


export enum PostStatus {
    Scheduled = "scheduled",
    Posted = "posted",
    Failed = "failed",
    Draft = "draft",
}
export enum Platform {
    YouTube = "youtube",
    Twitter = "twitter",
    Instagram = "instagram",
    Facebook = "facebook",
    LinkedIn = "linkedin",
}

export interface CalendarEvent {
    id: string;
    title: string;
    start?: Date;
    end?: Date;
    description?: string;
    type?: 'meeting' | 'task' | 'reminder';
    platform?: "twitter" | "instagram" | "youtube" | "facebook" | "linkedin"; 
    userId?: string;
    content?: string;
    media?: Media[];
    postType?: string;
    scheduledAt?: Date;
    status?: PostStatus;
    platformSpecific?: Prisma.JsonValue | null;
    createdAt?: Date;
    updatedAt?: Date;
    workspaceId?: string;
    duration?: number;
} 

// export interface Post {
//   id: string;
//   title: string;
//   userId: string;
//   platform: Platform;
//   content: string;
//   media: string[];
//   scheduledAt?: string;
//   status: PostStatus;
//   platformSpecific: Prisma.JsonValue | null;
//   createdAt: Date;
//   updatedAt: Date;
//   workspaceId: string;
//   start?: Date;
//   end?: Date;
//   duration?: number;
// }
