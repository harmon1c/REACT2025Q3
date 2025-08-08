import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { fetchPokemonDetails } from '@/api/serverFetchers';
import { pokemonApi } from '@/api/pokemonApi';

interface HelperParams {
  params:
    | { locale: string; name: string }
    | Promise<{ locale: string; name: string }>;
}

export async function generateStaticParams(): Promise<Array<{ name: string }>> {
  const preload = ['pikachu', 'bulbasaur', 'charmander', 'squirtle', 'mew'];
  return preload.map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: HelperParams): Promise<Metadata> {
  const resolved = await params;
  const { name, locale } = resolved;
  try {
    const details = await fetchPokemonDetails({ nameOrId: name });
    const processed = pokemonApi.parsePokemonToProcessed(details);
    const t = await getTranslations({ locale, namespace: 'pokemon' });
    return {
      title: `${processed.name} | ${t('details')}`,
      description: processed.description,
      openGraph: {
        title: `${processed.name} | ${t('details')}`,
        description: processed.description,
        images: processed.image ? [{ url: processed.image }] : undefined,
      },
    };
  } catch {
    return { title: 'Pokemon Not Found' };
  }
}
