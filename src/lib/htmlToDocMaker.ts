import {
	Document,
	TableRow,
	VerticalAlign,
	HeadingLevel,
	ImageRun,
	Table,
	TableCell,
	Paragraph,
	AlignmentType,
	TextRun,
	Styles,
	WidthType,
} from "docx";
import {
	createTableBody,
	createTableHeadings,
	extractTableBodyData,
	findBody,
	findHead,
} from "./functionForCreatingTable";
import {
	removeLi_tag,
	findListElements,
	findListType,
} from "./functionsForListData";

export const htmlToDocMaker = async (htmlData: string, pageTitle: string) => {
	let globalArray: any[] = [];
	//**********************get the text editor data****************************
	// array that will contains all the elements
	let htmlElements = extractElements(htmlData);
	//***************************************************************
	//   This function will make a object array that
	//   will contain the text of the element and additional information
	function parseElement(element: any) {
		//logic for H1 /H2 /H3 /, P / AND IMAGE
		if (isAllowedTag_hTag_P_tag(element)) {
			let elementDataObject = elementInfoObject(element);
			globalArray.push(elementDataObject);
		}
		//LOGIC FOR OL / UL LIST
		else if (isAllowedTag_ul_ol(element)) {
			//Logic for list list
			let list_type = findListType(element);
			let listElements = findListElements(element);
			listElements.map((item, i) => {
				let item_withRawTag = removeLi_tag(item);
				// making the object
				let elementDataObject = elementInfoObject_ForListElements(
					item_withRawTag,
					list_type as string,
					i
				);
				globalArray.push(elementDataObject);
			});
		}
		//LOGIC FOR TABLE
		else if (isAllowedTag_table(element)) {
			//Logic for Table
			//   console.log("table ==", element); //***** */
			let elementName = element.match(/<([^\s>]+)/)[1];
			//   console.log(elementName);/

			let tableHeadingsArray = findHead(element);
			//   console.log(tableHeadingsArray); //******** */

			let tableBody = findBody(element);
			//   console.log(tableBody);
			let tableBodyData = extractTableBodyData(tableBody);
			//   console.log(tableBodyData); //***** */

			globalArray.push({
				element: elementName,
				tableHead: tableHeadingsArray,
				tableBody: tableBodyData,
			});
		}
		//code for CODE  TYPE FRONT
		else if (isAllowedTag_Pre_code(element)) {
			//remove the p tag if have
			element = element.replace(/<pre>(.*?)<\/pre>/g, "$1");
			const elementDataObject = elementInfoObject(element);
			globalArray.push(elementDataObject);
		}
	}
	htmlElements.map((item, i) => {
		parseElement(item);
	});
	//*********************************************************************************************************************** */

	// make the object ready for the docx
	//   THIS IS THE OBJECT AS DOCX DOWNLODE
	function mapToParagraphs(input: any[]) {
		const output = input.map((itemData, index) => {
			const {
				element,
				text,
				bold,
				italic,
				underline,
				strike,
				highlight,
				superScript,
				subscript,
				color,
				textAlign,
			} = itemData;
			// TEXT ALIGMENT
			let alignment;

			// Set alignment based on textAlign value
			switch (textAlign) {
				case "justify":
					alignment = AlignmentType.JUSTIFIED;
					break;
				case "center":
					alignment = AlignmentType.CENTER;
					break;
				case "right":
					alignment = AlignmentType.RIGHT;
					break;
				default:
					alignment = AlignmentType.LEFT;
			}

			//HEADDING
			let heading;
			let fontSize;

			switch (element) {
				case "h1":
					heading = HeadingLevel.HEADING_1;
					fontSize = 50;
					break;
				case "h2":
					heading = HeadingLevel.HEADING_2;
					fontSize = 45;
					break;
				case "h3":
					heading = HeadingLevel.HEADING_3;
					fontSize = 40;
					break;
				case "p":
					heading = HeadingLevel.HEADING_4;
					fontSize = 35;
					break;
				case "code":
					heading = HeadingLevel.HEADING_4;
					fontSize = 30;
					break;
				case "table":
					heading = HeadingLevel.HEADING_4;
					fontSize = 30;

					//NOW WORKING HERE
					//make the table headding
					const tableHeadings = createTableHeadings(itemData.tableHead);
					// make the table body
					const tableBody = createTableBody(itemData.tableBody);
					return new Paragraph({
						children: [
							new Table({
								rows: [...tableHeadings, ...tableBody],
							}),
						],
					});
				case "image":
					// Handling for image element
					return new Paragraph({
						children: [
							new ImageRun({
								data: Uint8Array.from(atob(text), (c) => c.charCodeAt(0)),
								transformation: {
									width: 200,
									height: 100,
								},
								type: "png",
							}),
						],
					});

				default:
					heading = HeadingLevel.HEADING_4;
					fontSize = 35;
			}
			return new Paragraph({
				heading: heading,
				alignment: alignment,
				children: [
					new TextRun({
						text: text,
						bold: bold,
						italics: italic,
						underline: underline,
						strike: strike,
						highlight: highlight,
						subScript: subscript,
						superScript: superScript,
						color: `${highlight ? "#ffffff" : color}`,
						size: fontSize,
					}),
				],
			});
		});
		return output;
	}
	// *******************************making the docx object **************************
	const docxObject = mapToParagraphs(globalArray);
	//make the object to docx download

	let doc = new Document({
		sections: [
			{
				children: [
					new Paragraph({
						alignment: AlignmentType.CENTER,
						heading: HeadingLevel.TITLE,
						children: [new TextRun(pageTitle)],
					}),
					new Paragraph({ text: "", heading: HeadingLevel.TITLE }),
					...docxObject,
				],
			},
		],
	});
	return doc;
};

//function for make find the elements form the string and put the element in the array.
//THIS FUNCTION WILL MAKE A ARRAY OF ALL THE HTML ELEMENTS

function extractElements(htmlString: string) {
	const pattern = /<(h1|h2|h3|p|ul|ol|table|pre)[^>]*>[\s\S]*?<\/\1>/gi;
	const matches = htmlString.match(pattern) || [];
	return matches;
}

//*********************************************************************** */
function isAllowedTag_hTag_P_tag(htmlString: string) {
	const regex = /^<(h1|h2|h3|p)\b[^>]*>/i;
	return regex.test(htmlString);
}

//FUNCTION FOR THE STRING START WITH  ul and ol  TAG OR NOT
function isAllowedTag_ul_ol(htmlString: string) {
	const regex = /^<(ul|ol)\b[^>]*>.*<\/\1>$/i;
	return regex.test(htmlString);
}

//FUNCTION FOR THE STRING START WITH  table TAG OR NOT
function isAllowedTag_table(htmlString: string) {
	const regex = /^<table\b[^>]*>[\s\S]*?<\/table>$/i;
	return regex.test(htmlString);
}
function isAllowedTag_Pre_code(htmlString: string) {
	const regex = /^<pre\b[^>]*>[\s\S]*?<\/pre>$/i;
	return regex.test(htmlString);
}
//********************************************************************* */
function getTheTagName(htmlString: string) {
	const match = htmlString.match(/<([a-zA-Z][^\s>]*)/);
	return match ? match[1] : "";
}

function findTextAlignment(htmlString: string) {
	const match = htmlString.match(/text-align:\s*(\w+)/);
	return match ? match[1] : "left";
}
function findStrongTag(htmlString: string) {
	return /<strong\b[^>]*>.*<\/strong>/i.test(htmlString);
}
function findEmTag_ItalicFont(htmlString: string) {
	return /<em\b[^>]*>.*<\/em>/i.test(htmlString);
}
function find_U_Tag_underlineFont(htmlString: string) {
	return /<u\b[^>]*>.*<\/u>/i.test(htmlString);
}
function find_S_Tag_strikeFont(htmlString: string) {
	return /<s\b[^>]*>.*<\/s>/i.test(htmlString);
}
function find_sup_Tag_superScriptFont(htmlString: string) {
	return /<sup\b[^>]*>.*<\/sup>/i.test(htmlString);
}
function find_sub_Tag_subscriptFont(htmlString: string) {
	return /<sub\b[^>]*>.*<\/sub>/i.test(htmlString);
}
function find_mark_Tag_highLightFont(htmlString: string) {
	return /<mark\b[^>]*>.*<\/mark>/i.test(htmlString);
}

function find_spanTaG_with_textColor(htmlString: string) {
	const match = htmlString.match(
		/<span[^>]*style="[^"]*color:\s*([^";]+)[^"]*"[^>]*>(.*?)<\/span>/i
	);
	if (match) {
		const color = match[1];
		const text = match[2];
		return `<span style="color: ${color}">${text}</span>`;
	} else {
		// If no span tag with color is found, return the text string
		return htmlString.replace(/<[^>]+>/g, "");
	}
}

function findColor(htmlString: string) {
	const match = htmlString.match(/color:\s*#?([0-9a-fA-F]{3,6})/i);
	if (match) {
		return `#${match[1]}`;
	} else {
		return "#161313";
	}
}

function remove_u_span_Tag(htmlString: string) {
	// Remove <u> tags
	htmlString = htmlString.replace(/<u\b[^>]*>/gi, "");
	htmlString = htmlString.replace(/<\/u>/gi, "");

	// Remove <span> tags
	htmlString = htmlString.replace(/<span\b[^>]*>/gi, "");
	htmlString = htmlString.replace(/<\/span>/gi, "");

	return htmlString;
}
function isImagePresent(htmlString: string) {
	return /<img\b[^>]*>/i.test(htmlString);
}
function extractBase64String(input: any) {
	const match = /<img\s+src="data:image\/\w+;base64,([^"]+)"/i.exec(input);
	if (match) {
		return match[1];
	}
	return input;
}

// FUNCTION FOR THE LIST DATA

function elementInfoObject(element: string) {
	let elementObject = {
		element: "", //
		text: "",
		textAlign: "center", //
		color: "#161313",
		bold: false, //
		italic: false, //
		underline: false, //
		strike: false, //
		superScript: true, // or  subscript
		subscript: false, //
		highlight: false, //
		//or
		codeBlock: false,
		// fontWidth: "",
	};

	if (isImagePresent(element)) {
		elementObject.element = "image";
		elementObject.text = extractBase64String(element);
	} else {
		elementObject.element = getTheTagName(element) as string;
		elementObject.textAlign = findTextAlignment(element) as string;
		elementObject.bold = findStrongTag(element);
		elementObject.italic = findEmTag_ItalicFont(element);
		elementObject.underline = find_U_Tag_underlineFont(element);
		elementObject.strike = find_S_Tag_strikeFont(element);
		elementObject.subscript = find_sup_Tag_superScriptFont(element);
		elementObject.subscript = find_sup_Tag_superScriptFont(element);
		elementObject.highlight = find_mark_Tag_highLightFont(element);
		// remove other tags and to find the color and text to find the color and text
		let spanElementWith_color = find_spanTaG_with_textColor(element);
		// find the text color and text content
		elementObject.color = findColor(spanElementWith_color);
		elementObject.text = remove_u_span_Tag(spanElementWith_color);
	}
	return elementObject;
}
function elementInfoObject_ForListElements(
	element: string,
	listType: string,
	i: number
) {
	let elementObject = {
		element: "", //
		text: "",
		textAlign: "center", //
		color: "#FCC419",
		bold: false, //
		italic: false, //
		underline: false, //
		strike: false, //
		superScript: true, // or  subscript
		subscript: false, //
		highlight: false, //
		//or
		codeBlock: false,
		// fontWidth: "",
	};
	elementObject.element = getTheTagName(element) as string;
	elementObject.textAlign = findTextAlignment(element) as string;
	elementObject.bold = findStrongTag(element);
	elementObject.italic = findEmTag_ItalicFont(element);
	elementObject.underline = find_U_Tag_underlineFont(element);
	elementObject.strike = find_S_Tag_strikeFont(element);
	elementObject.subscript = find_sup_Tag_superScriptFont(element);
	elementObject.subscript = find_sup_Tag_superScriptFont(element);
	elementObject.highlight = find_mark_Tag_highLightFont(element);
	// remove other tags and to find the color and text to find the color and text
	let spanElementWith_color = find_spanTaG_with_textColor(element);
	// find the text color and text content
	//   if ((listType = "ul")) {
	//     console.log(spanElementWith_color);
	//     console.log(remove_u_span_Tag(spanElementWith_color));
	//   }
	elementObject.color = findColor(spanElementWith_color);
	elementObject.text =
		(listType === "ul" ? "* " : `${i + 1}. `) +
		remove_u_span_Tag(spanElementWith_color);
	//   console.log(elementObject);
	return elementObject;
}
