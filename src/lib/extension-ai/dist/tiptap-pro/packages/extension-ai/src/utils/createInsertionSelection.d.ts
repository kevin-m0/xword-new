import { Selection, TextSelection, Transaction } from '@tiptap/pm/state';
export declare const createInsertionSelection: (tr: Transaction, selection: Selection, oldSelection: Selection) => TextSelection;
export default createInsertionSelection;
