import type { ApiError } from './types';

export class PokemonApiError extends Error {
  public status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'PokemonApiError';
    this.status = status;
  }
}

export const handleApiError = (response: Response): PokemonApiError => {
  const { status } = response;

  switch (status) {
    case 404:
      return new PokemonApiError(
        'Pokemon not found. Please check your search and try again.',
        404
      );
    case 400:
      return new PokemonApiError(
        'Request error (400). Please check your input and try again.',
        400
      );
    case 500:
      return new PokemonApiError(
        'Server error (500). Please try again later.',
        500
      );
    case 503:
      return new PokemonApiError(
        'Service unavailable (503). Please try again later.',
        503
      );
    default:
      return new PokemonApiError(
        `HTTP error ${status}. Please try again later.`,
        status
      );
  }
};

export const formatApiError = (error: unknown): ApiError => {
  if (error instanceof PokemonApiError) {
    return {
      message: error.message,
      ...(error.status !== undefined && { status: error.status }),
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred. Please try again.',
  };
};

export const getErrorMessage = (
  error: unknown,
  pokemonName?: string
): string => {
  if (error instanceof PokemonApiError && error.status === 404 && pokemonName) {
    return `Pokemon "${pokemonName}" not found. Please check your search and try again.`;
  }

  const apiError = formatApiError(error);
  return apiError.message;
};
