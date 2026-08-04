import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() heading = '';
  @Input({ transform: booleanAttribute }) interactive = false;
  @Input({ transform: booleanAttribute }) flat = false;
}
