import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import LoadingStateComponent from "./LoadingStateComponent";

export default Node.create({
	name: "reactComponent",

	group: "block",

	atom: true,
draggable: true,
	parseHTML() {
		return [
			{
				tag: "react-component",
			},
		];
	},

	renderHTML() {
		return ["react-component"];
	},

	addNodeView() {
		return ReactNodeViewRenderer(LoadingStateComponent);
	},
});
