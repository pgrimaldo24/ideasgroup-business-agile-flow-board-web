import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { REPORT_REPOSITORY_PORT } from '@core/application/ports/report/report-repository.port';
import { ReportFile } from '@core/domain/models/report/report-file.model';
import { ReportFormat } from '@core/domain/models/report/report-format.model';

@Injectable({ providedIn: 'root' })
export class DownloadReportUseCase {
  private readonly repository = inject(REPORT_REPOSITORY_PORT);

  execute(projectId: string, format: ReportFormat): Observable<ReportFile> {
    return this.repository.download(projectId, format);
  }
}
