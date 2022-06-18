import React from 'react';

export default function DarkContainer({ children, className }) {
  return (
    <div className={`bg-white relative shadow rounded-lg mx-auto p-4 dark:bg-gray-900 ${className}`}>{children}</div>
  );
}
