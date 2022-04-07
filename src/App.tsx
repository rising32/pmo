import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Account from './pages/account/Account';
import Deliverables from './pages/deliverables/Deliverables';
import Priorities from './pages/priorities/Priorities';
import Tasks from './pages/tasks/Tasks';
import Login from './pages/auth/Login';
import MainLayout from './containers/home/MainLayout';
import AccountContainer from './containers/account/AccountContainer';
import UserProfile from './pages/account/UserProfile';
import ManageClients from './pages/account/ManageClients';
import CompanyProfile from './pages/account/CompanyProfile';
import ManageTeam from './pages/account/ManageTeam';
import PrivateRoute from './lib/router/RequireAuth';
import ManageProject from './pages/account/ManageProject';
import ManageTask from './pages/account/ManageTask';
import Core from './containers/base/Core';
import SignUp from './pages/auth/SignUp';
import Statistics from './pages/statistics/Statistics';
import Terms from './pages/other/Terms';
import PriorityAgenda from './pages/priorities/PriorityAgenda';
import PrioritySupport from './pages/priorities/PrioritySupport';
import WorkSetting from './pages/account/WorkSetting';
import DeliverablesPicture from './pages/deliverables/DeliverablesPicture';
import RequireAuth from './lib/router/RequireAuth';
import AuthProvider, { useAuth } from './lib/context/AuthProvider';
import FileManager from './pages/deliverables/FileManager';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='' element={<Login />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<SignUp />} />
          <Route path='terms' element={<Terms />} />
          <Route
            path='tasks'
            element={
              <RequireAuth>
                <Tasks />
              </RequireAuth>
            }
          />
          <Route
            path='priorities'
            element={
              <RequireAuth>
                <Priorities />
              </RequireAuth>
            }
          />
          <Route
            path='priorities/agenda-:wp_id'
            element={
              <RequireAuth>
                <PriorityAgenda />
              </RequireAuth>
            }
          />
          <Route
            path='priorities/support'
            element={
              <RequireAuth>
                <PrioritySupport />
              </RequireAuth>
            }
          />
          <Route
            path='deliverables/'
            element={
              <RequireAuth>
                <Deliverables />
              </RequireAuth>
            }
          />
          <Route
            path='deliverables/camera'
            element={
              <RequireAuth>
                <DeliverablesPicture />
              </RequireAuth>
            }
          />
          <Route
            path='deliverables/file-manager'
            element={
              <RequireAuth>
                <FileManager />
              </RequireAuth>
            }
          />
          <Route
            path='statistics'
            element={
              <RequireAuth>
                <Statistics />
              </RequireAuth>
            }
          />
          <Route
            path='account/'
            element={
              <RequireAuth>
                <Account />
              </RequireAuth>
            }
          />
          <Route
            path='account/company-profile'
            element={
              <RequireAuth>
                <CompanyProfile />
              </RequireAuth>
            }
          />
          <Route
            path='account/work-setting'
            element={
              <RequireAuth>
                <WorkSetting />
              </RequireAuth>
            }
          />
          <Route
            path='account/manage-team'
            element={
              <RequireAuth>
                <ManageTeam />
              </RequireAuth>
            }
          />
          <Route
            path='account/manage-client'
            element={
              <RequireAuth>
                <ManageClients />
              </RequireAuth>
            }
          />
          <Route
            path='account/manage-project'
            element={
              <RequireAuth>
                <ManageProject />
              </RequireAuth>
            }
          />
          <Route
            path='account/manage-task'
            element={
              <RequireAuth>
                <ManageTask />
              </RequireAuth>
            }
          />
          <Route
            path='account/user-profile'
            element={
              <RequireAuth>
                <UserProfile />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
      <Core />
    </AuthProvider>
  );
}
export default App;
