import type { ImageProps as NextImageProps } from 'next/image';
import NextImage from 'next/image';
import { forwardRef } from 'react';

interface OptimizedImageProps extends Omit<NextImageProps, 'src'> {
  src: string;
  alt: string;
}

/**
 * Optimized Image component using Next.js Image with modern best practices
 * - Automatic WebP/AVIF format selection
 * - Lazy loading by default
 * - Responsive sizing
 */
export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ src, alt, className, ...props }, ref) => {
    return (
      <NextImage
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        {...props}
      />
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';
