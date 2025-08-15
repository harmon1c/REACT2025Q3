'use client';
import React, { useCallback, useRef, useState } from 'react';
import Image from 'next/image';

export interface ImageInputProps {
  value?: string | null;
  onChange: (dataUrl: string | null) => void;
  maxSizeBytes?: number;
  accept?: string;
  label?: string;
  disabled?: boolean;
}

export function ImageInput({
  value,
  onChange,
  maxSizeBytes = 1024 * 1024,
  accept = 'image/png,image/jpeg',
  label = 'Avatar',
  disabled = false,
}: ImageInputProps): React.JSX.Element {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const prettySize = (bytes: number): string => {
    if (bytes < 1024) {
      return bytes + 'B';
    }
    if (bytes < 1024 * 1024) {
      return Math.round(bytes / 1024) + 'KB';
    }
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  };

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) {
        return;
      }
      if (disabled) {
        return;
      }
      // Reset previous error
      setError(null);
      // Validate size
      if (file.size > maxSizeBytes) {
        setError(
          `File too large. ${prettySize(file.size)} > max ${prettySize(maxSizeBytes)}.`
        );
        onChange(null);
        return;
      }
      const acceptRules = accept
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const typeOk = acceptRules.some((rule) => {
        if (rule.endsWith('/*')) {
          return file.type.startsWith(rule.slice(0, -1));
        }
        return file.type === rule;
      });
      if (!typeOk) {
        setError('Unsupported file type.');
        onChange(null);
        return;
      }
      const { fileToBase64 } = await import('../utils/fileToBase64');
      try {
        const dataUrl = await fileToBase64(file);
        onChange(dataUrl);
      } catch {
        /* swallow */
        setError('Failed to read file.');
      }
    },
    [accept, disabled, maxSizeBytes, onChange]
  );

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    void handleFile(e.target.files?.[0]);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    if (disabled) {
      return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!dragActive) {
      setDragActive(true);
    }
  };
  const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    if (disabled) {
      return;
    }
    const related = e.relatedTarget;
    if (
      !related ||
      (related instanceof Node && !e.currentTarget.contains(related))
    ) {
      setDragActive(false);
    }
  };
  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    if (disabled) {
      return;
    }
    e.preventDefault();
    setDragActive(false);
    void handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="flex flex-col gap-1 text-sm">
      <label className="font-medium">{label}</label>
      <div
        className={
          'group flex items-center gap-3 rounded border p-2 motion-safe:transition-colors text-xs ' +
          (dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
            : 'border-dashed border-gray-300 dark:border-gray-600') +
          (disabled ? ' opacity-60 cursor-not-allowed' : ' cursor-pointer')
        }
        onClick={() => !disabled && fileRef.current?.click()}
        onKeyDown={(e) => {
          if (disabled) {
            return;
          }
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileRef.current?.click();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        aria-disabled={disabled || undefined}
        aria-describedby={error ? 'avatar-error' : undefined}
        data-invalid={error ? 'true' : undefined}
      >
        <button
          type="button"
          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          onClick={(e) => {
            e.stopPropagation();
            fileRef.current?.click();
          }}
          disabled={disabled}
        >
          Choose
        </button>
        {value ? (
          <div className="relative w-10 h-10 rounded overflow-hidden ring-1 ring-gray-300 dark:ring-gray-600 flex-shrink-0">
            <Image
              src={value}
              alt="avatar preview"
              width={40}
              height={40}
              unoptimized
              className="object-cover w-full h-full"
              sizes="40px"
            />
            <button
              type="button"
              aria-label="Remove image"
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow"
              onClick={(e) => {
                e.stopPropagation();
                setError(null);
                onChange(null);
              }}
              disabled={disabled}
            >
              ×
            </button>
          </div>
        ) : (
          <span className="text-gray-500 select-none">
            Drag & drop or click — max {prettySize(maxSizeBytes)}
          </span>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onInputChange}
        disabled={disabled}
      />
      {error && (
        <p
          id="avatar-error"
          className="text-xs text-red-600 mt-1"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
