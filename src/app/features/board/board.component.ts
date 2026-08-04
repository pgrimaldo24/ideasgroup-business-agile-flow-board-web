import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  /** Llega desde el segmento `:projectId` de la ruta padre. */
  @Input() projectId = '';
}
