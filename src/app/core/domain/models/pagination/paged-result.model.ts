export interface PagedResult<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalCount: number;
}

export interface PageQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly name: string;
}
