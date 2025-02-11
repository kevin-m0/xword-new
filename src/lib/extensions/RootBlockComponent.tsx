import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { GripVertical, Plus } from "lucide-react";

// Define the RootBlockComponent, which will serve as a custom Node View in the Tiptap editor
const RootBlockComponent: React.FC<NodeViewProps> = ({
	node,
	getPos,
	editor,
}) => {
	// Function to create a new node immediately after the current node
	const createNodeAfter = () => {
		// Calculate the position right after the current node
		const pos = getPos() + node.nodeSize;

		// Use the editor's command to insert a new "rootblock" node at the calculated position
		editor
			.chain()
			.insertContentAt(pos, {
				type: "rootblock",
				content: [
					{
						type: "paragraph",
					},
				],
			})
			.focus(pos + 3) // Focus on the new block (you might need to adjust the position based on your exact requirements)
			.run();
	};



	// Render the custom node view
	return (
		<NodeViewWrapper
			as="div"
			className="group relative  flex  gap-2"
			
		>
			<div className="relative mx-auto  text-editor-width" >
				{/* Container for buttons that appear on hover */}
				<div
					className="absolute -left-12 top-1 flex w-12 gap-1 opacity-0 group-hover:opacity-100"
					aria-label="left-menu"
				>
					{/* Button to add a new node after the current node */}
					<button
						type="button"
						onClick={createNodeAfter}
						className=""
					>
						<Plus className="h-5 w-5 text-gray-400" />
					</button>
					{/* Draggable handle button to allow rearranging nodes */}
					<button
						draggable={true}
						data-drag-handle
						className="cursor-grab"
						
					>
						<GripVertical className="h-5 w-5 text-gray-400" />
					</button>
				</div>
				{/* Area where the node's actual content will be rendered */}
				<NodeViewContent className="w-full" />
			</div>
		</NodeViewWrapper>
	);
};

export default RootBlockComponent;
