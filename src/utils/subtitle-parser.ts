//@ts-nocheck

export interface Subtitle {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

export function parseSRT(srtContent: any): Subtitle[] {
  const subtitles: Subtitle[] = [];

  const blocks = srtContent.subs.trim().split("\n\n"); // Split blocks by empty lines
  // Split blocks by empty lines

  blocks.forEach((block: string) => {
    const lines = block.split("\n");
    const id = parseInt(lines[0], 10); // First line is the ID
    const [startTime, endTime] = lines[1].split(" --> "); // Second line is the time range
    const text = lines.slice(2).join(" "); // Join all remaining lines as text

    subtitles.push({
      id,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      text: text.trim(),
    });
  });

  return subtitles;
}
