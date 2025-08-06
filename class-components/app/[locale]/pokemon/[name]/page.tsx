import { notFound } from 'next/navigation';
import { PokemonCatalogueContainer } from '@/components/PokemonCatalogueContainer';

interface PokemonPageProps {
  params: Promise<{ locale: string; name: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function PokemonPage({
  params,
  searchParams,
}: PokemonPageProps): Promise<React.JSX.Element> {
  const { name } = await params;
  await searchParams;

  if (!name) {
    notFound();
  }

  return <PokemonCatalogueContainer showDetailsPanel={true} />;
}
