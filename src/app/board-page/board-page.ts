import { Component, signal } from '@angular/core';

interface BoardColumn {
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  label: string;
  tasks: { id: string; title: string }[];
}

@Component({
  selector: 'app-board-page',
  styleUrl: './board-page.css',
  templateUrl: './board-page.html',
})
export class BoardPage {
  protected readonly columns = signal<BoardColumn[]>([
    {
      status: 'todo',
      label: 'To do',
      tasks: [
        { id: 't1', title: 'Write release notes' },
        { id: 't2', title: 'Fix login redirect' },
      ],
    },
    {
      status: 'in_progress',
      label: 'In progress',
      tasks: [{ id: 't3', title: 'Board drag and drop' }],
    },
    { status: 'in_review', label: 'In review', tasks: [] },
    {
      status: 'done',
      label: 'Done',
      tasks: [{ id: 't4', title: 'Set up project' }],
    },
  ]);
}
