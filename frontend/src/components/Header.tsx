import React from 'react';
import BoxIcon from './BoxIcon';
import { getUserName } from '../utils/auth';

const Header: React.FC = () => {
  const userName = getUserName();

  return (
    <header className="bg-gray-800/50 backdrop-blur-lg border-b border-purple-500/20 text-white py-3 px-6">
      <div className="flex items-center justify-end gap-3">
        <span className="text-gray-300">
          Bienvenido, <span className="text-white font-medium">{userName}</span>
        </span>
        <BoxIcon type='solid' name='user-circle' color='#fff' size='md' />
      </div>
    </header>
  );
};

export default Header;