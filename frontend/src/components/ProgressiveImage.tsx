import { useState, useEffect } from "react";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import {
  getOptimizedImageUrl,
  ConnectionType,
} from "../services/resourceLoader";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onError?: () => void;
}

export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className,
  onError,
}: ProgressiveImageProps) {
  const { connectionType } = useNetworkStatus();
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only apply progressive loading for 3G and slower
    if (["slow-2g", "2g", "3g"].includes(connectionType)) {
      // Get low-resolution placeholder URL
      const placeholderUrl = getOptimizedImageUrl(src, "slow-2g", width);

      // Set placeholder initially
      setCurrentSrc(placeholderUrl);
      setIsLoaded(false);

      // Load full-quality image
      const img = new Image();
      img.src = getOptimizedImageUrl(src, connectionType, width);
      img.onload = () => {
        setCurrentSrc(img.src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${img.src}`);
        if (onError) onError();
      };
    } else {
      // For 4G or unknown, load full-quality image directly
      setCurrentSrc(getOptimizedImageUrl(src, connectionType, width));
      setIsLoaded(true);
    }
  }, [src, connectionType, width, onError]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        filter:
          !isLoaded && ["slow-2g", "2g", "3g"].includes(connectionType)
            ? "blur(10px)"
            : "none",
        transition: "filter 0.3s ease-in-out",
      }}
    />
  );
}
