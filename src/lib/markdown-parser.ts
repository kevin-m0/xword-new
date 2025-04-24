interface TiptapNode {
    type: string;
    attrs?: Record<string, any>;
    content?: TiptapNode[];
    marks?: { type: string }[];
    text?: string;
}

interface TiptapDocument {
    type: 'doc';
    content: TiptapNode[];
}

export class MarkdownParser {
    private lines: string[];
    private currentIndex: number = 0;

    constructor(markdown: string) {
        this.lines = markdown.split('\n');
    }

    parse(): TiptapDocument {
        const document: TiptapDocument = {
            type: 'doc',
            content: [],
        };

        while (this.currentIndex < this.lines.length) {
            const line = this.lines[this.currentIndex]?.trim();

            if (line === '') {
                // Handle empty lines as paragraphs
                document.content.push(this.createEmptyParagraph());
                this.currentIndex++;
                continue;
            }

            const node = this.parseLine(line as string);
            if (node) {
                document.content.push(node);
            }

            this.currentIndex++;
        }

        return document;
    }

    private parseLine(line: string): TiptapNode | null {

        // Image match
        const imageMatch = line.match(/^<<<(.+?)>>>$/);
        if (imageMatch) {
            return this.createImageNode(imageMatch[1] as string);
        }

        // Handle headings
        const headingMatch = line.match(/^(#{1,6})\s(.+)$/);
        if (headingMatch) {
            return this.createHeading(headingMatch[2] as string, (headingMatch[1] as string).length);
        }

        // Handle bullet lists
        if (line.match(/^[-*+]\s/)) {
            return this.parseBulletList();
        }

        // Handle numbered lists
        if (line.match(/^\d+\.\s/)) {
            return this.parseOrderedList();
        }

        // Handle code blocks
        if (line.startsWith('```')) {
            return this.parseCodeBlock();
        }

        // Handle blockquotes
        if (line.startsWith('>')) {
            return this.parseBlockquote(line);
        }

        // Default to paragraph
        return this.createParagraph(line);
    }

    private createImageNode(src: string): TiptapNode {
        return {
            type: 'paragraph',
            attrs: {
                textAlign: 'left'
            },
            content: [
                {
                    type: 'image',
                    attrs: {
                        textAlign: 'center',
                        src,
                        alt: `Image ${src}`,
                        title: `Image ${src}`,
                        width: null,
                        height: null,
                    }
                }
            ]
        };
    }
    
    private createHeading(text: string, level: number): TiptapNode {
        const textContent = this.parseInlineStyles(text);
        return {
            type: 'heading',
            attrs: {
                level,
                textAlign: 'left'
            },
            content: textContent
        };
    }

    private createParagraph(text: string): TiptapNode {
        const textContent = this.parseInlineStyles(text);
        return {
            type: 'paragraph',
            attrs: {
                textAlign: 'left'
            },
            content: textContent
        };
    }

    private createEmptyParagraph(): TiptapNode {
        return {
            type: 'paragraph',
            attrs: {
                textAlign: 'left'
            }
        };
    }

    private parseBulletList(): TiptapNode {
        const items: TiptapNode[] = [];

        while (this.currentIndex < this.lines.length) {
            const line = this.lines[this.currentIndex]?.trim();
            if (!line?.match(/^[-*+]\s/)) break;

            const text = line.replace(/^[-*+]\s/, '');
            items.push({
                type: 'listItem',
                content: [{
                    type: 'paragraph',
                    attrs: {
                        indent: 0,
                        textAlign: 'left'
                    },
                    content: this.parseInlineStyles(text)
                }]
            });

            this.currentIndex++;
        }

        this.currentIndex--; // Adjust for the main loop increment
        return {
            type: 'bulletList',
            content: items
        };
    }

    private parseOrderedList(): TiptapNode {
        const items: TiptapNode[] = [];

        while (this.currentIndex < this.lines.length) {
            const line = this.lines[this.currentIndex]?.trim();
            if (!line?.match(/^\d+\.\s/)) break;

            const text = line.replace(/^\d+\.\s/, '');
            items.push({
                type: 'listItem',
                content: [{
                    type: 'paragraph',
                    attrs: {
                        indent: 0,
                        textAlign: 'left'
                    },
                    content: this.parseInlineStyles(text)
                }]
            });

            this.currentIndex++;
        }

        this.currentIndex--; // Adjust for the main loop increment
        return {
            type: 'orderedList',
            content: items
        };
    }

    private parseCodeBlock(): TiptapNode {
        const lines: string[] = [];
        this.currentIndex++; // Skip the opening ```

        while (this.currentIndex < this.lines.length) {
            const line = this.lines[this.currentIndex];
            if (line?.trim() === '```') break;
            lines.push(line as string);
            this.currentIndex++;
        }

        return {
            type: 'codeBlock',
            attrs: {
                language: null,
                textAlign: 'left'
            },
            content: [{
                type: 'text',
                text: lines.join('\n')
            }]
        };
    }

    private parseBlockquote(line: string): TiptapNode {
        const text = line.replace(/^>\s?/, '');
        return {
            type: 'blockquote',
            content: [{
                type: 'paragraph',
                attrs: {
                    textAlign: 'left'
                },
                content: this.parseInlineStyles(text)
            }]
        };
    }

    private parseInlineStyles(text: string): TiptapNode[] {
        const nodes: TiptapNode[] = [];
        let currentText = '';
        let marks: { type: string }[] = [];

        // Helper function to add accumulated text
        const addTextNode = () => {
            if (currentText) {
                nodes.push({
                    type: 'text',
                    text: currentText,
                    ...(marks.length > 0 && { marks: [...marks] })
                });
                currentText = '';
            }
        };

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '*' || text[i] === '_') {
                const isDouble = text[i + 1] === text[i];

                addTextNode();

                if (isDouble) {
                    marks = marks.some(m => m.type === 'bold')
                        ? marks.filter(m => m.type !== 'bold')
                        : [...marks, { type: 'bold' }];
                    i++;
                } else {
                    marks = marks.some(m => m.type === 'italic')
                        ? marks.filter(m => m.type !== 'italic')
                        : [...marks, { type: 'italic' }];
                }
            } else if (text[i] === '`') {
                addTextNode();

                // Find the closing backtick
                const endIndex = text.indexOf('`', i + 1);
                if (endIndex === -1) {
                    currentText += text[i];
                    continue;
                }

                nodes.push({
                    type: 'text',
                    text: text.slice(i + 1, endIndex),
                    marks: [{ type: 'code' }]
                });

                i = endIndex;
            } else {
                currentText += text[i];
            }
        }

        addTextNode();
        return nodes;
    }
}

// Example usage:
// const markdownText = `# Hello World
//   This is a **bold** and *italic* text.
  
//   - List item 1
//   - List item 2
//     - Nested item
  
//   1. Ordered item 1
//   2. Ordered item 2
  
//   > This is a blockquote
  
//   \`\`\`
//   const code = "example";
//   \`\`\``;

// const parser = new MarkdownParser(markdownText);
// const tiptapJson = parser.parse();
// const fs = require('fs');
// fs.writeFileSync('tiptap.json', JSON.stringify(tiptapJson, null, 2));
