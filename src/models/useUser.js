import { useState, useEffect } from 'react';
import { request } from 'umi';

const useUser = () => {
  const [userInfo, setUserInfo] = useState();

  const fetchUserInfo = async () => {
    const res = await request('./API/api/hospital/common/userinfo');
    sessionStorage.setItem('USER_INFO', JSON.stringify(res.data.user));
    setUserInfo(res.data);
    return res.data;
  };

  const clear = () => {
    setUserInfo();
  };

  useEffect(() => {
    let existUser = sessionStorage.getItem('USER_INFO');
    if (existUser) {
      existUser = JSON.parse(existUser);
      setUserInfo(existUser);
    }
  }, []);

  return {
    userInfo,
    fetchUserInfo,
    clear,
  };
};

export default useUser;
