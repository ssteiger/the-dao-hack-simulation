import React from 'react';

export default function Button({ color, children, className, onClick }) {
  let colorClasses = '';

  if (color === 'blue') {
    colorClasses =
      'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-30 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800';
  }

  if (color === 'lightblue') {
    colorClasses =
      'bg-blue-100 text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-blue-500 focus-visible:ring-offset-2';
  }

  if (color === 'red') {
    colorClasses =
      'bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800';
  }

  return (
    <button
      onClick={onClick}
      className={`w-full px-5 py-2.5 font-medium text-sm text-center text-white rounded-md focus:ring-2 ${colorClasses} ${className}`}
    >
      {children}
    </button>
  );
}
