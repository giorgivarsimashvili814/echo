import Image from "next/image";

export default function ImageGrid({ images }: { images: { id: string; url: string }[] }) {
  if (images.length === 0) return null;

if (images.length === 1) {
  return (
    <div className="relative w-full h-100 rounded-md overflow-hidden">
      <Image src={images[0].url} alt="Post attachment" fill className="object-contain" />
    </div>
  );
}

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 h-64">
        {images.map((image) => (
          <div key={image.id} className="relative w-full h-full rounded-md overflow-hidden">
            <Image src={image.url} alt="Post attachment" fill className="object-contain" />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-2 h-64">
        <div className="relative w-full h-full rounded-md overflow-hidden">
          <Image src={images[0].url} alt="Post attachment" fill className="object-contain" />
        </div>
        <div className="grid grid-rows-2 gap-2 h-full">
          {images.slice(1, 3).map((image) => (
            <div key={image.id} className="relative w-full h-full rounded-md overflow-hidden">
              <Image src={image.url} alt="Post attachment" fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const visibleImages = images.slice(0, 4);
  const remainingCount = images.length - 4;

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-64">
      {visibleImages.map((image, index) => (
        <div key={image.id} className="relative w-full h-full rounded-md overflow-hidden">
          <Image src={image.url} alt="Post attachment" fill className="object-contain" />
          {index === 3 && remainingCount > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xl font-medium">+{remainingCount}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}