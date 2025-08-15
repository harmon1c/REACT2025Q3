'use client';
import { useState, useEffect, useRef, useId, useCallback } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectCountries } from '../state/countriesSlice';

interface CountriesAutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}
export function CountriesAutocomplete({
  value,
  onChange,
  id,
  name = 'country',
  label = 'forms.labels.country',
  placeholder = 'forms.placeholders.country',
  disabled,
  error,
  className,
}: CountriesAutocompleteProps): React.JSX.Element {
  const countries = useAppSelector(selectCountries);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const listRef = useRef<HTMLUListElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxId = useId();
  const generatedId = useId();
  const inputId = id ?? generatedId;

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered = query.trim()
    ? countries.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    : countries.slice(0, 50);

  useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
    }
  }, [open]);

  const commitValue = useCallback(
    (val: string) => {
      onChange(val);
      setQuery(val);
      setOpen(false);
      setActiveIndex(-1);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    },
    [onChange]
  );

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && activeIndex >= 0) {
        e.preventDefault();
        commitValue(filtered[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    const onClickOutside = (evt: MouseEvent): void => {
      if (!listRef.current || !inputRef.current) {
        return;
      }
      const target = evt.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (
        !listRef.current.contains(target) &&
        !inputRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return (): void =>
      document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className={'flex flex-col gap-1 ' + (className || '')}>
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          role="combobox"
          ref={inputRef}
          id={inputId}
          name={name}
          type="text"
          disabled={disabled}
          value={query}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-controls={open ? listboxId : undefined}
          aria-expanded={open}
          aria-activedescendant={
            open && activeIndex >= 0
              ? `${listboxId}-opt-${activeIndex}`
              : undefined
          }
          aria-invalid={!!error}
          aria-describedby={error ? inputId + '-err' : undefined}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            onChange(v);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 transition-colors"
        />
        {open && filtered.length > 0 && (
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg text-sm"
          >
            {filtered.slice(0, 100).map((c, i) => {
              const active = i === activeIndex;
              return (
                <li
                  id={`${listboxId}-opt-${i}`}
                  key={c}
                  role="option"
                  aria-selected={active}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    commitValue(c);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={
                    'cursor-pointer px-3 py-1 ' +
                    (active
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-blue-100 dark:hover:bg-gray-700')
                  }
                >
                  {c}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <p id={inputId + '-err'} className="text-xs text-red-600 min-h-4">
        {error || ''}
      </p>
    </div>
  );
}
