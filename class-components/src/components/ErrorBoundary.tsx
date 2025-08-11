'use client';

import React, { Component, type ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  locale?: string;
}

interface Translations {
  title: string;
  message: string;
  tryAgain: string;
  goHome: string;
  supportMessage: string;
  errorDetails: string;
}

const getTranslations = (locale?: string): Translations => {
  const isRussian = locale === 'ru';

  return {
    title: isRussian
      ? 'Упс! Что-то пошло не так'
      : 'Oops! Something went wrong',
    message: isRussian
      ? 'Произошла неожиданная ошибка при рендеринге приложения. Не беспокойтесь, мы можем это исправить!'
      : "An unexpected error occurred while rendering the application. Don't worry, we can fix this!",
    tryAgain: isRussian ? 'Попробовать снова' : 'Try Again',
    goHome: isRussian ? 'На главную' : 'Go Home',
    supportMessage: isRussian
      ? 'Если эта проблема не устраняется, пожалуйста, обратитесь в службу поддержки.'
      : 'If this problem persists, please contact support.',
    errorDetails: isRussian
      ? 'Детали ошибки (нажмите для раскрытия)'
      : 'Error details (click to expand)',
  };
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('🚨 Error caught by ErrorBoundary:', error);
    console.error('📊 Error Info:', errorInfo);
    console.error('📍 Component Stack:', errorInfo.componentStack);
  }

  public override render(): React.ReactNode {
    if (this.state.hasError) {
      const t = getTranslations(this.props.locale);

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-red-200 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
            <div className="text-red-500 mb-6">
              <svg
                className="w-20 h-20 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                {t.title}
              </h2>
              <p className="text-gray-600 mb-4">{t.message}</p>
              {this.state.error && (
                <details className="mt-4 mb-6 text-left">
                  <summary className="cursor-pointer text-red-600 font-medium mb-2">
                    {t.errorDetails}
                  </summary>
                  <code className="block mt-2 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 whitespace-pre-wrap">
                    {this.state.error.message}
                  </code>
                </details>
              )}
            </div>
            <div className="space-y-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                🔄 {t.tryAgain}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
