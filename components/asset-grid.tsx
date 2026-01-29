"use client"

import { FileIcon, ImageIcon, VideoIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Asset } from "@/types"
import { AssetUploader } from "./asset-uploader"
import { AssetPicker } from "./asset-picker"

interface AssetGridProps {
    assets: Asset[]
    projectId?: string  // If provided, show uploader and picker
}

export function AssetGrid({ assets, projectId }: AssetGridProps) {
    const getFileIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "mp4":
            case "mov":
            case "avi":
                return <VideoIcon className="w-8 h-8 text-blue-500" />
            case "jpg":
            case "jpeg":
            case "png":
                return <ImageIcon className="w-8 h-8 text-green-500" />
            default:
                return <FileIcon className="w-8 h-8 text-gray-500" />
        }
    }

    const isImage = (type: string) => ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(type.toLowerCase())

    return (
        <div className="flex-1 bg-muted/10 h-full overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Assets</h2>
                    <p className="text-sm text-muted-foreground">{assets.length} files</p>
                </div>
                {projectId && (
                    <AssetPicker projectId={projectId} />
                )}
            </div>

            <ScrollArea className="flex-1 p-6">
                {projectId && (
                    <div className="mb-6">
                        <AssetUploader projectId={projectId} />
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="group bg-card rounded-lg border border-border hover:border-sidebar-accent hover:shadow-md transition-all flex flex-col relative overflow-hidden p-2 cursor-pointer"
                        >
                            <div className="relative aspect-square mb-2 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                                {isImage(asset.file_type) ? (
                                    <img
                                        src={asset.wasabi_url}
                                        alt={asset.filename}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="p-3 rounded-full group-hover:bg-sidebar-accent/50 transition-colors">
                                        {getFileIcon(asset.file_type)}
                                    </div>
                                )}
                            </div>
                            <div className="px-2 pb-1">
                                <p className="text-sm font-medium text-foreground truncate w-full">
                                    {asset.filename}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {(asset.size_bytes ? (asset.size_bytes / 1024 / 1024).toFixed(2) : "0")} MB
                                </p>
                            </div>
                        </div>
                    ))}

                    {assets.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
                            <FileIcon className="w-12 h-12 mb-4" />
                            <p>No assets found</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
