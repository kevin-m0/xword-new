interface FormField {
    type: "text" | "file" | "multiple" | "single" | "textarea" | "boolean" | "url";
    label: string;
    options?: string[];
  }
  
  export const parseInputParam = (param: string): FormField => {
    const [label, type] = param.split(":");
  
    if (!label || !type) {
      throw new Error(`Invalid param format: ${param}`);
    }
  
    if (type === "Audio") {
      return { label, type: "file", options: ["audio/*"] };
    }
    if (type === "Video") {
      return { label, type: "file", options: ["video/*"] };
    }
    if (type.startsWith("[") || label === "tones") {
      const options = type
        .slice(1, -1) // Remove surrounding brackets
        .split(",")
        .map((option) => option.trim().replace(/^['"]|['"]$/g, "")); // Remove quotes
      return { label, type: "multiple", options };
    }
    if (type.startsWith("(")) {
      const options = type
        .slice(1, -1) // Remove surrounding parentheses
        .split(",")
        .map((option) => option.trim().replace(/^['"]|['"]$/g, "")); // Remove quotes
      return { label, type: "single", options };
    }
    if (type === "textarea") {
      return { label, type: "textarea" };
    }
    if (type === "boolean") {
      return { label, type: "boolean" };
    }
    if (type === "URL") {
      return { label, type: "url" };
    }
    return { label, type: "text" };
  };
  