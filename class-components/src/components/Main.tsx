import React from 'react';

interface MainProps {
  children: React.ReactNode;
}

export const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <div className="w-full py-8">
      <div className="w-full max-w-[1440px] mx-auto px-4">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 w-full p-8">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
