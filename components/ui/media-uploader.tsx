"use client";

import { useState } from "react";
import { Loader2, X, Upload } from "lucide-react";
import { IKContext, IKUpload } from "imagekitio-react";
import { Image } from "@imagekit/react";
import { Button } from "./button";
import { Label } from "./label";
import { Media } from "@/lib/schema";
import { toast } from "sonner";

interface MediaUploaderProps {
  media: Media[];
  onMediaChange: (media: Media[]) => void;
  onUploadStart?: () => void;
  onUploadSuccess?: (res: any) => void;
  onUploadError?: (err: any) => void;
  onProgress?: (progress: number) => void;
  isUploading: boolean;
  authenticator: () => Promise<any>;
  accept?: string;
  maxFileSize?: number; // in bytes
  fileName?: string;
  tags?: string[];
  imageKitPublicKey: string;
  imageKitUrlEndpoint: string;
  uploadId?: string;
  label?: string;
}

export function MediaUploader({
  media,
  onMediaChange,
  onUploadStart,
  onUploadSuccess,
  onUploadError,
  onProgress,
  isUploading,
  authenticator,
  accept = "image/*,video/*",
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  fileName = "media",
  tags = ["media"],
  imageKitPublicKey,
  imageKitUrlEndpoint,
  uploadId = "media-upload",
  label = "Media (Images & Videos)",
}: MediaUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUploadSuccess = (res: any) => {
    const mimeType = res.mimeType || "";
    const mediaType = mimeType.startsWith("video/") ? "VIDEO" : "IMAGE";

    const newMedia: Media = {
      fileId: res.fileId,
      type: mediaType,
      url: res.url,
      additional: JSON.stringify({ width: res.width, height: res.height }),
    };

    onMediaChange([...media, newMedia]);
    onUploadSuccess?.(res);
    toast.success("Media uploaded successfully");
  };

  const handleUploadError = (err: any) => {
    onUploadError?.(err);
    console.error("Upload error", err);
    toast.error("Media upload failed");
  };

  const removeMedia = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    onMediaChange(newMedia);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Media Preview Grid */}
      <div className="flex flex-wrap gap-2 mb-2">
        {media.map((item, index) => (
          <div
            key={index}
            className={`relative w-20 h-20 border rounded overflow-hidden group ${
              item.type === "VIDEO" ? "bg-black" : "bg-gray-100"
            }`}
          >
            {item.type === "VIDEO" ? (
              <video src={item.url} className="w-full h-full object-cover" />
            ) : (
              <Image
                urlEndpoint={imageKitUrlEndpoint}
                src={item.url}
                alt={`Media ${index}`}
                className="w-full h-full object-cover"
              />
            )}

            {/* Type Badge */}
            <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
              {item.type === "VIDEO" ? "Video" : "Image"}
            </div>

            {/* Delete Button */}
            <Button
              type="button"
              onClick={() => removeMedia(index)}
              size="sm"
              className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="size-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <IKContext
        publicKey={imageKitPublicKey}
        urlEndpoint={imageKitUrlEndpoint}
        authenticator={authenticator}
      >
        {/* Progress Bar */}
        {isUploading && uploadProgress > 0 && (
          <div className="mb-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">Uploading...</span>
              <span className="text-xs font-semibold text-gray-700">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <IKUpload
          fileName={fileName}
          tags={tags}
          useUniqueFileName={true}
          validateFile={(file: any) => file.size < maxFileSize}
          onUploadStart={() => {
            setUploadProgress(0);
            onUploadStart?.();
          }}
          onProgress={(event: ProgressEvent) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(percentComplete);
              onProgress?.(percentComplete);
            }
          }}
          onSuccess={(res: any) => {
            setUploadProgress(0);
            handleUploadSuccess(res);
          }}
          onError={(err: any) => {
            setUploadProgress(0);
            handleUploadError(err);
          }}
          style={{ display: "none" }}
          id={uploadId}
          accept={accept}
        />
        <Label
          htmlFor={uploadId}
          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          {isUploading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Upload className="mr-2 size-4" />
          )}
          Upload Media
        </Label>
      </IKContext>
    </div>
  );
}
