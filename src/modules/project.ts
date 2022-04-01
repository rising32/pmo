export type ProjectState = {
  project_id: number | null;
  creator_id: number;
  client_id: number | null;
  project_name: string;
  project_type?: number;
  planned_start_date: Date;
  planned_end_date: Date;
  actual_start_date: Date;
  actual_end_date: Date;
  description: string;
};

export interface WeekWorkDay {
  week: number;
  work_days: number;
}
export interface MonthWorkDay {
  week: number;
  work_days: number;
}

export interface StatisticState {
  client_id: number;
  client_name: string;
  realWorkdays: WeekWorkDay[] | MonthWorkDay[];
}

export interface ClientProjectState {
  cp_id: number | null;
  project_id: number;
  client_id: number;
}
