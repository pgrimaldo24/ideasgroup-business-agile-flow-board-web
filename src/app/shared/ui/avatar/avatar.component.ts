import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

export type AvatarSize = 'small' | 'medium';

const PALETTE = ['#0c66e4', '#6554c0', '#e56910', '#22a06b', '#ae2e24', '#1d7afc'];

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  private readonly name = signal('');

  @Input({ required: true })
  set fullName(value: string) {
    this.name.set(value);
  }

  @Input() size: AvatarSize = 'small';

  protected readonly initials = computed(() => {
    const words = this.name().trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
      return '?';
    }

    const givenName = words[0].charAt(0);
    const surname = words.length > 1 ? words[1].charAt(0) : '';

    return `${givenName}${surname}`.toUpperCase();
  });

  protected readonly color = computed(() => {
    const name = this.name();
    let hash = 0;

    for (let index = 0; index < name.length; index++) {
      hash = name.charCodeAt(index) + ((hash << 5) - hash);
    }

    return PALETTE[Math.abs(hash) % PALETTE.length];
  });
}
