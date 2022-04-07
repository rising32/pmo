import { ClientState, UserClientState } from '../../modules/client';
import { DateTimeCurrencyType } from '../../modules/dateTimeCurrency';
import { DeliverableState } from '../../modules/deliverable';
import { ClientProjectState, ProjectState, StatisticState } from '../../modules/project';
import { PriorityTaskState, TaskAssignState, TaskState } from '../../modules/task';
import { TeamMemberState } from '../../modules/team';
import { AccountState, UserState } from '../../modules/user';
import { PriorityState } from '../../modules/weekPriority';
import apiClient from './apiClient';

export const sendAuthEmailPassword = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    apiClient
      .post<AccountState>('/user/login', {
        email,
        password,
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log('error after post', err);
        reject(err);
      });
  });
};
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
export const sendDateTimeCurrency = (user_id: number) => apiClient.post<DateTimeCurrencyType>('/user/get_date_time_currency', { user_id });

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
export const sendSetClient = (client_id: number, project_id: number) =>
  apiClient.post<ClientProjectState>('/project/set_Client', { client_id, project_id });
export const getUserTasks = (creator_id: number) => apiClient.post<ResponseTasks>('/project/task/get_user_tasks', { creator_id });
export const sendTaskWithProjectId = (creator_id: number, project_id: number) =>
  apiClient.post<ResponseTasks>('/project/task/get_by_pna', { creator_id, project_id });
export const sendUpdateTask = (params: TaskState) => apiClient.post<TaskState>('/project/task/update', params);
export const sendAssignTask = (params: TaskAssignState) => apiClient.post<ResponseTask>('/project/task/assign', params);

export const getUserAll = () => apiClient.get<UserState[]>('/user/all');

export interface ResponseMembers {
  owner_id: number;
  member: UserState[];
}
export const addMember = (params: TeamMemberState) => apiClient.post<TeamMemberState>('/team/add_member', params);
export const getTeamMembers = (owner_id: number) => apiClient.post<ResponseMembers>('/team/get_team_members', { owner_id });

export const sendCreateProject = (params: ProjectState) => apiClient.post<ProjectState>('/project/create', params);

export interface ResponseProjectList {
  project: ProjectState[];
}
export const sendMyProject = (creator_id: number) => apiClient.post<ResponseProjectList>('/project/get_user_projects', { creator_id });
export const sendProjectWithClientId = (creator_id: number, client_id: number) =>
  apiClient.post<ResponseProjectList>('/project/get/client_no_assign', { creator_id, client_id });
export const sendUpdateByUser = (params: ProjectState) => apiClient.post<ProjectState>('/project/update', params);

export const sendWeekProduct = (user_id: number) =>
  apiClient.post<{ data: StatisticState[] }>('/project/get_real_workdays/week/client', { user_id });
export const sendMonthProduct = (user_id: number) =>
  apiClient.post<{ data: StatisticState[] }>('/project/get_real_workdays/month/client', { user_id });

export interface ResponsePriorityList {
  user_id: number;
  priority: PriorityState[];
}
export const sendPriorityByWeek = (user_id: number, week: number) =>
  apiClient.post<ResponsePriorityList>('/priority/get/userid/week', { user_id, week });

export const sendPriorityByBeforeWeek = (user_id: number, week: number) =>
  apiClient.post<ResponsePriorityList>('/priority/get/userid/week/before', { user_id, week });

export const sendNotCompletedPriorityByBeforeWeek = (user_id: number, week: number) =>
  apiClient.post<ResponsePriorityList>('/priority/get/userid/week/before/not_completed', { user_id, week });

export const sendCreatePriority = (params: PriorityState) => apiClient.post<PriorityState>('/priority/create', params);
export const sendUpdatePriority = (params: PriorityState) => apiClient.post<PriorityState>('/priority/update', params);

interface UCTPParams {
  member_id?: number;
  client_id?: number;
  project_id?: number;
  planned_end_date?: Date;
}
export interface ResponseUCTP {
  week: number;
  client_id: number;
  client_name: string;
  member_id: number;
  task: TaskState[];
}
export const sendUCTP = (params: UCTPParams) => apiClient.post<ResponseUCTP[]>('/project/task/get_ucpt', params);

export interface ResponseDeliverableList {
  user_id: number;
  deliverable: DeliverableState[];
}
export const sendTodayDeliverable = (user_id: number, planned_end_date: Date) =>
  apiClient.post<ResponseDeliverableList>('/project/deliverable/get/planned_end_date', { user_id, planned_end_date });

export const sendCreateDeliverable = (params: DeliverableState) => apiClient.post<DeliverableState>('/project/deliverable/create', params);
export const sendUpdateDeliverable = (params: DeliverableState) => apiClient.post<DeliverableState>('/project/deliverable/update', params);
