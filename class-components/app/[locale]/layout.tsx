import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/context/ThemeContext';
import { ReduxProvider } from './providers';
import '@/styles/globals.scss';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<React.JSX.Element> {
  const { locale } = await params; // Next.js 15 async params
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className="site-container min-h-screen flex flex-col overflow-x-hidden">
        <ErrorBoundary locale={locale}>
          <NextIntlClientProvider messages={messages}>
            <ReduxProvider>
              <ThemeProvider>
                <Header locale={locale} />
                <main className="w-screen flex-1 bg-white/80 dark:bg-blue-900/80 transition-colors duration-300">
                  {children}
                </main>
                <Footer />
              </ThemeProvider>
            </ReduxProvider>
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
