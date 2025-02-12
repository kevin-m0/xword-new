import { z } from "zod";
import { workspaceNameSchema } from "../_validations/workspace";

export type WorkspaceNameFormData = z.infer<typeof workspaceNameSchema>;

export interface UseWorkspaceNameForm {
    form: any; // Will be replaced with actual form type
    isLoading: boolean;
    onSubmit: (data: WorkspaceNameFormData) => Promise<void>;
}

export interface WorkspaceNameFormProps {
    defaultWorkspaceName: string;
    onNameChange?: (name: string) => Promise<void>;
}