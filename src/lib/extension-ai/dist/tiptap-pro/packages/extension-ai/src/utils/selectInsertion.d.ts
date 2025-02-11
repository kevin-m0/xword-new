import { Dispatch } from '@tiptap/core';
import { Selection, Transaction } from '@tiptap/pm/state';
export declare const selectInsertion: ({ dispatch, tr, oldSelection }: {
    dispatch: Dispatch;
    tr: Transaction;
    oldSelection: Selection;
}) => boolean;
export default selectInsertion;
