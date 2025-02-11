// "use client";
// import {
// 	Font,
// 	Document as PDFDocument,
// 	Page,
// 	StyleSheet,
// 	Text,
// 	View,
// 	Image as PDFImage,
// 	Svg,
// 	Line,
// } from "@react-pdf/renderer";
// import Html from "react-pdf-html";
// import { HtmlElement } from "react-pdf-html/dist/parse";
// import { Tag } from "react-pdf-html/dist/tags";
// import { Style } from "@react-pdf/types";

// Font.register({
// 	family: 'Inter',
// 	fonts: [
// 		{
// 			src: 'http://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
// 		},
// 		{
// 			src: 'http://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
// 			fontWeight: 'bold',
// 		},
// 		{
// 			src: 'http://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
// 			fontWeight: 'normal',
// 			fontStyle: 'italic',
// 		},
// 	],
// });

// export declare type HtmlStyle =
// 	| (Style & {
// 		listStyle?: string;
// 		listStyleType?: string;
// 		borderSpacing?: number | string;
// 		borderCollapse?: string;
// 	})
// 	| any;
// export declare type HtmlStyles = Record<Tag | string, HtmlStyle>;

// export declare type HtmlRenderer = React.FC<
// 	React.PropsWithChildren<{
// 		element: HtmlElement;
// 		style: Style[];
// 		stylesheets: HtmlStyles[];
// 	}>
// >;
// type Tags = Tag | "mark" | "figure";

// export declare type HtmlRenderers = Record<Tags | string, HtmlRenderer>;

// Font.register({
// 	family: "Roboto Mono",
// 	fonts: [
// 		{
// 			src: "http://fonts.gstatic.com/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vqPQ--5Ip2sSQ.ttf",
// 		},
// 	],
// });

// // Font.register({ family: 'Inter', src: "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap" });

// // Font.register({
// // 	family: "Inter",
// // 	fonts: [
// // 		{
// // 			src: 'http://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
// // 			fontWeight: 400,
// // 		},
// // 		{
// // 			src: "http://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
// // 			fontWeight: 300,
// // 		},
// // 		{
// // 			src: "http://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
// // 			fontWeight: 500,
// // 		},
// // 		{
// // 			src: "http://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
// // 			fontWeight: 600,
// // 		},
// // 		{
// // 			src: "http://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
// // 			fontWeight: 700,
// // 		},
// // 	],
// // });

// Font.register({
// 	family: 'Open Sans',
// 	fonts: [
// 		{ src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
// 		{ src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
// 	]
// });

// const pdfStyles = StyleSheet.create({
// 	page: {
// 		paddingVertical: 30,
// 		paddingHorizontal: 60,
// 		fontFamily: "Inter",
// 		fontWeight: 300,
// 	},
// 	h1: {
// 		fontSize: "24px",
// 		fontWeight: "bold",
// 		marginBottom: 10,
// 		fontFamily: "Inter",
// 	},
// 	h2: {
// 		fontSize: "20px",
// 		fontWeight: "bold",
// 		marginBottom: 10,
// 		fontFamily: "Inter",
// 	},
// 	h3: {
// 		fontSize: "18px",
// 		fontWeight: "bold",
// 		marginBottom: 10,
// 		fontFamily: "Inter",
// 	},
// 	p: {
// 		fontSize: "12px",
// 		// marginBottom: 10,
// 		fontFamily: "Inter",
// 		// lineHeight: 1.5,
// 		textAlign: "justify",
// 		textJustify: "inter-word",
// 	},
// 	img: {
// 		borderRadius: 6,
// 		// marginVertical: 10,
// 		width: 300,

// 	},
// 	table: {
// 		width: "100%",
// 		borderWidth: 2,
// 		display: "flex",
// 		flexDirection: "column",
// 		marginVertical: 12,
// 	},
// 	tableRow: {
// 		display: "flex",
// 		flexDirection: "row",
// 	},
// 	cell: {
// 		borderWidth: 1,
// 		display: "flex",
// 		justifyContent: "center",
// 		alignContent: "center",
// 		textAlign: "center",
// 		flexWrap: "wrap",
// 	},
// 	code: {
// 		fontSize: "8px",
// 		marginBottom: 7,
// 		fontFamily: "Inter",
// 		lineHeight: 1.5,
// 		textAlign: "justify",
// 		textJustify: "inter-word",
// 	},
// });

// Font.registerEmojiSource({
// 	format: "png",
// 	url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/",
// });

// const customRenders: HtmlRenderers = {
// 	code: ({ children }) => {
// 		return <Text style={pdfStyles.code}>{children}</Text>;
// 	},
// 	h1: ({ children }) => {
// 		return <Text style={pdfStyles.h1}>{children}</Text>;
// 	},
// 	h2: ({ children }) => {
// 		return <Text style={pdfStyles.h2}>{children}</Text>;
// 	},
// 	h3: ({ children }) => {
// 		return <Text style={pdfStyles.h3}>{children}</Text>;
// 	},
// 	p: ({ children }) => {
// 		return <Text style={pdfStyles.p}>{children}</Text>;
// 	},
// 	pre: ({ children }) => {
// 		return <Text>{children}</Text>;
// 	},
// 	b: ({ children }) => {
// 		return <Text style={{ fontWeight: "bold" }}>{children}</Text>;
// 	},
// 	i: ({ children }) => {
// 		return <Text style={{ fontStyle: "italic" }}>{children}</Text>;
// 	},
// 	ul: ({ children }) => {
// 		return <View style={{ marginBottom: 10 }}>{children}</View>;
// 	},
// 	ol: ({ children }) => {
// 		return <View style={{ marginBottom: 10 }}>{children}</View>;
// 	},
// 	li: ({ children }) => {
// 		return <Text style={{ fontSize: 10 }}>{children}</Text>; // Decrease font size
// 	},
// 	img: ({ element }) => {

// 		return (
// 			<PDFImage
// 				style={pdfStyles.img}
// 				// src={element.attributes.src}
// 				src={{ uri: element.attributes.src, method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }}
// 			// src={{ uri: "/test-jpg.jpg", method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }}

// 			/>
// 		);
// 	},
// 	table: ({ children }) => {
// 		return (
// 			<View
// 				style={{
// 					marginVertical: 10,
// 				}}
// 			>
// 				{children}
// 			</View>
// 		);
// 	},
// 	figure: ({ children }) => {
// 		return <>{children}</>;
// 	},
// 	hr: () => {
// 		return (
// 			<Svg
// 				height="10"
// 				width="495"
// 			>
// 				<Line
// 					x1="0"
// 					y1="5"
// 					x2="793"
// 					y2="5"
// 					strokeWidth={2}
// 					stroke="#DAE6F1"
// 				/>
// 			</Svg>
// 		);
// 	},
// 	div: ({ element, children }) => {
// 		let styles = StyleSheet.create({
// 			card: {},
// 		});

// 		if (element.id === "card") {
// 			styles = StyleSheet.create({
// 				card: {
// 					fontSize: 12,
// 					backgroundColor: "#e5e5e5",
// 					padding: 10,
// 					borderRadius: 3.75,
// 					borderWidth: 1,
// 					borderColor: "#c9c9c9",
// 					maxWidth: "100%",
// 				},
// 			});
// 		}
// 		return <View style={styles.card}>{children}</View>;
// 	},
// };

// const PDF = ({ title, HTML }: { title: string; HTML: string }) => {
// 	function removePreTags(inputString: string) {
// 		// Use regular expressions to replace <pre> and </pre> tags with an empty string
// 		return inputString.replace(/<pre>/g, "").replace(/<\/pre>/g, "");
// 	}
// 	return (
// 		<PDFDocument title={title}
// 		>
// 			<Page
// 				size="A4"
// 				style={pdfStyles.page}

// 			>
// 				<Html
// 					style={pdfStyles.page}
// 					renderers={customRenders}

// 				>
// 					{removePreTags(HTML)}
// 				</Html>
// 			</Page>
// 		</PDFDocument>
// 	);
// };

// export default PDF;
