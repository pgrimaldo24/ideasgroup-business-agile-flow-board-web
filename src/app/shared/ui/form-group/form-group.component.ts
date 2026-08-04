import { ChangeDetectionStrategy, Component, Input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-form-group',
  standalone: true,
  imports: [],
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGroupComponent {
  @Input() legend = '';
  @Input() description = '';
  @Input({ transform: numberAttribute }) columns = 1;
}
