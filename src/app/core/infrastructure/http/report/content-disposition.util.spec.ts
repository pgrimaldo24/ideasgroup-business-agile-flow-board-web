import { extractFileName } from './content-disposition.util';

describe('extractFileName', () => {
  it('lee el nombre de archivo UTF-8 codificado', () => {
    const header = "attachment; filename*=UTF-8''reporte%20proyecto.pdf";

    expect(extractFileName(header, 'pdf')).toBe('reporte proyecto.pdf');
  });

  it('lee el nombre de archivo entre comillas', () => {
    const header = 'attachment; filename="reporte.xlsx"';

    expect(extractFileName(header, 'xlsx')).toBe('reporte.xlsx');
  });

  it('lee el nombre de archivo sin comillas', () => {
    const header = 'attachment; filename=reporte.pdf';

    expect(extractFileName(header, 'pdf')).toBe('reporte.pdf');
  });

  it('usa un nombre de reserva si no hay cabecera', () => {
    expect(extractFileName(null, 'pdf')).toBe('reporte.pdf');
  });

  it('usa un nombre de reserva según el formato si la cabecera no trae filename', () => {
    expect(extractFileName('attachment', 'xlsx')).toBe('reporte.xlsx');
  });
});
