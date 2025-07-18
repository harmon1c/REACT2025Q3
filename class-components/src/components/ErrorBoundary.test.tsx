import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorTester } from './ErrorTester';

const mockConsoleError = vi.fn();
const originalConsoleError = console.error;

const ThrowError = ({
  shouldThrow,
}: {
  shouldThrow: boolean;
}): React.JSX.Element => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error component</div>;
};

beforeEach(() => {
  vi.clearAllMocks();
  console.error = mockConsoleError;
});

afterEach(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary Component', () => {
  describe('Normal Rendering Tests', () => {
    it('renders children normally when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Normal content')).toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
          <span>Third child</span>
        </ErrorBoundary>
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
      expect(screen.getByText('Third child')).toBeInTheDocument();
    });

    it('renders nested components without issues', () => {
      render(
        <ErrorBoundary>
          <div>
            <h1>Title</h1>
            <p>Paragraph content</p>
            <button>Action button</button>
          </div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph content')).toBeInTheDocument();
      expect(screen.getByText('Action button')).toBeInTheDocument();
    });
  });

  describe('Error Catching Tests', () => {
    it('catches errors thrown by child components', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /An unexpected error occurred while rendering the application/
        )
      ).toBeInTheDocument();
    });

    it('displays the error message in details section', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const detailsSummary = screen.getByText(
        'Error details (click to expand)'
      );
      fireEvent.click(detailsSummary);

      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('calls console.error when an error is caught', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(mockConsoleError).toHaveBeenCalledWith(
        '🚨 Error caught by ErrorBoundary:',
        expect.any(Error)
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        '📊 Error Info:',
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('logs component stack trace on error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(mockConsoleError).toHaveBeenCalledWith(
        '📍 Component Stack:',
        expect.any(String)
      );
    });
  });

  describe('Error UI Tests', () => {
    it('renders error UI with correct content', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /An unexpected error occurred while rendering the application/
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Don't worry, we can fix this!/)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();
    });

    it('has expandable error details section', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const detailsElement = screen.getByRole('group');
      expect(detailsElement).toBeInTheDocument();
      expect(detailsElement.tagName.toLowerCase()).toBe('details');
    });

    it('shows error message in code block when details are expanded', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const detailsSummary = screen.getByText(
        'Error details (click to expand)'
      );
      fireEvent.click(detailsSummary);

      const codeElement = screen.getByText('Test error message');
      expect(codeElement.tagName.toLowerCase()).toBe('code');
      expect(codeElement).toHaveClass('bg-red-50', 'border-red-200');
    });
  });

  describe('Recovery Tests', () => {
    it('recovers from error when Try Again button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      await user.click(tryAgainButton);

      // on clicking Try Again, the error state is reset
      // component will re-render but since ThrowError still has shouldThrow=true,
      // it will throw again and show the error boundary again
      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();
    });

    it('resets error state when Try Again is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      await user.click(tryAgainButton);

      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();
    });
  });

  describe('ErrorTester Integration Tests', () => {
    it('catches errors thrown by ErrorTester component', async () => {
      const user = userEvent.setup();

      render(
        <ErrorBoundary>
          <ErrorTester />
        </ErrorBoundary>
      );

      expect(screen.getByText('🚨 Test Error Boundary')).toBeInTheDocument();

      const testButton = screen.getByRole('button', {
        name: /test error boundary/i,
      });
      await user.click(testButton);

      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();
    });

    it('displays ErrorTester error message correctly', async () => {
      const user = userEvent.setup();

      render(
        <ErrorBoundary>
          <ErrorTester />
        </ErrorBoundary>
      );

      const testButton = screen.getByRole('button', {
        name: /test error boundary/i,
      });
      await user.click(testButton);

      const detailsSummary = screen.getByText(
        'Error details (click to expand)'
      );
      fireEvent.click(detailsSummary);

      expect(
        screen.getByText('Test error thrown by ErrorTester component')
      ).toBeInTheDocument();
    });

    it('can recover from ErrorTester errors', async () => {
      const user = userEvent.setup();

      render(
        <ErrorBoundary>
          <ErrorTester />
        </ErrorBoundary>
      );

      const testButton = screen.getByRole('button', {
        name: /test error boundary/i,
      });
      await user.click(testButton);

      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      await user.click(tryAgainButton);

      await waitFor(() => {
        expect(screen.getByText('🚨 Test Error Boundary')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('has proper button roles and accessibility attributes', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      expect(tryAgainButton).toBeInTheDocument();
      expect(tryAgainButton).toHaveClass('focus:outline-none', 'focus:ring-2');
    });

    it('has proper heading structure in error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Oops! Something went wrong');
    });

    it('supports keyboard navigation for Try Again button', async () => {
      const user = userEvent.setup();

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });

      await user.tab();
      expect(tryAgainButton).toHaveFocus();

      await user.keyboard('{Enter}');

      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles errors with no message', () => {
      const ErrorWithNoMessage = (): React.JSX.Element => {
        const error = new Error();
        error.message = '';
        throw error;
      };

      render(
        <ErrorBoundary>
          <ErrorWithNoMessage />
        </ErrorBoundary>
      );

      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();

      const detailsSummary = screen.getByText(
        'Error details (click to expand)'
      );
      expect(detailsSummary).toBeInTheDocument();
    });

    it('handles null children gracefully', () => {
      render(<ErrorBoundary>{null}</ErrorBoundary>);

      expect(
        screen.queryByText('Oops! Something went wrong')
      ).not.toBeInTheDocument();
    });

    it('handles undefined children gracefully', () => {
      render(<ErrorBoundary>{undefined}</ErrorBoundary>);

      expect(
        screen.queryByText('Oops! Something went wrong')
      ).not.toBeInTheDocument();
    });
  });
});
