// src/components/SkeletonLoader.tsx
interface SkeletonLoaderProps {
  type: "text" | "image" | "button" | "card";
  lines?: number;
  className?: string;
}

export function SkeletonLoader({
  type,
  lines = 1,
  className = "",
}: SkeletonLoaderProps) {
  switch (type) {
    case "text":
      return (
        <div className={`animate-pulse ${className}`}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded mb-2 last:mb-0"
              style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
            ></div>
          ))}
        </div>
      );

    case "image":
      return (
        <div
          className={`aspect-square bg-gray-200 animate-pulse rounded ${className}`}
        ></div>
      );

    case "button":
      return (
        <div
          className={`h-10 bg-gray-200 animate-pulse rounded ${className}`}
        ></div>
      );

    case "card":
      return (
        <div className={`border rounded-lg p-4 shadow-sm ${className}`}>
          <div className="aspect-square bg-gray-200 animate-pulse mb-3"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-1/2"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded mb-3 w-1/3"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-full"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded mb-3 w-5/6"></div>
          <div className="h-10 bg-gray-200 animate-pulse rounded w-full"></div>
        </div>
      );

    default:
      return null;
  }
}
