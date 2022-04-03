import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Account from './pages/account/Account';
import Deliverables from './pages/deliverables/Deliverables';
import Priorities from './pages/priorities/Priorities';
import Tasks from './pages/tasks/Tasks';
import Login from './pages/auth/Login';
import HomeContainer from './containers/home/HomeContainer';
import AccountContainer from './containers/account/AccountContainer';
import UserProfile from './pages/account/UserProfile';
import ManageClients from './pages/account/ManageClients';
import CompanyProfile from './pages/account/CompanyProfile';
import ManageTeam from './pages/account/ManageTeam';
import PrivateRoute from './lib/router/PrivateRoute';
import ManageProject from './pages/account/ManageProject';
import ManageTask from './pages/account/ManageTask';
import Core from './containers/base/Core';
import SignUp from './pages/auth/SignUp';
import Statistics from './pages/statistics/Statistics';
import Terms from './pages/other/Terms';
import useRequest from './lib/hooks/useRequest';
import { loginWithToken } from './lib/api';
import { useRecoilState } from 'recoil';
import { accountState, AccountState } from './modules/user';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PriorityContainer from './containers/priority/PriorityContainer';
import PriorityAgenda from './pages/priorities/PriorityAgenda';
import PrioritySupport from './pages/priorities/PrioritySupport';
import WorkSetting from './pages/account/WorkSetting';
import DeliverableContainer from './containers/deliverables/DeliverableContainer';
import DeliverablesPicture from './pages/deliverables/DeliverablesPicture';

function App(): JSX.Element {
  const [account, setAccount] = useRecoilState<AccountState | null>(accountState);
  // const [_loginWithToken, loading, loginWithTokenRes, loginWithTokenErr] = useRequest(loginWithToken);
  // const navigate = useNavigate();
  // React.useEffect(() => {
  //   const token = localStorage.getItem('user_token') || null;
  //   if (token) {
  //     _loginWithToken(token);
  //   }
  // }, []);
  // React.useEffect(() => {
  //   if (loginWithTokenRes && loginWithTokenRes.login_id) {
  //     localStorage.setItem('user_token', loginWithTokenRes.token);
  //     setAccount(loginWithTokenRes);
  //     toast.success('login successed!');
  //     navigate('/tasks');
  //   }
  // }, [loginWithTokenRes]);
  return (
    <>
      <Routes>
        <Route element={<HomeContainer />}>
          <Route path='' element={<Login />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path='tasks' element={<Tasks />} />
            <Route path='priorities/' element={<PriorityContainer />}>
              <Route path='' element={<Priorities />} />
              <Route path='agenda' element={<PriorityAgenda />} />
              <Route path='support' element={<PrioritySupport />} />
            </Route>
            <Route path='deliverables/' element={<DeliverableContainer />}>
              <Route path='' element={<Deliverables />} />
              <Route path='camera' element={<DeliverablesPicture />} />
            </Route>
            <Route path='statistics' element={<Statistics />} />
            <Route path='account/' element={<AccountContainer />}>
              <Route path='' element={<Account />} />
              <Route path='company-profile' element={<CompanyProfile />} />
              <Route path='work-setting' element={<WorkSetting />} />
              <Route path='manage-team' element={<ManageTeam />} />
              <Route path='manage-client' element={<ManageClients />} />
              <Route path='manage-project' element={<ManageProject />} />
              <Route path='manage-task' element={<ManageTask />} />
              <Route path='user-profile' element={<UserProfile />} />
            </Route>
            <Route path='terms' element={<Terms />} />
          </Route>
        </Route>
        <Route
          path='*'
          element={
            <main style={{ padding: '1rem' }}>
              <p>There&apos;s nothing here!</p>
            </main>
          }
        />
      </Routes>
      <Core />
    </>
  );
}
export default App;
