import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
        Modern Todo App
      </h1>
      <p className="text-gray-600">Stay organized and boost your productivity</p>
    </div>
  );
};

export default Header;