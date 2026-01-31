"use client";

import { useState, useRef } from "react";
import * as tus from "tus-js-client";
import { cn } from "@/lib/utils";
import { IconUpload } from "@tabler/icons-react";
import { getLessonUploadVideoApi } from "@/services/courseApi";
import { getApiErrorMessage } from "@/lib/utils";

interface VideoUploaderProps {
  /** Lesson id – used to call backend for TUS upload credentials */
  lessonId: string;
  /** Called when TUS upload completes successfully; receives embed URL */
  onSuccess?: (embedUrl: string) => void;
  className?: string;
}

export function VideoUploader({ lessonId, onSuccess, className }: VideoUploaderProps) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const data = await getLessonUploadVideoApi(lessonId);
      if (!data?.success || !data?.upload) {
        throw new Error(data?.detail ?? "Failed to get upload credentials");
      }

      const { upload: creds } = data;
      const embedUrl = `https://iframe.mediadelivery.net/embed/${creds.library_id}/${creds.video_id}`;
      console.log(embedUrl , "embedUrl" , data);
      await new Promise<void>((resolve, reject) => {
        const upload = new tus.Upload(file, {
          endpoint: creds.tus_endpoint,
          retryDelays: [0, 3000, 5000, 10000, 20000, 60000],
          headers: {
            AuthorizationSignature: creds.signature,
            AuthorizationExpire: String(creds.expiration_time),
            VideoId: creds.video_id,
            LibraryId: creds.library_id,
          },
          metadata: {
            filetype: file.type,
            title: file.name,
          },
          onError(err) {
            setError(err?.message ?? "Upload failed");
            setUploading(false);
            reject(err);
          },
          onProgress(bytesUploaded, bytesTotal) {
            if (bytesTotal > 0) {
              setProgress(Math.round((bytesUploaded / bytesTotal) * 100));
            }
          },
          onSuccess() {
            setVideoUrl(embedUrl);
            setUploading(false);
            onSuccess?.(embedUrl);
            resolve();
          },
        });

        upload.findPreviousUploads().then((previousUploads) => {
          // if (previousUploads.length > 0) {
          //   upload.resumeFromPreviousUpload(previousUploads[0]);
          // }
          upload.start();
        });
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to get upload credentials"));
      setUploading(false);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      handleUpload(file);
    } else if (file) {
      setError("Please select a video file.");
    }
    event.target.value = "";
  }

  function handleClick() {
    if (!uploading) inputRef.current?.click();
  }

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />

      {!videoUrl ? (
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          className={cn(
            "rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-colors",
            !uploading && "cursor-pointer hover:border-slate-300 hover:bg-slate-100/50",
            uploading && "pointer-events-none opacity-90"
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm font-medium text-slate-600">Uploading… {progress}%</p>
            </div>
          ) : (
            <>
              <IconUpload className="mx-auto h-10 w-10 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-slate-700">Upload video</p>
              <p className="mt-1 text-xs text-slate-500">Click or drag a video file here</p>
            </>
          )}
          {error && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 overflow-hidden">
          <div className="aspect-video w-full max-w-2xl">
            <iframe
              src={videoUrl}
              title="Uploaded video"
              className="h-full w-full"
              allow="autoplay; fullscreen"
            />
          </div>
          <p className="p-2 text-center text-xs text-slate-500">Video uploaded successfully.</p>
        </div>
      )}
    </div>
  );
}
