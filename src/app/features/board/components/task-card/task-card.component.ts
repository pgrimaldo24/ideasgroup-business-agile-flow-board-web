import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { KanbanTask } from '@core/domain/models/board/kanban-task.model';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { CardComponent } from '@shared/ui/card/card.component';
import { TagComponent } from '@shared/ui/tag/tag.component';

import { BoardMessages } from '../../board-messages';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [AvatarComponent, CardComponent, TagComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardComponent {
  @Input({ required: true }) task!: KanbanTask;

  @Output() readonly selected = new EventEmitter<KanbanTask>();

  protected readonly priorityLabel = BoardMessages.priorityLabel;
  protected readonly prioritySeverity = BoardMessages.prioritySeverity;
}
