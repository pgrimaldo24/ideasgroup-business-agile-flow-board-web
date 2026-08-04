import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MenuSection } from './menu-item.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMenuComponent {
  protected readonly sections: readonly MenuSection[] = [
    {
      title: 'Trabajo',
      items: [{ label: 'Proyectos', icon: 'pi pi-folder', route: '/projects' }]
    }
  ];
}
