export interface DeliverableState {
  deliverable_id?: number | null;
  user_id: number;
  deliverable_name: string;
  task_id: number;
  periority_id: number | null;
  budget: number;
  planned_end_date: string;
  end_date: Date | null;
  is_completed: boolean;
}
