import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe, Mic, Notebook, Play } from 'lucide-react';
import { useAtom } from 'jotai';
import { MultiSelectType, multiSourceSelect } from '../../../_atoms/multiFlow';


const SourceSelectionComponent = () => {
    const [sourceType, setSourceType] = useAtom(multiSourceSelect);
    return (
        <div className="grid grid-cols-1 tb:grid-cols-2 gap-6">
            <Card
                className={`bg-xw-sidebar-two hover:bg-xw-card ${sourceType === MultiSelectType.url && "bg-xw-card ring-1 ring-xw-primary"}`}

                onClick={() => setSourceType(MultiSelectType.url)}>
                <CardHeader>
                    <Globe className="w-5 h-5 text-xw-primary" />
                    <CardTitle>Web URL</CardTitle>
                    <CardDescription>Select this option to input a web URL</CardDescription>

                </CardHeader>
            </Card>
            <Card
                className={`bg-xw-sidebar-two hover:bg-xw-card ${sourceType === MultiSelectType.doc && "bg-xw-card ring-1 ring-xw-primary"}`}
                onClick={() => setSourceType(MultiSelectType.doc)}>
                <CardHeader>
                    <Notebook className="w-5 h-5 text-xw-primary" />
                    <CardTitle>Document</CardTitle>
                    <CardDescription>Select this option to choose a document</CardDescription>

                </CardHeader>
            </Card>

            <Card
                className={`bg-xw-sidebar-two hover:bg-xw-card ${sourceType === MultiSelectType.audio && "bg-xw-card ring-1 ring-xw-primary"}`}
                onClick={() => setSourceType(MultiSelectType.audio)}>
                <CardHeader>
                    <Mic className="w-5 h-5 text-xw-primary" />
                    <CardTitle>Audio</CardTitle>
                    <CardDescription>Select this option to choose a audio</CardDescription>
                </CardHeader>
            </Card>

            <Card
                className={`bg-xw-sidebar-two hover:bg-xw-card ${sourceType === MultiSelectType.video && "bg-xw-card ring-1 ring-xw-primary"}`}
                onClick={() => setSourceType(MultiSelectType.video)}>
                <CardHeader>
                    <Play className="w-5 h-5 text-xw-primary" />
                    <CardTitle>Video</CardTitle>
                    <CardDescription>Select this option to choose a video</CardDescription>
                </CardHeader>
            </Card>


        </div>
    );
};

export default SourceSelectionComponent;