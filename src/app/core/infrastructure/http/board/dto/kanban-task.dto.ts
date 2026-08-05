export interface KanbanTaskDto {
  id: string;
  title: string;
  description: string;
  priority: string;
  assigneeName: string;
  columnId: string;
  position: number;
  createdAtUtc: string;
}
