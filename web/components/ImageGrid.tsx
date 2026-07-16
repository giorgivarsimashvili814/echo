import Image from "next/image";

const GRID_HEIGHT = "h-80";

function getClampedAspectRatio(width: number, height: number) {
const MIN_RATIO = 4 / 5;
const MAX_RATIO = 1.91;

const ratio = width / height;
return Math.min(MAX_RATIO, Math.max(MIN_RATIO, ratio));
}

export default function ImageGrid({
  images,
}: {
  images: { id: string; url: string; height: number; width: number }[];
}) {
  if (images.length === 0) return null;


if (images.length === 1) {
  const { width, height } = images[0];
  const rawRatio = width / height;
  const containerRatio = getClampedAspectRatio(width, height);
  const isPortrait = rawRatio < 1;

  return (
    <div
      className="relative w-full max-h-150 overflow-hidden bg-gray-100"
      style={{ aspectRatio: containerRatio }}
    >
      <Image
        src={images[0].url}
        alt="Post attachment"
        fill
        sizes="(max-width: 640px) 100vw, 600px"
        className={isPortrait ? "object-contain" : "object-cover"}
      />
    </div>
  );
}

  if (images.length === 2) {
  return (
    <div className={`flex gap-1 w-full ${GRID_HEIGHT} overflow-hidden`}>
      {images.map((img, i) => (
        <div key={i} className="relative flex-1 h-full">
          <Image
            src={img.url}
            alt="Post attachment"
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

if (images.length === 3) {
  return (
    <div className={`flex gap-1 w-full ${GRID_HEIGHT} overflow-hidden`}>
      <div className="relative flex-1 h-full">
        <Image
          src={images[0].url}
          alt="Post attachment"
          fill
          sizes="60vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1 h-full ">
        {images.slice(1, 3).map((img, i) => (
          <div key={i} className="relative flex-1 w-full">
            <Image
              src={img.url}
              alt="Post attachment"
              fill
              sizes="40vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

  const visibleImages = images.slice(0, 4);
  const remainingCount = images.length - 4;

  return (
    <div
      className={`grid grid-cols-2 grid-rows-2 gap-1 w-full ${GRID_HEIGHT} overflow-hidden`}
    >
      {visibleImages.map((image, index) => (
        <div key={image.id} className="relative w-full h-full">
          <Image
            src={image.url}
            alt="Post attachment"
            fill
            sizes="50vw"
            className="object-cover"
          />
          {index === 3 && remainingCount > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xl font-medium">
                +{remainingCount}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
