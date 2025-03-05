'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
// import XWSecondaryButton from '../reusable/XWSecondaryButton'
import { Separator } from '~/components/ui/separator'
// import { cn } from '@/utils/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"
import { MoreHorizontal, ChevronsUpDown } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/reusable/XWSelect'
// import { assets } from "./data/index"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../reusable/XWSelect"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { format } from "date-fns"
// import XWCheckbox from "../reusable/xw-checkbox"
// import { XWDropdown, XWDropdownContent, XWDropdownItem, XWDropdownTrigger } from "../reusable/xw-dropdown"
import Image from "next/image"
import XWCheckbox from '~/components/reusable/xw-checkbox'
import { XWDropdown, XWDropdownContent, XWDropdownItem, XWDropdownTrigger } from '~/components/reusable/xw-dropdown'
import XWSecondaryButton from '~/components/reusable/XWSecondaryButton'
import { cn } from '~/utils/utils'
import { assets } from './data'

interface ImportFromAssetsModelProps {
    children: React.ReactNode;
}

const ImportFromAssetsModel = ({ children }: ImportFromAssetsModelProps) => {
    const [open, setOpen] = React.useState(false)
    const [selectedAssets, setSelectedAssets] = React.useState<string[]>([]);
    const [dateFilter, setDateFilter] = React.useState("newest");
    const [mediaFilter, setMediaFilter] = React.useState("all");
    const [sortConfig, setSortConfig] = React.useState<{
        key: string;
        direction: 'asc' | 'desc' | null;
    }>({
        key: '',
        direction: null
    });

    const isAllSelected = assets.length > 0 && selectedAssets.length === assets.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedAssets([]);
        } else {
            setSelectedAssets(assets.map(asset => asset.id.toString()));
        }
    };

    const toggleAsset = (assetId: number) => {
        const assetIdString = assetId.toString();
        if (selectedAssets.includes(assetIdString)) {
            setSelectedAssets(selectedAssets.filter(id => id !== assetIdString));
        } else {
            setSelectedAssets([...selectedAssets, assetIdString]);
        }
    };

    const getIcon = (asset: typeof assets[0]) => {
        return (
            <Image
                src={asset.icon}
                alt={asset.type}
                width={16}
                height={16}
                className="h-4 w-4"
            />
        )
    }

    const handleSort = (key: string) => {
        setSortConfig(prevConfig => {
            if (prevConfig.key === key && prevConfig.direction === 'asc') {
                return { key: '', direction: null };
            }
            return { key, direction: 'asc' };
        });
    };

    const filterAssets = () => {
        let filtered = [...assets];

        if (mediaFilter !== 'all') {
            filtered = filtered.filter(asset =>
                mediaFilter === 'folders'
                    ? asset.type === 'Folder'
                    : asset.type.toLowerCase() === mediaFilter.toLowerCase()
            );
        }

        filtered = filtered.sort((a, b) => {
            const dateA = new Date(a.created).getTime();
            const dateB = new Date(b.created).getTime();

            switch (dateFilter) {
                case 'newest':
                    return dateB - dateA;
                case 'oldest':
                    return dateA - dateB;
                default:
                    return dateB - dateA;
            }
        });

        if (sortConfig.direction !== null && sortConfig.key !== '') {
            filtered = filtered.sort((a, b) => {
                switch (sortConfig.key) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'type':
                        return a.type.localeCompare(b.type);
                    case 'media':
                        const getMediaType = (item: typeof assets[0]) =>
                            item.type === 'Folder' ? 'Folder' : item.type;
                        return getMediaType(a).localeCompare(getMediaType(b));
                    case 'created':
                        return new Date(a.created).getTime() - new Date(b.created).getTime();
                    case 'duration':
                        const durationToMinutes = (duration: string | undefined): number => {
                            if (!duration) return 0;
                        
                            const parts = duration.split(':').map(Number);
                            
                            // Ensure parts array has at least two valid numbers
                            const minutes = parts[0] ?? 0; // Default to 0 if undefined
                            const seconds = parts[1] ?? 0; // Default to 0 if undefined
                        
                            return minutes + seconds / 60;
                        };
                        
                        return durationToMinutes(a.duration) - durationToMinutes(b.duration);
                    case 'creator':
                        return a.creator.name.localeCompare(b.creator.name);
                    default:
                        return 0;
                }
            });
        }

        return filtered;
    };

    const filteredAssets = filterAssets();

    const getSortIcon = (key: string) => {
        if (sortConfig.key !== key || sortConfig.direction === null) {
            return <ChevronsUpDown className="h-4 w-4" />;
        }
        return <ChevronsUpDown className="h-4 w-4 text-primary" />;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-6xl w-full bg-xw-sidebar rounded-lg p-6  flex flex-col">
                <DialogHeader className="text-left space-y-2">
                    <DialogTitle className="text-2xl">Import from Assets</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Select files from your assets to import into your current project.
                    </p>
                </DialogHeader>

                <div className="mt-6 flex flex-col flex-1">
                    <div className="border border-xw-secondary rounded-lg p-4 flex flex-col ">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-semibold text-muted-foreground">All Assets</span>
                                <span className="text-2xl">&gt;</span>
                                <span className="text-2xl font-semibold text-white">Generative Audio</span>
                                <span className="text-lg text-muted-foreground">(4 items)</span>
                            </div>

                            <div className="flex gap-2">
                                <Select value={dateFilter} onValueChange={setDateFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Date created" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest first</SelectItem>
                                        <SelectItem value="oldest">Oldest first</SelectItem>
                                        <SelectItem value="modified">Last modified</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={mediaFilter} onValueChange={setMediaFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="All media" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All media</SelectItem>
                                        <SelectItem value="audio">Audio</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="image">Images</SelectItem>
                                        <SelectItem value="document">Documents</SelectItem>
                                        <SelectItem value="folders">Folders</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Separator className="mb-4" />

                        <div className="pr-4 max-h-[300px] overflow-y-auto scrollbar-track-transparent scrollbar-thumb-xw-secondary scrollbar-thin">
                            <Table className='  '>
                                <TableHeader className=" sticky top-0 bg-xw-background z-10">
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <XWCheckbox
                                                checked={isAllSelected}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('name')}
                                                className="flex items-center justify-between w-full hover:bg-transparent"
                                            >
                                                Name
                                                {getSortIcon('name')}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('type')}
                                                className="flex items-center justify-between w-full hover:bg-transparent"
                                            >
                                                Type
                                                {getSortIcon('type')}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('media')}
                                                className="flex items-center justify-between w-full hover:bg-transparent"
                                            >
                                                Media
                                                {getSortIcon('media')}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('duration')}
                                                className="flex items-center justify-between w-full hover:bg-transparent"
                                            >
                                                Duration
                                                {getSortIcon('duration')}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('creator')}
                                                className="flex items-center justify-between w-full hover:bg-transparent"
                                            >
                                                Creator
                                                {getSortIcon('creator')}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('created')}
                                                className="flex items-center justify-between w-full hover:bg-transparent"
                                            >
                                                Created
                                                {getSortIcon('created')}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAssets.map((asset) => (
                                        <TableRow
                                            key={asset.id}
                                            className={cn(
                                                "bg-xw-sidebar border-b border-xw-secondary transition-colors",
                                                selectedAssets.includes(asset.id.toString()) &&
                                                "bg-xw-primary-foreground ring-1 ring-xw-primary hover:bg-purple-500/20 border border-xw-primary"
                                            )}
                                        >
                                            <TableCell>
                                                <XWCheckbox
                                                    checked={selectedAssets.includes(asset.id.toString())}
                                                    onCheckedChange={() => toggleAsset(asset.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    {getIcon(asset)}
                                                    {asset.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {asset.type !== "Folder" && (
                                                    <div>
                                                        <div className="w-fit bg-gradient-to-r from-white/10 via-white/30 to-white/40 rounded-md p-[0.5px]">
                                                            <div className="bg-xw-sidebar rounded-md text-xs px-2 py-1">
                                                                Upload
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {asset.type !== "Folder" ? asset.type : ""}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{asset.duration || "-"}</TableCell>
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={asset.creator.image} alt={asset.creator.name} />
                                                                <AvatarFallback>{asset.creator.name[0]}</AvatarFallback>
                                                            </Avatar>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{asset.creator.name}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {format(new Date(asset.created), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell>
                                                <XWDropdown>
                                                    <XWDropdownTrigger asChild>
                                                        <Button variant={"ghost"} size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </XWDropdownTrigger>
                                                    <XWDropdownContent align="end">
                                                        <XWDropdownItem>Download</XWDropdownItem>
                                                    </XWDropdownContent>
                                                </XWDropdown>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="h-24 invisible">
                                        <TableCell colSpan={2}></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-xw-secondary">
                    <div className="text-sm text-muted-foreground">
                        {selectedAssets.length} items selected
                    </div>
                    <div className="flex gap-2">
                        <XWSecondaryButton onClick={() => setOpen(false)}>
                            Cancel
                        </XWSecondaryButton>
                        <Button
                            variant="default"
                            className="h-9"
                            disabled={selectedAssets.length === 0}
                        >
                            Import Selected
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default ImportFromAssetsModel
