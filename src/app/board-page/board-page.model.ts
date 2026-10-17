import { TaskCardVm } from '../task-card/task-card.model';

export interface BoardColumnVm {
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  label: string;
  tasks: TaskCardVm[];
}
