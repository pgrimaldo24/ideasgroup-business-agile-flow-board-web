import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BoardSnapshot, ColumnRepositoryPort } from '@core/application/ports/board/column-repository.port';
import { BoardColumn } from '@core/domain/models/board/board-column.model';
import { ColumnDraft } from '@core/domain/models/board/column-draft.model';
import { ApiClient } from '@core/infrastructure/http/api-client.service';

import { BoardColumnDto } from './dto/board-column.dto';
import { CreateBoardColumnRequestDto } from './dto/create-board-column-request.dto';
import { toBoardColumn } from './mappers/board-column.mapper';
import { toKanbanTask } from './mappers/kanban-task.mapper';

@Injectable()
export class ColumnHttpAdapter implements ColumnRepositoryPort {
  private readonly api = inject(ApiClient);

  listByProject(projectId: string): Observable<BoardSnapshot> {
    return this.api.get<BoardColumnDto[]>(`projects/${projectId}/columns`).pipe(
      map((dtos) => ({
        columns: dtos.map(toBoardColumn),
        tasks: dtos.flatMap((dto) => (dto.tasks ?? []).map(toKanbanTask))
      }))
    );
  }

  create(projectId: string, draft: ColumnDraft): Observable<BoardColumn> {
    const body: CreateBoardColumnRequestDto = { name: draft.name };

    return this.api
      .post<BoardColumnDto, CreateBoardColumnRequestDto>(`projects/${projectId}/columns`, body)
      .pipe(map(toBoardColumn));
  }
}
