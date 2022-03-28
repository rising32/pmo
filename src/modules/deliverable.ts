export interface DeliverableState {
  wp_id?: number | null;
  user_id: number;
  week: number;
  priority_num: number | null;
  goal: string;
  deliverable: string | null;
  detail: string | null;
  is_completed: number | null;
  is_weekly: null;
}
