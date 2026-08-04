import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';

import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [DialogModule, ButtonComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {
  @Input({ transform: booleanAttribute }) visible = false;
  @Input() header = '';
  @Input() width = '32rem';
  @Input() confirmLabel = 'Guardar';
  @Input() cancelLabel = 'Cancelar';
  @Input({ transform: booleanAttribute }) confirmDisabled = false;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) hideFooter = false;

  @Output() readonly visibleChange = new EventEmitter<boolean>();
  @Output() readonly confirmed = new EventEmitter<void>();
  @Output() readonly cancelled = new EventEmitter<void>();

  protected close(): void {
    this.visibleChange.emit(false);
    this.cancelled.emit();
  }

  protected onVisibleChange(visible: boolean): void {
    this.visibleChange.emit(visible);

    if (!visible) {
      this.cancelled.emit();
    }
  }
}
