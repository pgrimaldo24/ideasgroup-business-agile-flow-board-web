import { BoardColumn } from '@core/domain/models/board/board-column.model';

import { BoardColumnDto } from '../dto/board-column.dto';

export function toBoardColumn(dto: BoardColumnDto): BoardColumn {
  return {
    id: dto.id,
    projectId: dto.projectId,
    name: dto.name,
    position: dto.position
  };
}
