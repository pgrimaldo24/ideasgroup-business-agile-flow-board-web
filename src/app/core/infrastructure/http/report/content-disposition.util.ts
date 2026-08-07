import { ReportFormat } from '@core/domain/models/report/report-format.model';

export function extractFileName(header: string | null, fallbackFormat: ReportFormat): string {
  if (header) {
    const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(header);

    if (utf8Match) {
      return decodeURIComponent(utf8Match[1]);
    }

    const quotedMatch = /filename="?([^";]+)"?/i.exec(header);

    if (quotedMatch) {
      return quotedMatch[1];
    }
  }

  return `reporte.${fallbackFormat}`;
}
