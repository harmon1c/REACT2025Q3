import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { ReduxProvider } from './providers';
import '@/index.css';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<React.JSX.Element> {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>{children}</ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
