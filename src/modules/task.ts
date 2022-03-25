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