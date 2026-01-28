"use client"

import Image from "next/image"
import { Download, Film, Clock, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Asset } from "@/lib/types"

interface AssetsPanelProps {
  assets: Asset[]
}

export function AssetsPanel({ assets }: AssetsPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium text-foreground">Assets</h3>
            <span className="text-xs text-muted-foreground">
              ({assets.length})
            </span>
          </div>
          <Button size="sm" className="h-8 text-xs">
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Upload
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Film className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No assets uploaded yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Upload video files to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group bg-card rounded-lg overflow-hidden border border-border hover:border-muted-foreground/30 transition-colors"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={asset.thumbnail || "/placeholder.svg"}
                    alt={asset.filename}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  <Badge
                    variant="secondary"
                    className="absolute bottom-2 right-2 bg-black/70 text-foreground border-0 text-xs"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {asset.duration}
                  </Badge>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium text-foreground truncate">
                    {asset.filename}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{asset.size}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
