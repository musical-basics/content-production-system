"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, X } from "lucide-react"
import { uploadAsset } from "@/lib/actions"
import { toast } from "sonner"
import imageCompression from "browser-image-compression"

interface AssetUploaderProps {
    projectId: string
}

export function AssetUploader({ projectId }: AssetUploaderProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return

        setIsUploading(true)

        try {
            for (const file of Array.from(files)) {
                let fileToUpload: File = file

                // 1. Compress Image if it's an image
                if (file.type.startsWith("image/")) {
                    const options = {
                        maxSizeMB: 1.5,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                    }
                    try {
                        const compressedBlob = await imageCompression(file, options)
                        fileToUpload = new File([compressedBlob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        })
                        console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`)
                    } catch (error) {
                        console.error("Compression error:", error)
                        // Fallback to original file
                    }
                }

                // 2. Upload
                const formData = new FormData()
                formData.append("file", fileToUpload)

                const result = await uploadAsset(projectId, formData)

                if (result.success) {
                    toast.success(`Uploaded: ${file.name}`)
                } else {
                    toast.error(`Failed to upload: ${file.name}`)
                    console.error(result.error)
                }
            }
        } catch (error) {
            toast.error("Upload failed")
            console.error(error)
        } finally {
            setIsUploading(false)
            if (inputRef.current) {
                inputRef.current.value = ""
            }
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        handleFiles(e.dataTransfer.files)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files)
    }

    return (
        <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/50"
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                ref={inputRef}
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleChange}
                disabled={isUploading}
            />

            <div className="flex flex-col items-center gap-2">
                {isUploading ? (
                    <>
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                    </>
                ) : (
                    <>
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Drop files here or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                            Videos, images, documents
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}
