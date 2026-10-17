export interface TaskCardVm {
  id: string;
  title: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  assigneeInitials: string | null;
  dueLabel: string | null;
}
