import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { ReportFile } from '@core/domain/models/report/report-file.model';
import { ReportFormat } from '@core/domain/models/report/report-format.model';

export interface ReportRepositoryPort {
  download(projectId: string, format: ReportFormat): Observable<ReportFile>;
}

export const REPORT_REPOSITORY_PORT = new InjectionToken<ReportRepositoryPort>(
  'REPORT_REPOSITORY_PORT'
);
