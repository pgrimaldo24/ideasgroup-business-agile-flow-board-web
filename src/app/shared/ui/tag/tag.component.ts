import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type TagSeverity = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {
  @Input({ required: true }) label = '';
  @Input() severity: TagSeverity = 'neutral';
  @Input() icon = '';
}
