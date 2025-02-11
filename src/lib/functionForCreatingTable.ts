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

export function findHead(htmlString: string) {
	const matches = htmlString.match(/<th>(.*?)<\/th>/g);
	if (!matches) return [];
	return matches.map((match) => match.replace(/<\/?th>/g, ""));
}

export function findBody(htmlString: string) {
	const matches = htmlString.match(/<tbody>([\s\S]*?)<\/tbody>/);
	if (!matches) return [];

	const rows = matches[1]?.match(/<tr>[\s\S]*?<\/tr>/g);
	return rows ? rows.map((row) => row.trim()) : [];
}

export function findingTableCellData(htmlString: string) {
	const matches = htmlString.match(/<td>(.*?)<\/td>/g);
	if (!matches) return [];
	return matches.map((match) => match.replace(/<\/?td>/g, ""));
}

export function extractTableBodyData(htmlArray: any[]) {
	return htmlArray.map((row) => findingTableCellData(row));
}

export function createTableHeadings(headings: any[]) {
	const cells = headings.map((heading) => {
		return new TableCell({
			width: { size: 100 / headings.length, type: WidthType.PERCENTAGE },
			children: [
				new Paragraph({
					text: heading,
					alignment: AlignmentType.CENTER,
				}),
			],
			verticalAlign: "center",
		});
	});

	return [
		new TableRow({
			children: cells,
		}),
	];
}

export function createTableBody(data: string[][]) {
	return data.map((row) => {
		const cells = row.map((cell) => {
			return new TableCell({
				children: [
					new Paragraph({
						text: cell.trim(),
						heading: HeadingLevel.HEADING_1,
						alignment: AlignmentType.CENTER,
					}),
				],
			});
		});

		return new TableRow({
			children: cells,
		});
	});
}
