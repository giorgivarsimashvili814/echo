"use client";

import { useRef } from "react";
import Image from "next/image";

export type PendingImage = {
  id: string;
  file: File;
  height: number;
  width: number;
  previewUrl: string;
};

export default function UploadFile({
  images,
  onChange,
}: {
  images: PendingImage[];
  onChange: (images: PendingImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const promises = Array.from(files).map((file) => {
      return new Promise<PendingImage>((resolve, reject) => {
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
          resolve({
            id: crypto.randomUUID(),
            file,
            height: img.height,
            width: img.width,
            previewUrl: objectUrl,
          });
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error(`Failed to load image: ${file.name}`));
        };

        img.src = objectUrl;
      });
    });

    Promise.allSettled(promises).then((results) => {
      const newImages = results
        .filter(
          (r): r is PromiseFulfilledResult<PendingImage> =>
            r.status === "fulfilled",
        )
        .map((r) => r.value);

      onChange([...images, ...newImages]);
    });
  };

  const removeImage = (id: string) => {
    const img = images.find((img) => img.id === id);
    if (img) URL.revokeObjectURL(img.previewUrl);
    onChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      {images.length > 0 && (
        <div className="flex gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative w-20 h-20">
              <Image
                src={img.previewUrl}
                alt=""
                fill
                unoptimized
                className="object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute -top-1 -right-1 bg-black text-white rounded-full w-5 h-5 text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="text-sm text-neutral-500 border border-dashed border-neutral-300 rounded-lg px-3 py-2 w-fit bg-white"
      >
        Add images
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
