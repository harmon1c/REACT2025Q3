import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
  };

  beforeEach((): void => {
    vi.clearAllMocks();
  });

  it('renders pagination with correct page numbers', (): void => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('highlights current page', (): void => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('bg-blue-500');
  });

  it('calls onPageChange when page is clicked', (): void => {
    render(<Pagination {...defaultProps} />);

    const pageButton = screen.getByText('3');
    fireEvent.click(pageButton);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
  });

  it('shows previous button when not on first page', (): void => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).not.toHaveClass('opacity-50');
  });

  it('disables previous button on first page', (): void => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('shows next button when not on last page', (): void => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).not.toHaveClass('opacity-50');
  });

  it('disables next button on last page', (): void => {
    render(<Pagination {...defaultProps} currentPage={5} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange for previous button', (): void => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    const prevButton = screen.getByText('Previous');
    fireEvent.click(prevButton);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange for next button', (): void => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(4);
  });

  it('does not render when totalPages is 1', (): void => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={1} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows ellipsis for large page ranges', (): void => {
    render(<Pagination {...defaultProps} totalPages={20} currentPage={10} />);

    const ellipsis = screen.getAllByText('...');
    expect(ellipsis).toHaveLength(2);
  });
});
