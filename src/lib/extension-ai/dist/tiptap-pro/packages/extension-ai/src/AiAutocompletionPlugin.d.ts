import { Editor, NodeWithPos } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { DecorationSet } from '@tiptap/pm/view';
import { AiAutocompletionPluginOptions } from './types';
export declare const apiRequest: (editor: Editor, matching: NodeWithPos[], options: AiAutocompletionPluginOptions) => Promise<void>;
export declare const AiAutocompletionPlugin: ({ editor, options, pluginKey, }: {
    editor: Editor;
    options: AiAutocompletionPluginOptions;
    pluginKey?: string | undefined;
}) => Plugin<DecorationSet>;
export default AiAutocompletionPlugin;
