import { AccountState, UserState } from '../../modules/user';
import apiClient from './apiClient';

export const sendAuthEmailPassword = (email: string, password: string) =>
  apiClient.post<AccountState>('/user/login', {
    email,
    password,
  });

export const sendSignUp = (email: string, phone_number: string, password: string, display_name: string) =>
  apiClient.post<AccountState>('/user/signUp', {
    email,
    phone_number,
    password,
    display_name,
  });

export const signOut = (user_id: number) => apiClient.post('/user/logout', { user_id });

export const sendUserProfileUpdate = (params: UserState) => apiClient.post<UserState>('/user/update', params);

export type DateTimeCurrencyType = {
  dtc_id: number;
  user_id: number | undefined;
  date_format: string;
  time_format: string;
  currency: number;
  decimal_seperator: number;
};
export const sendDateTimeCurrencyCreate = (params: DateTimeCurrencyType) =>
  apiClient.post<DateTimeCurrencyType>('/user/create_date_time_currency', params);

export const sendDateTimeCurrencyUpdate = (params: DateTimeCurrencyType) =>
  apiClient.post<DateTimeCurrencyType>('/user/update_date_time_currency', params);
export const sendGetDateTimeCurrency = (user_id: number) =>
  apiClient.post<DateTimeCurrencyType>('/user/get_date_time_currency', { user_id });

export type ClientState = {
  client_id: number;
  client_name: string;
  is_active: number;
  client_address: string | null;
  client_detail: string | null;
};
export const sendCreateClient = (client_name: string, is_active: boolean) =>
  apiClient.post<ClientState>('/admin/create_client', { client_name, is_active });

export type UserClientState = {
  uc_id: number;
  user_id: number;
  client_id: number;
  is_active: boolean;
};
export const sendRegisterMyClient = (user_id: number, client_id: number, is_active: boolean) =>
  apiClient.post<UserClientState>('/admin/regist_my_client', { user_id, client_id, is_active });

export const sendUpdateByClient = (params: ClientState) => apiClient.post<ClientState>('/admin/update_client', params);

export type UserClientListState = {
  user_id: number;
  clients: ClientState[];
};
export const sendGetMyClients = (user_id: number) => apiClient.post<UserClientListState>('/admin/get_my_clients', { user_id });

export interface TaskState {
  task_id: number | null;
  creator_id: number;
  project_id: number | null;
  task_name: string;
  priority: number;
  description: string;
  planned_start_date: Date | null;
  planned_end_date: Date | null;
  actual_start_date: Date | null;
  actual_end_date: Date | null;
  hourly_rate: number;
  is_add_all: boolean;
  is_active: boolean;
}
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

export interface TeamMemberState {
  owner_id: number;
  member_id: number;
  role_id: number;
}
export interface ResponseMembers {
  owner_id: number;
  member: UserState[];
}
export const addMember = (params: TeamMemberState) => apiClient.post<TeamMemberState>('/team/add_member', params);
export const getTeamMembers = (owner_id: number) => apiClient.post<ResponseMembers>('/team/get_team_members', { owner_id });
