export function mapErrorToMessage(e: unknown): string {
  if (e instanceof Error) {
    if (e.message === 'POKEMON_NOT_FOUND') {
      return 'pokemon.not_found';
    }
    return e.message;
  }
  if (typeof e === 'string') {
    return e;
  }
  return 'unknown_error';
}
