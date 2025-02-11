import { CommandProps } from '@tiptap/core';
import { TextAction, TextOptions } from '../types';
export declare const runAiTextCommand: (props: CommandProps, action: TextAction, textOptions: TextOptions) => false | Promise<boolean>;
