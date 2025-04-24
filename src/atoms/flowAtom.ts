// atoms/flowState.ts
import { atom } from 'jotai';
// import { FlowType } from '../_lib/new-flow-templates';


// interface FlowState {
//     selectedTemplate: string | null;
//     type: FlowType | null;
//     steps: string[];
//     currentStep: number;
// }

// // Atom for flow state
// export const flowState = atom<FlowState>({
//     selectedTemplate: null,
//     type: null,
//     steps: [],
//     currentStep: 0,
// });

export enum FlowType {
    "General",
    'Social'
}
export const flowSteps = atom<Number>(0)
export const flowPromptId = atom<string | null>(null)
export const flowType = atom<FlowType>(FlowType.General)
export const socialFlowId = atom<string | null>(null)
export const flowImages = atom<string[]>([])
export const flowVariations = atom<string[]>([])
export const flowPrevType = atom<string | null>(null)