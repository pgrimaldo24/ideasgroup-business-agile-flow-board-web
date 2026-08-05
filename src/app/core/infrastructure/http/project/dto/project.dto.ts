export interface ProjectDto {
  id: string;
  name: string;
  description: string;
  startDate: string;
  expectedEndDate: string;
  status: string;
}

export interface ProjectDtoPagedResultDto {
  items: ProjectDto[];
  page: number;
  pageSize: number;
  totalCount: number;
}
