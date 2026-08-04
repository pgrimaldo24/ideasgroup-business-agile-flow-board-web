import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppSidebarComponent } from '@layout/app-sidebar/app-sidebar.component';
import { AppTopbarComponent } from '@layout/app-topbar/app-topbar.component';
import { LayoutService } from '@layout/layout.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, AppSidebarComponent, AppTopbarComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLayoutComponent {
  private readonly layout = inject(LayoutService);

  protected readonly isSidebarOpen = this.layout.isSidebarOpen;
}
