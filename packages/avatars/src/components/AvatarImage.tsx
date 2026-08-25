import { useState } from 'react';
import type { CSSProperties } from 'react';

interface AvatarImageProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
  fallback?: string;
}

function isRenderableImageSrc(src: string): boolean {
  return /^(?:\/|https?:|data:|blob:|file:|\.\/|\.\.\/)/.test(src) || /\.(?:png|jpe?g|webp|gif|svg)(?:[?#].*)?$/i.test(src);
}

export function AvatarImage({
  src,
  alt,
  size = 40,
  className,
  style,
  fallback = '🎭',
}: AvatarImageProps) {
  const [imgError, setImgError] = useState(false);

  if (isRenderableImageSrc(src) && !imgError) {
    return (
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={className}
        style={{ objectFit: 'cover', borderRadius: '4px', ...style }}
        onError={() => {
          setImgError(true);
        }}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={alt}
      className={className}
      style={{ fontSize: size * 0.7, lineHeight: 1, display: 'inline-block', ...style }}
    >
      {imgError ? fallback : src}
    </span>
  );
}
