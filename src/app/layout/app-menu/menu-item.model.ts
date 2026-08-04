export interface MenuItem {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
}

export interface MenuSection {
  readonly title: string;
  readonly items: readonly MenuItem[];
}
