import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppMenuComponent } from '@layout/app-menu/app-menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppMenuComponent],
  templateUrl: './app-sidebar.component.html',
  styleUrl: './app-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppSidebarComponent {}
