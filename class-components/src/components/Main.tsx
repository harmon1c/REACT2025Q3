import React from 'react';

interface MainProps {
  children: React.ReactNode;
  panel?: boolean;
}

export const Main: React.FC<MainProps> = ({ children, panel = true }) => {
  return (
    <section className="pb-6 w-full">
      <div className="mx-auto w-full max-w-[1440px] px-4">
        {panel ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
};
