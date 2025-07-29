import React from 'react';
import { parsePokemonDetails } from '../utils/pokemonUtils';
import { useAppDispatch } from '../store/hooks';
import { addItem, removeItem } from '../store/selectedItemsSlice';
import { type ResultItem } from './Results';

interface CardProps {
  item: ResultItem;
  onPokemonClick?: ((pokemonName: string) => Promise<void>) | undefined;
  isSelected?: boolean;
  selectedPokemon?: ResultItem | null | undefined;
}

export function Card({
  item,
  onPokemonClick,
  isSelected,
}: CardProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleClick = async (e?: React.MouseEvent): Promise<void> => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const scrollPosition = window.scrollY;

    if (onPokemonClick) {
      await onPokemonClick(item.name);

      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({
            top: scrollPosition,
            behavior: 'instant',
          });
        }
      }, 10);
    }
  };

  const isListItem = (): boolean => {
    return item.description.includes('Click to view details');
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (e.target.checked) {
      dispatch(
        addItem({
          id: String(item.id),
          name: item.name,
          description: item.description,
          detailsUrl: undefined,
        })
      );
    } else {
      dispatch(removeItem(String(item.id)));
    }
  };

  const renderListItemCard = (): React.JSX.Element => {
    return (
      <div className="bg-white dark:bg-gray-900/90 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div
          className={`p-4 cursor-pointer transition-all duration-200 ${
            isSelected
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-l-4 border-l-blue-500 dark:border-l-blue-400'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          onClick={(e) => {
            e.preventDefault();
            void handleClick(e);
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              checked={!!isSelected}
              onChange={handleCheckboxChange}
              onClick={(e) => e.stopPropagation()}
              className="form-checkbox h-5 w-5 text-blue-600 mr-2"
              aria-label="Select Pokemon"
            />
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 rounded-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {capitalizeFirstLetter(item.name)[0]}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
                {capitalizeFirstLetter(item.name)}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Pokemon #{item.id}
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 leading-relaxed line-clamp-2">
            {item.description}
          </p>
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                void handleClick(e);
              }}
              className="px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500
                dark:from-blue-700 dark:to-purple-800 dark:hover:from-blue-800 dark:hover:to-purple-900"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailedView = (): React.JSX.Element => {
    const details = parsePokemonDetails(item.description);

    const abilities = details.find(
      (detail) => detail.label.toLowerCase() === 'abilities'
    );
    const otherDetails = details.filter(
      (detail) => detail.label.toLowerCase() !== 'abilities'
    );

    return (
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 rounded-lg shadow-md p-3 border border-blue-200 dark:border-blue-900 hover:shadow-lg transition-shadow duration-300">
        <div className="flex gap-4">
          <div className="flex items-center gap-3">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {capitalizeFirstLetter(item.name)[0]}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
                {capitalizeFirstLetter(item.name)}
              </h3>
              <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                Pokemon #{item.id}
              </span>
            </div>
            <div className="text-xl opacity-30 text-gray-400 dark:text-gray-600">
              ⚡
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {otherDetails.map((detail, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-md p-1.5 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-0.5">
                    {detail.label}
                  </p>
                  <p className="text-xs text-gray-800 dark:text-gray-100 font-medium">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>

            {abilities && (
              <div className="bg-white dark:bg-gray-800 rounded-md p-1.5 shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-0.5">
                  {abilities.label}
                </p>
                <p className="text-xs text-gray-800 dark:text-gray-100 font-medium">
                  {abilities.value}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isListItem()) {
    return renderListItemCard();
  }

  return renderDetailedView();
}
