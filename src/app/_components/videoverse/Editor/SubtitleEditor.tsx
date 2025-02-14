"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { HexColorPicker } from "react-colorful";
import { fontFamilyOptions } from "@/utils/loadRendleyFonts";

interface SubtitleEditorProps {
  rendley: any;
}

export default function SubtitleEditor({ rendley }: SubtitleEditorProps) {
  const [color, setColor] = useState("#000000");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [size, setSize] = useState("small");
  const [mainColorPickerOpen, setMainColorPickerOpen] = useState(false);

  useEffect(() => {
    const closeColorPicker = (e: MouseEvent) => {
      if (
        colorPickerOpen &&
        !(e.target as Element).closest(".react-colorful")
      ) {
        setColorPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", closeColorPicker);
    return () => document.removeEventListener("mousedown", closeColorPicker);
  }, [colorPickerOpen]);

  const changeFont = async (fontFamily: string) => {
    const engineInstance = await rendley.current.getEngine();
    const engine = engineInstance.getInstance();
    engine.getSubtitlesManager().setMainTextStyle({
      fontFamily: fontFamily,
    });
  };

  const changeMainTextColor = async (color: string) => {
    const engineInstance = await rendley.current.getEngine();
    const engine = engineInstance.getInstance();
    engine.getSubtitlesManager().setMainTextStyle({
      color: color,
    });
  };

  const changeHighlightTextColor = async (color: string) => {
    const engineInstance = await rendley.current.getEngine();
    const engine = engineInstance.getInstance();
    engine.getSubtitlesManager().setHighlightedTextStyle({
      color: color,
    });
  };

  const changeHighlightFont = async (fontFamily: string) => {
    const engineInstance = await rendley.current.getEngine();
    const engine = engineInstance.getInstance();
    engine.getSubtitlesManager().setHighlightedTextStyle({
      fontFamily: fontFamily,
    });
    // Set the font for the main text
    engine.getSubtitlesManager().setMainTextStyle({
      fontFamily: fontFamily,
    });
  };

  const changeFontSize = async (fontSize: number) => {
    const engineInstance = await rendley.current.getEngine();
    const engine = engineInstance.getInstance();
    engine.getSubtitlesManager().setMainTextStyle({
      fontSize: fontSize,
    });
    engine.getSubtitlesManager().setHighlightedTextStyle({
      fontSize: fontSize,
    });
    if (fontSize === 40) {
      setSize("small");
    } else if (fontSize === 64) {
      setSize("medium");
    } else if (fontSize === 96) {
      setSize("large");
    }
  };

  const setYPosition = async (y: number) => {
    const engineInstance = await rendley.current.getEngine();
    const engine = engineInstance.getInstance();
    engine.getSubtitlesManager().setMainTextStyle({
      position: [y, y],
    });
  };

  const changeHighlightAnimation = async (animation: string) => {
    const engineInstance = await rendley.current.getEngine();
    const engine = engineInstance.getInstance();
    engine.getSubtitlesManager().setHighlightAnimation(animation);
    if (animation === "none") {
      engine.getSubtitlesManager().setHighlightAnimation(animation);
    }
  };
  return (
    <Card className="w-full max-w-md mt-4 border-none">
      <CardHeader>
        <CardTitle>Subtitles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Main Text Font
          </label>
          <div className="flex items-center gap-2">
            <Select
              defaultValue="Roboto"
              onValueChange={(value) => changeFont(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilyOptions.map((fontFamily, key) => (
                  <SelectItem value={fontFamily} key={key}>
                    {fontFamily}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: color }}
                onClick={() => setMainColorPickerOpen(!mainColorPickerOpen)}
              >
                <span className="sr-only">Select color</span>
              </Button>
              {colorPickerOpen && (
                <div className="absolute mt-2 z-10">
                  <HexColorPicker
                    color={color}
                    onChange={(newColor) => {
                      setColor(newColor); // Update the local state
                      changeMainTextColor(newColor); // Apply the color to main text
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div> */}

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Font</label>
          <div className="flex items-center gap-2">
            <Select
              defaultValue="Roboto"
              onValueChange={(value) => changeHighlightFont(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilyOptions.map((fontFamily, key) => (
                  <SelectItem value={fontFamily} key={key}>
                    {fontFamily}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: color }}
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
              ></Button>
              {colorPickerOpen && (
                <div className="absolute z-50 mt-2 bg-white p-2 shadow-lg rounded-lg">
                  <HexColorPicker
                    color={color}
                    onChange={(newColor) => {
                      setColor(newColor); // Update the local state
                      changeHighlightTextColor(newColor); // Update the engine
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 z-0">
          <label className="text-sm text-muted-foreground">Font Size</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                variant={size === "small" ? "secondary" : "outline"}
                className={"flex-1 hover:bg-blue-200 hover:text-blue-700"}
                onClick={() => changeFontSize(40)}
              >
                Small
              </Button>
              <Button
                variant={size === "medium" ? "secondary" : "outline"}
                className="flex-1 hover:bg-blue-200 hover:text-blue-700"
                onClick={() => changeFontSize(64)}
              >
                Medium
              </Button>
              <Button
                variant={size === "large" ? "secondary" : "outline"}
                className="flex-1 hover:bg-blue-200 hover:text-blue-700"
                onClick={() => changeFontSize(96)}
              >
                Large
              </Button>
            </div>
          </div>
          {/* <Slider
            defaultValue={[60]}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-blue-600"
            onValueChange={(value) => setYPosition(value[0])}
          /> */}
        </div>

        {/* <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Position Y</label>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-blue-600"
          />
        </div> */}

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Animation</label>
          <Select
            defaultValue="none"
            onValueChange={(value) => changeHighlightAnimation(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select animation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="pop_rotate">Pop Rotate</SelectItem>
              <SelectItem value="wiggle">Wiggle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
