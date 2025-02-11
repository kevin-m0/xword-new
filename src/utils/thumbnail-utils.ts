import axios from "axios";
import * as htmlToImage from "html-to-image";
import { absoluteUrl } from "./utils";
export const htmlStringToBlob = async (htmlString: string): Promise<Blob> => {
	// Create a container element to render HTML
	const container = document.createElement("div");
	container.innerHTML = htmlString; // Directly set HTML content
	container.style.maxWidth = `${window.innerWidth}px`;
	container.style.width = "100%";
	container.style.minHeight = "100vh";
	container.style.top = "0";
	container.style.left = "-9999px"; // Move it off-screen
	document.body.appendChild(container);
	container.className = "thumbnail-container";

	// Add scoped styles specifically for this container
	const styleElement = document.createElement("style");
	styleElement.textContent = `
   .thumbnail-container h1 { font-size: 6.5rem; } 
   .thumbnail-container h2 { font-size: 6rem; } 
   .thumbnail-container h3 { font-size: 5.5rem; } 
   .thumbnail-container p { font-size: 5rem; }
 `;
	document.head.appendChild(styleElement); // Append the styles to the document head
	// Use html-to-image to take a "screenshot" of the HTML and returns png blob
	try {
		const blob = await htmlToImage.toBlob(container);
		if (!blob) {
			throw new Error("html to png Blob conversion failed");
		}
		return blob;
	} catch {
		throw new Error("html to png Blob conversion failed");
	} finally {
		document.body.removeChild(container);
		document.head.removeChild(styleElement);
	}
};

export const uploadImageBlob = async (imageBlob: Blob, docId?: string) => {
	try {
		const url = "/api/updateThumbnail";
		const absoluteURL = absoluteUrl(url);
		const formData = new FormData();
		if (!docId || !imageBlob) throw Error("docId or image blob not found");
		formData.append("docId", docId);
		formData.append("file", imageBlob); // filename parameter omitted
		const response = await axios.post(absoluteURL, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		console.error("There was an error!", error);
		return null;
	}
};
