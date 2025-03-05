"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/reusable/XWSelect";



export type SpeedOptions = 'slowest' | 'slow' | 'normal' | 'fast' | 'fastest' | 'double';

interface VoiceSpeedSelectorProps {
    speed: SpeedOptions;
    setSpeed: (speed: SpeedOptions) => void;
}

export const VoiceSpeedSelector: React.FC<VoiceSpeedSelectorProps> = ({
    speed,
    setSpeed,
}) => {
    const speedOptions = ['slowest', 'slow', 'normal', 'fast', 'fastest', 'double'];

    return (
        <div className="relative w-40 flex items-center gap-x-5 pl-2">
            <Select value={speed} onValueChange={setSpeed}>
                <h1 className="block text-sm font-medium text-gray-300">
                    Speed:
                </h1>
                <SelectTrigger>
                    <span className="block truncate capitalize">{speed}</span>
                </SelectTrigger>
                <SelectContent>
                    {speedOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                            <span className="block truncate capitalize">{option}</span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
