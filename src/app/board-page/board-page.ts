import { Component, signal } from '@angular/core';
import { BoardColumnVm } from './board-page.model';
import { TaskCard } from '../task-card/task-card';

@Component({
  selector: 'app-board-page',
  styleUrl: './board-page.css',
  templateUrl: './board-page.html',
  imports: [TaskCard],
})
export class BoardPage {
  protected readonly columns = signal<BoardColumnVm[]>([
    {
      status: 'todo',
      label: 'To do',
      tasks: [
        {
          id: 't1',
          title: 'Write release notes',
          priority: 'urgent',
          assigneeInitials: 'TH',
          dueLabel: 'Nov 1',
        },
        {
          id: 't2',
          title: 'Fix login redirect',
          priority: 'low',
          assigneeInitials: null,
          dueLabel: null,
        },
      ],
    },
    {
      status: 'in_progress',
      label: 'In progress',
      tasks: [
        {
          id: 't3',
          title: 'Board drag and drop',
          priority: 'normal',
          assigneeInitials: null,
          dueLabel: null,
        },
      ],
    },
    { status: 'in_review', label: 'In review', tasks: [] },
    {
      status: 'done',
      label: 'Done',
      tasks: [
        {
          id: 't4',
          title: 'Set up project',
          priority: 'high',
          assigneeInitials: 'HH',
          dueLabel: 'Dec 25',
        },
      ],
    },
  ]);

  protected onOpened(id: string): void {
    console.log('On Opened: ' + id);
  }
}
