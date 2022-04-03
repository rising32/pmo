export interface DeliverableState {
  deliverable_id?: number | null;
  deliverable_name: string;
  task_id: number;
  periority_id: number;
  budget: string;
  planned_end_date: Date;
  end_date: Date;
  is_completed: boolean;
}
