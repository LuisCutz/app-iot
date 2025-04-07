import React, { useEffect, useRef } from 'react';
import 'boxicons';

interface BoxIconProps {
  type?: 'solid' | 'regular' | 'logo';
  name: string;
  color?: string;
  size?: string | number;
  [key: string]: any;
}

const BoxIcon: React.FC<BoxIconProps> = (props) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    // Asignar todas las props al elemento
    if (ref.current) {
      Object.entries(props).forEach(([key, value]) => {
        if (value !== undefined) {
          ref.current?.setAttribute(key, String(value));
        }
      });
    }
  }, [props]);

  return React.createElement('box-icon', { ref, ...props });
};

export default BoxIcon;