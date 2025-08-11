import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const supportedLocales = ['en', 'ru'];
  if (!locale || !supportedLocales.includes(locale)) {
    return {
      locale: 'en',
      messages: (await import(`./messages/en.json`)).default,
    };
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
