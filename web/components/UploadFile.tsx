"use client";

import { useRef } from "react";
import Image from "next/image";

export type PendingImage = {
  id: string;
  file: File;
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
    const newImages = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    onChange([...images, ...newImages]);
  };

  const removeImage = (id: string) => {
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
        className="text-sm text-neutral-500 border border-dashed border-neutral-300 rounded-lg px-3 py-2 w-fit"
      >
        Add images
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}