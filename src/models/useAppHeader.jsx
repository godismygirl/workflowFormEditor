import { useState } from 'react';

const useAppHeader = () => {
  const [appIcon, setAppIcon] = useState({ name: '', hex: '' });
  const [appName, setAppName] = useState('');

  const update = ({ name, icon }) => {
    if (name) {
      setAppName(name);
    }

    if (icon) {
      setAppIcon(icon);
    }
  };

  const clear = () => {
    setAppIcon({ name: '', hex: '' });
    setAppName('');
  };

  return {
    name: appName,
    icon: appIcon,
    update,
    clear,
  };
};

export default useAppHeader;
