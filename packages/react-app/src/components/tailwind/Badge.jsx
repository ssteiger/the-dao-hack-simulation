import React from 'react';

export default function Badge({ color, children, className, onClick }) {
  if (color === 'blue') {
    return (
      <span className="relative inline-block px-3 py-1 text-blue-300 leading-tight">
        <span aria-hidden className="absolute inset-0 bg-blue-700 opacity-50 rounded-full" />
        <span className="relative">{children}</span>
      </span>
    );
  }

  if (color === 'green') {
    return (
      <span className="relative inline-block px-3 py-1 text-green-900 dark:text-green-300 leading-tight">
        <span aria-hidden className="absolute inset-0 bg-green-200 dark:bg-green-700 dark:opacity-50 rounded-full" />
        <span className="relative">{children}</span>
      </span>
    );
  }

  if (color === 'red') {
    return (
      <span className="relative inline-block px-3 py-1 text-red-300 leading-tight">
        <span aria-hidden className="absolute inset-0 bg-red-700 opacity-50 rounded-full" />
        <span className="relative">{children}</span>
      </span>
    );
  }

  // default 'gray'
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-white">
      {children}
    </span>
  );
}
