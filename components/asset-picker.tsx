"use client"

import { useState } from "react"
import { useAssets } from "@/hooks/useAssets"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Library, Check, Loader2, ImageIcon, VideoIcon, FileIcon } from "lucide-react"
import { linkAssetToProject } from "@/lib/actions"
import { toast } from "sonner"
import type { Asset } from "@/types"

interface AssetPickerProps {
    projectId: string
}

export function AssetPicker({ projectId }: AssetPickerProps) {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const { assets, loading } = useAssets() // Fetch all assets
    const [isLinking, setIsLinking] = useState(false)

    // Filter out assets already in this project to avoid duplicates if possible, 
    // or just show everything. Let's show everything but maybe visually indicate?
    // Actually, filter by search term.
    const filteredAssets = assets.filter(asset =>
        asset.filename.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelectAsset = async (asset: Asset) => {
        setIsLinking(true)
        try {
            const result = await linkAssetToProject(asset.id, projectId)
            if (result.success) {
                toast.success(`Attached ${asset.filename}`)
                setOpen(false)
            } else {
                toast.error("Failed to attach asset")
            }
        } catch (error) {
            toast.error("An error occurred")
            console.error(error)
        } finally {
            setIsLinking(false)
        }
    }

    const getFileIcon = (type: string) => {
        const t = type.toLowerCase()
        if (["jpg", "jpeg", "png", "webp", "svg"].includes(t)) return <ImageIcon className="w-5 h-5 text-green-500" />
        if (["mp4", "mov", "avi"].includes(t)) return <VideoIcon className="w-5 h-5 text-blue-500" />
        return <FileIcon className="w-5 h-5 text-gray-500" />
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Library className="w-4 h-4" />
                    Select from Library
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Asset Library</DialogTitle>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search assets..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6 pt-2">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredAssets.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            No assets found
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2">
                            {filteredAssets.map((asset) => (
                                <button
                                    key={asset.id}
                                    onClick={() => handleSelectAsset(asset)}
                                    disabled={isLinking}
                                    className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left group"
                                >
                                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {["jpg", "jpeg", "png", "webp"].includes(asset.file_type.toLowerCase()) ? (
                                            <img src={asset.wasabi_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            getFileIcon(asset.file_type)
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{asset.filename}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {(asset.size_bytes ? (asset.size_bytes / 1024 / 1024).toFixed(2) : "0")} MB • {asset.file_type.toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                            Select
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                {isLinking && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
