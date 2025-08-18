import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageInput } from './ImageInput';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src: string; alt: string }): React.JSX.Element => (
    <span data-testid="mock-image" data-alt={props.alt} data-src={props.src} />
  ),
}));

vi.mock('../utils/fileToBase64', () => ({
  fileToBase64: (file: File): Promise<string> =>
    Promise.resolve('data:img/mock;base64,' + file.name),
}));

describe('ImageInput', () => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  function setup(
    extra: Partial<React.ComponentProps<typeof ImageInput>> = {}
  ): { onChange: ReturnType<typeof vi.fn> } {
    const onChange = vi.fn();
    const Wrapper = (): React.JSX.Element => {
      const initialVal: string | null =
        typeof extra.value === 'string' ? extra.value : null;
      const [val, setVal] = React.useState<string | null>(initialVal);
      return (
        <ImageInput
          {...extra}
          value={val}
          onChange={(v) => {
            setVal(v);
            onChange(v);
          }}
        />
      );
    };
    render(<Wrapper />);
    return { onChange };
  }

  function createFile(name: string, size: number, type: string): File {
    const blob = new Blob([new Uint8Array(size)], { type });
    return new File([blob], name, { type });
  }

  it('rejects file over size limit', async () => {
    const user = userEvent.setup();
    const { onChange } = setup({ maxSizeBytes: 10 });

    const file = createFile('big.png', 20, 'image/png');
    const inputEl = document.querySelector('input[type="file"]');
    expect(inputEl).not.toBeNull();
    if (inputEl instanceof HTMLInputElement) {
      await user.upload(inputEl, file);
    }

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /File too large/
    );
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('rejects unsupported file type', async () => {
    const user = userEvent.setup();
    setup({ accept: 'image/png' });
    const file = createFile('photo.jpg', 5, 'image/jpeg');
    const inputEl = document.querySelector('input[type="file"]');
    expect(inputEl).not.toBeNull();
    if (inputEl instanceof HTMLInputElement) {
      inputEl.removeAttribute('accept');
      await user.upload(inputEl, file);
    }
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /Unsupported file type/
    );
  });

  it('accepts valid image and allows removal', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    const file = createFile('ok.png', 5, 'image/png');
    const inputEl = document.querySelector('input[type="file"]');
    expect(inputEl).not.toBeNull();
    if (inputEl instanceof HTMLInputElement) {
      await user.upload(inputEl, file);
    }

    expect(await screen.findByTestId('mock-image')).toHaveAttribute(
      'data-alt',
      'avatar preview'
    );
    expect(onChange).toHaveBeenCalledWith(
      expect.stringContaining('data:img/mock;base64,ok.png')
    );

    const removeBtn = screen.getByRole('button', { name: /remove image/i });
    await user.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('shows drag highlight and accepts file via drop', async () => {
    const { onChange } = setup();
    const dropText = screen.getByText(/Drag & drop or click/i);
    const dropZone = dropText.closest('[role="button"]');
    expect(dropZone).not.toBeNull();
    if (!dropZone) {
      return;
    }

    fireEvent.dragOver(dropZone, {
      dataTransfer: { files: [] },
    });
    expect(dropZone.className).toMatch(/border-blue-500/);

    const file = createFile('drag.png', 5, 'image/png');
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    expect(await screen.findByTestId('mock-image')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(
      expect.stringContaining('data:img/mock;base64,drag.png')
    );
    expect(dropZone.className).not.toMatch(/border-blue-500/);
  });
});
