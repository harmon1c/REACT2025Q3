/* eslint-disable react-refresh/only-export-components */
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { fetchPokemonDetails } from '@/api/serverFetchers';
import { pokemonApi } from '@/api/pokemonApi';
import { parsePokemonDetails, getLocalizedLabel } from '@/utils/pokemonUtils';

export async function generateStaticParams(): Promise<Array<{ name: string }>> {
  const preload = ['pikachu', 'bulbasaur', 'charmander', 'squirtle', 'mew'];
  return preload.map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
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

interface PageParams {
  params:
    | { locale: string; name: string }
    | Promise<{ locale: string; name: string }>;
}

export default async function PokemonDetailPage({
  params,
}: PageParams): Promise<React.JSX.Element> {
  const resolved = await params;
  const { name, locale } = resolved;
  try {
    const details = await fetchPokemonDetails({ nameOrId: name });
    const processed = pokemonApi.parsePokemonToProcessed(details);
    const t = await getTranslations({ locale, namespace: 'pokemon' });
    const parsedDetails = parsePokemonDetails(processed.description);
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{processed.name}</h1>
        <div className="flex items-center gap-6 mb-6">
          {processed.image && (
            <Image
              src={processed.image}
              alt={processed.name}
              width={128}
              height={128}
              className="w-32 h-32 object-contain drop-shadow"
              priority={false}
              sizes="128px"
            />
          )}
          <div className="space-y-2">
            {parsedDetails.map((d, i) => (
              <div key={i} className="text-sm flex gap-2">
                <span className="font-semibold text-blue-600 uppercase text-xs">
                  {getLocalizedLabel(d.label, (k) => t(k))}:
                </span>
                <span>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
        <a
          href={`/${locale}`}
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          {t('back_to_list')}
        </a>
      </div>
    );
  } catch (e) {
    if (e instanceof Error && e.message === 'POKEMON_NOT_FOUND') {
      notFound();
    }
    throw e;
  }
}
