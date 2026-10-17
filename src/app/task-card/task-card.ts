import { Component, input, output } from '@angular/core';
import { TaskCardVm } from './task-card.model';

@Component({
  imports: [],
  selector: 'app-task-card',
  styleUrl: './task-card.css',
  templateUrl: './task-card.html',
})
export class TaskCard {
  readonly task = input.required<TaskCardVm>();
  readonly opened = output<string>();

  protected onTaskClick() {
    this.opened.emit(this.task().id);
  }
}
