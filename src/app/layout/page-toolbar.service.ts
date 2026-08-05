import { Injectable, Signal, signal } from '@angular/core';

export interface PageToolbarHandlers {
  readonly searchPlaceholder: string;
  readonly createLabel: string;
  readonly createDisabled?: Signal<boolean>;
  onSearch(term: string): void;
  onCreate(): void;
}

@Injectable({ providedIn: 'root' })
export class PageToolbarService {
  private readonly handlersState = signal<PageToolbarHandlers | null>(null);

  readonly handlers = this.handlersState.asReadonly();

  register(handlers: PageToolbarHandlers): void {
    this.handlersState.set(handlers);
  }

  clear(handlers: PageToolbarHandlers): void {
    if (this.handlersState() === handlers) {
      this.handlersState.set(null);
    }
  }
}
