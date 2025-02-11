import { MODEL_TYPE } from "@/atoms";
import { Document, Folder, Workspace, User } from "@prisma/client";

export type ExtendedFolder = Folder & {
  Documents: Document[];
};

export type ExtendedSpace = Workspace & {
  members: { user: User }[];
};

export type View = "grid" | "list";

export interface ViewContextType {
  view: View;
  selectGridView: () => void;
  selectListView: () => void;
}

export type MessageRole = "user" | "ai";

export type Messages = {
  id: string;
  role: MessageRole;
  content: string;
  created: string;
  userId?: string;
  // sessionId: string;
  brandVoice?: string;
};

export type DocumentSidebarTabs = "search" | "documents";

export type VoiceModels = {
  id: string;
  name: string;
  gender: string;
  isCloned: boolean;
  language: string;
  languageCode: string;
  sampleUrl: string;
  styles: string[];
  voiceEngine: string;
};

export type KeywordIdea = {
  text: string;
  avg_monthly_searches: number;
  difficulty: number;
};

export type TsearchResults = { title: string; link: string };

export type TPlannerRequest = {
  keywordsSelected: string;
  ideaSelected: string;
  outlineSelected: string;
  tone: string;
  pov:
    | "First Person Singular (I, Me, My)"
    | "First Person Plural (We, Us, Our)"
    | "Second Person (You, Your, Yours)"
    | "Third Person (He, She, They)";
  call: string;
  plannerStage: string;
  topic: string;
  model: MODEL_TYPE;
};

export type Prompt = {
  promptId: string;
  promptTitle: string;
  promptDescription: string;
  inputdata: string[];
  inputparams: string[];
  categoryName: string;
  subCategoryName: string;
  categoryId: string;
};

export type CategoryWithPrompts = {
  category: string;
  prompts: Prompt[];
};

//storyboard
export type StoryboardStyle = "realistic" | "cartoon" | "anime" | "watercolor";

export interface ScriptResponse {
  script: string;
  success: boolean;
  error?: string;
}

export interface StoryboardResponse {
  frames: StoryboardFrame[]; // Array of processed frames
  success: boolean;
  error?: string;
}
export interface StoryboardApiResponse {
  storyboard: StoryboardFrames[]; // Array of frames from API
  success: boolean;
  error?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ImageGenerationResponse {
  file: string;
}

export interface AudioGenerationResponse {
  file: string;
}

// Input frame from API
export interface StoryboardFrames {
  frameNumber: string;
  scriptPart: string;
  imagePrompt: string;
}

// Output frame after processing
export interface StoryboardFrame {
  imageUrl: string;
  subtitle: string;
  audioUrl: string;
  timestamp: number;
}

export type Tag = 'html' | 'body' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'blockquote' | 'article' | 'caption' | 'form' | 'hr' | 'br' | 'address' | 'aside' | 'pre' | 'span' | 'button' | 'label' | 'b' | 'strong' | 'q' | 'i' | 'em' | 'u' | 's' | 'cite' | 'dfn' | 'code' | 'abbr' | 'sup' | 'sub' | 'a' | 'img' | 'ul' | 'ol' | 'li' | 'dd' | 'dl' | 'dt' | 'fieldset' | 'header' | 'footer' | 'section' | 'table' | 'tr' | 'td' | 'th' | 'thead' | 'tbody' | 'svg' | 'line' | 'path' | 'polyline' | 'polygon' | 'path' | 'rect' | 'circle' | 'ellipse' | 'text' | 'tspan' | 'g' | 'stop' | 'defs' | 'clipPath' | 'linearGradient' | 'radialGradient';