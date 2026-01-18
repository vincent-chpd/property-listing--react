import React from 'react';

const loading = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <h1>Loading</h1>
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default loading;
