import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ReportRepositoryPort } from '@core/application/ports/report/report-repository.port';
import { ReportFile } from '@core/domain/models/report/report-file.model';
import { ReportFormat } from '@core/domain/models/report/report-format.model';
import { ApiClient } from '@core/infrastructure/http/api-client.service';

import { extractFileName } from './content-disposition.util';

@Injectable()
export class ReportHttpAdapter implements ReportRepositoryPort {
  private readonly api = inject(ApiClient);

  download(projectId: string, format: ReportFormat): Observable<ReportFile> {
    return this.api.getBlob(`projects/${projectId}/reports/${format}`).pipe(
      map((response) => ({
        blob: response.body as Blob,
        fileName: extractFileName(response.headers.get('Content-Disposition'), format)
      }))
    );
  }
}
