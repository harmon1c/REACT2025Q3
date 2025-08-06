import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/Layout';
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
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body>
        <ErrorBoundary locale={locale}>
          <NextIntlClientProvider messages={messages}>
            <ReduxProvider>
              <ThemeProvider>
                <Layout>{children}</Layout>
              </ThemeProvider>
            </ReduxProvider>
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
