"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { Label } from "~/components/ui/label";

const colorOptions = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#ff0000" },
  { name: "Blue", value: "#0000ff" },
  { name: "Green", value: "#00ff00" },
  { name: "Yellow", value: "#ffff00" },
];

const fontOptions = [
  { name: "Roboto", value: "Roboto" },
  { name: "Poppins", value: "Poppins" },
  { name: "Honk", value: "Honk" },
  { name: "Playfair Display", value: "Playfair Display" },
  { name: "Fira Sans Condensed", value: "Fira Sans Condensed" },
  { name: "Lexend", value: "Lexend" },
  { name: "Unbounded", value: "Unbounded" },
  { name: "Quicksand", value: "Quicksand" },
  { name: "Rubik", value: "Rubik" },
  { name: "The Alex Hormozi", value: "The Alex Hormozi" },
  { name: "Poetsen One", value: "Poetsen One" },
];

// Utility: Validate and normalize color
const validateColor = (color: string): string => {
  const isHex = /^#([0-9A-F]{3}){1,2}$/i.test(color);
  return isHex ? color : "#ffffff"; // Fallback to white if invalid
};

export default function CaptionCustomizer({
  rendleyEngine,
}: {
  rendleyEngine: any;
}) {
  const [mainTextStyle, setMainTextStyle] = React.useState({
    fontFamily: "Roboto",
    fontSize: 50,
    color: "#ffffff",
    strokeColor: "#000000",
    strokeThickness: 0,
    backgroundColor: "",
  });

  const [highlightTextStyle, setHighlightTextStyle] = React.useState({
    fontFamily: "Roboto",
    fontSize: 50,
    color: "#ffff00",
    strokeColor: "#000000",
    strokeThickness: 0,
    backgroundColor: "",
  });

  const handleUpdateCaptionStyle = async (isHighlight: boolean) => {
    const style = isHighlight ? highlightTextStyle : mainTextStyle;
    await setCaptionStyle(rendleyEngine, {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize, // Numeric value
      color: validateColor(style.color),
      strokeColor: validateColor(style.strokeColor),
      strokeThickness: style.strokeThickness,
      backgroundColor: validateColor(style.backgroundColor),
    });
  };

  const handleStyleChange = (isHighlight: boolean, key: string, value: any) => {
    if (isHighlight) {
      setHighlightTextStyle((prev) => ({ ...prev, [key]: value }));
    } else {
      setMainTextStyle((prev) => ({ ...prev, [key]: value }));
    }

    handleUpdateCaptionStyle(isHighlight);
  };

  const TextSection = ({ isHighlight }: { isHighlight: boolean }) => {
    const style = isHighlight ? highlightTextStyle : mainTextStyle;

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select
            value={style.fontFamily}
            onValueChange={(value) =>
              handleStyleChange(isHighlight, "fontFamily", value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`h-8 w-8 rounded-sm ${
                  color.value === "white" ? "border border-gray-600" : ""
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() =>
                  handleStyleChange(isHighlight, "color", color.value)
                }
                aria-label={`Set ${isHighlight ? "highlight" : "main"} text color to ${color.name}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Font Size</Label>
          <Slider
            defaultValue={[style.fontSize]}
            min={40}
            max={100}
            step={1}
            onValueChange={(value) =>
              handleStyleChange(isHighlight, "fontSize", value[0])
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Stroke Color</Label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`h-8 w-8 rounded-sm ${
                  color.value === "white" ? "border border-gray-600" : ""
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() =>
                  handleStyleChange(isHighlight, "strokeColor", color.value)
                }
                aria-label={`Set ${isHighlight ? "highlight" : "main"} stroke color to ${color.name}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Stroke Thickness</Label>
          <Slider
            defaultValue={[style.strokeThickness]}
            min={0}
            max={10}
            step={1}
            onValueChange={(value) =>
              handleStyleChange(isHighlight, "strokeThickness", value[0])
            }
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl space-y-6 rounded-lg border bg-background p-6">
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="main">Main Text</TabsTrigger>
          <TabsTrigger value="highlight">Highlight Text</TabsTrigger>
        </TabsList>
        <TabsContent value="main">
          <TextSection isHighlight={false} />
        </TabsContent>
        <TabsContent value="highlight">
          <TextSection isHighlight={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function setCaptionStyle(engine: any, config: any) {
  const engineInstance = await engine.current.getEngine();
  const subtitlesManager = engineInstance.getInstance().getSubtitlesManager();

  subtitlesManager.setMainTextStyle(config);
  subtitlesManager.setHighlightedTextStyle(config);
}
