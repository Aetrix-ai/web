/**
 * MediaUploader Component Documentation
 *
 * A reusable media upload component that handles both images and videos.
 * Automatically detects file type from MIME type and stores proper Media objects.
 *
 * USAGE EXAMPLE:
 */

import { MediaUploader } from "@/components/ui/media-uploader";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Media } from "@/lib/schema";

/**
 * Basic usage in a dialog/form:
 */
function MyFormDialog() {
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const form = useForm({
    defaultValues: {
      media: [] as Media[],
    },
  });

  // Authenticator function for ImageKit
  const authenticator = async () => {
    try {
      const response = await fetch("/api/auth/media-upload");
      return response.json();
    } catch (error) {
      throw new Error(`Authentication failed: ${error}`);
    }
  };

  return (
    <form>
      <MediaUploader
        // Required Props
        media={form.watch("media")}
        onMediaChange={(newMedia) => form.setValue("media", newMedia)}
        isUploading={isMediaUploading}
        authenticator={authenticator}
        imageKitPublicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""}
        imageKitUrlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}

        // Optional Props (with defaults)
        onUploadStart={() => setIsMediaUploading(true)}
        onUploadSuccess={() => setIsMediaUploading(false)}
        onUploadError={(err) => {
          console.error("Upload failed:", err);
          setIsMediaUploading(false);
        }}
        accept="image/*,video/*"
        maxFileSize={50 * 1024 * 1024} // 50MB
        fileName="my-media"
        tags={["my-app"]}
        uploadId="my-upload"
        label="Upload Media"
      />
    </form>
  );
}

/**
 * PROP INTERFACE:
 *
 * interface MediaUploaderProps {
 *   // Required Props
 *   media: Media[];                          // Current media array from form
 *   onMediaChange: (media: Media[]) => void; // Callback when media changes
 *   isUploading: boolean;                    // Loading state
 *   authenticator: () => Promise<any>;       // Auth function for ImageKit
 *   imageKitPublicKey: string;               // ImageKit public key
 *   imageKitUrlEndpoint: string;             // ImageKit URL endpoint
 *
 *   // Optional Props
 *   onUploadStart?: () => void;              // Called when upload starts
 *   onUploadSuccess?: (res: any) => void;    // Called on success
 *   onUploadError?: (err: any) => void;      // Called on error
 *   onProgress?: (progress: number) => void; // Called with progress percentage (0-100)
 *   accept?: string;                         // File accept attribute (default: "image/*,video/*")
 *   maxFileSize?: number;                    // Max file size in bytes (default: 50MB)
 *   fileName?: string;                       // ImageKit file name (default: "media")
 *   tags?: string[];                         // ImageKit tags (default: ["media"])
 *   uploadId?: string;                       // HTML id for upload input (default: "media-upload")
 *   label?: string;                          // Display label (default: "Media (Images & Videos)")
 * }
 *
 * MEDIA OBJECT STRUCTURE:
 *
 * interface Media {
 *   fileId: string;      // ImageKit file ID
 *   type: "IMAGE" | "VIDEO";
 *   url: string;         // Direct media URL
 *   additional?: string; // Additional metadata (JSON string)
 * }
 *
 *
 * DIFFERENT ENDPOINTS EXAMPLE:
 *
 * Different components can use different API endpoints:
 */

// Project Dialog (already done)
function ProjectDialogExample() {
  const authenticator = async () => {
    // Uses /media/authenticate-upload endpoint
    const response = await fetch("/media/authenticate-upload");
    return response.json();
  };
}

// Achievement Dialog (already done)
function AchievementDialogExample() {
  const authenticator = async () => {
    // Uses /media/authenticate-upload endpoint
    const response = await fetch("/media/authenticate-upload");
    return response.json();
  };
}

// Portfolio Component (example for future use)
function PortfolioDialogExample() {
  const authenticator = async () => {
    // Uses /portfolio/media-auth endpoint (different endpoint!)
    const response = await fetch("/portfolio/media-auth");
    return response.json();
  };

  return (
    <MediaUploader
      // ... all other props ...
      authenticator={authenticator}
      uploadId="portfolio-media-upload"
      fileName="portfolio-media"
      tags={["portfolio"]}
    />
  );
}

/**
 * KEY FEATURES:
 *
 * 1. Type Auto-Detection
 *    - Automatically detects if upload is IMAGE or VIDEO from MIME type
 *    - No manual type selection needed
 *
 * 2. Unified Media Handling
 *    - Single upload button for images and videos
 *    - Displays type badges on thumbnails
 *    - Different rendering for each type
 *
 * 3. Easy Integration
 *    - Works with React Hook Form
 *    - Minimal props required
 *    - Flexible endpoint configuration
 *
 * 4. Reusable Across App
 *    - Can be used in Projects, Achievements, Portfolio, etc.
 *    - Each can have different auth endpoints
 *    - Consistent UI/UX across all forms
 */
