import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Input } from "~/components/ui/input";

interface Language {
    label: string;
    value: string;
}

interface SelectLanguageProps {
    value: string;
    onChange: (value: string) => void;
}

const languages: Language[] = [
    { label: "English", value: "en" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese", value: "pt" },
    { label: "Chinese", value: "zh" },
    { label: "Japanese", value: "ja" },
    { label: "Hindi", value: "hi" },
    { label: "Italian", value: "it" },
    { label: "Korean", value: "ko" },
    { label: "Dutch", value: "nl" },
    { label: "Polish", value: "pl" },
    { label: "Russian", value: "ru" },
    { label: "Swedish", value: "sv" },
    { label: "Turkish", value: "tr" },
];

const SelectLanguage: React.FC<SelectLanguageProps> = ({ value, onChange }) => {
    const [search, setSearch] = useState<string>("");

    const filteredLanguages = languages.filter((language) =>
        language.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full max-w-sm">
            <Select onValueChange={onChange} value={value}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                    <div className="p-2">
                        <Input
                            placeholder="Search language..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mb-2"
                        />
                    </div>
                    {filteredLanguages.length > 0 ? (
                        filteredLanguages.map((language) => (
                            <SelectItem key={language.value} value={language.value}>
                                {language.label}
                            </SelectItem>
                        ))
                    ) : (
                        <div className="p-2 text-gray-500 text-sm">No results found</div>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SelectLanguage;
