"use client"

import { useAssets } from "@/hooks/useAssets"
import { AssetGrid } from "@/components/asset-grid"
import { Loader2, Library } from "lucide-react"

export default function AssetsPage() {
    const { assets, loading } = useAssets()

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center gap-2">
                    <Library className="h-6 w-6 text-muted-foreground" />
                    <h2 className="text-3xl font-bold tracking-tight">Assets Library</h2>
                </div>
            </div>

            <div className="h-[calc(100vh-140px)] rounded-md border bg-muted/10 p-4">
                <AssetGrid assets={assets} />
            </div>
        </div>
    )
}
