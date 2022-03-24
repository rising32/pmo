import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { AccountState, accountState } from '../../modules/user';

function PrivateRoute(): JSX.Element {
  const account = useRecoilValue<AccountState | null>(accountState);
  const location = useLocation();
  if (!account?.login_id) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export default PrivateRoute;
