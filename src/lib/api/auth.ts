import { ClientState, UserClientState } from '../../modules/client';
import { DateTimeCurrencyType } from '../../modules/dateTimeCurrency';
import { TaskState } from '../../modules/task';
import { TeamMemberState } from '../../modules/team';
import { AccountState, UserState } from '../../modules/user';
import apiClient from './apiClient';

export const sendAuthEmailPassword = (email: string, password: string) =>
  apiClient.post<AccountState>('/user/login', {
    email,
    password,
  });
export const loginWithToken = (token: string) => apiClient.post<AccountState>('/user/login/token', { token });

export const sendSignUp = (email: string, phone_number: string, password: string, display_name: string) =>
  apiClient.post<AccountState>('/user/signUp', {
    email,
    phone_number,
    password,
    display_name,
  });

export const signOut = (user_id: number) => apiClient.post('/user/logout', { user_id });

export const sendUserProfileUpdate = (params: UserState) => apiClient.post<UserState>('/user/update', params);

export const sendDateTimeCurrencyCreate = (params: DateTimeCurrencyType) =>
  apiClient.post<DateTimeCurrencyType>('/user/create_date_time_currency', params);

export const sendDateTimeCurrencyUpdate = (params: DateTimeCurrencyType) =>
  apiClient.post<DateTimeCurrencyType>('/user/update_date_time_currency', params);
export const sendGetDateTimeCurrency = (user_id: number) =>
  apiClient.post<DateTimeCurrencyType>('/user/get_date_time_currency', { user_id });

export const sendCreateClient = (client_name: string, is_active: boolean) =>
  apiClient.post<ClientState>('/admin/create_client', { client_name, is_active });

export const sendRegisterMyClient = (user_id: number, client_id: number, is_active: boolean) =>
  apiClient.post<UserClientState>('/admin/regist_my_client', { user_id, client_id, is_active });

export const sendUpdateByClient = (params: ClientState) => apiClient.post<ClientState>('/admin/update_client', params);

export type UserClientListState = {
  user_id: number;
  clients: ClientState[];
};
export const sendGetMyClients = (user_id: number) => apiClient.post<UserClientListState>('/admin/get_my_clients', { user_id });

export interface ResponseTasks {
  task: TaskState[];
}
export interface ResponseTask {
  task: TaskState;
}
export const sendCreateTask = (params: TaskState) => apiClient.post<ResponseTask>('/project/task/create', params);
export const getUserTasks = (creator_id: number) => apiClient.post<ResponseTasks>('/project/task/get_user_tasks', { creator_id });
export const updateByTask = (params: TaskState) => apiClient.post<TaskState>('/project/task/update', params);

export const getUserAll = () => apiClient.get<UserState[]>('/user/all');

export interface ResponseMembers {
  owner_id: number;
  member: UserState[];
}
export const addMember = (params: TeamMemberState) => apiClient.post<TeamMemberState>('/team/add_member', params);
export const getTeamMembers = (owner_id: number) => apiClient.post<ResponseMembers>('/team/get_team_members', { owner_id });
