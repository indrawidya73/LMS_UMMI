// Utility untuk export data ke Excel (CSV/XLS) dan PDF (via print window)

// ===== Helper: escape nilai untuk CSV =====
function escapeCSV(val: string | number): string {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// ===== Download file generik =====
function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob(['\uFEFF' + content], { type: mime + ';charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ===== Export ke Excel (.xls) dgn format HTML table agar mendukung styling & merge =====
export function exportToExcel(opts: {
  filename: string;
  title?: string;
  subtitle?: string[];
  headerRows: string[][]; // baris header (bisa lebih dari 1)
  rows: (string | number)[][];
  colSpans?: Record<string, number>; // opsional
}) {
  const { filename, title, subtitle, headerRows, rows } = opts;

  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
  html += `<head><meta charset="UTF-8"><style>
    table { border-collapse: collapse; }
    td, th { border: 1px solid #444; padding: 4px 8px; font-size: 12px; font-family: Arial, sans-serif; }
    th { background: #166534; color: #fff; font-weight: bold; text-align: center; }
    .title { font-size: 16px; font-weight: bold; text-align: center; }
    .subtitle { font-size: 12px; text-align: center; }
  </style></head><body>`;

  if (title) html += `<div class="title">${title}</div>`;
  if (subtitle) subtitle.forEach(s => { html += `<div class="subtitle">${s}</div>`; });
  html += `<br/>`;

  html += `<table>`;
  headerRows.forEach(hr => {
    html += `<tr>`;
    hr.forEach(cell => { html += `<th>${cell}</th>`; });
    html += `</tr>`;
  });
  rows.forEach(r => {
    html += `<tr>`;
    r.forEach(cell => { html += `<td>${cell ?? ''}</td>`; });
    html += `</tr>`;
  });
  html += `</table></body></html>`;

  downloadBlob(html, filename.endsWith('.xls') ? filename : `${filename}.xls`, 'application/vnd.ms-excel');
}

// ===== Export ke CSV =====
export function exportToCSV(opts: {
  filename: string;
  headerRows: string[][];
  rows: (string | number)[][];
}) {
  const { filename, headerRows, rows } = opts;
  const lines: string[] = [];
  headerRows.forEach(hr => lines.push(hr.map(escapeCSV).join(',')));
  rows.forEach(r => lines.push(r.map(escapeCSV).join(',')));
  downloadBlob(lines.join('\n'), filename.endsWith('.csv') ? filename : `${filename}.csv`, 'text/csv');
}

// ===== Export ke PDF via jendela cetak (user pilih Save as PDF) =====
export function exportToPDF(opts: {
  title: string;
  subtitle?: string[];
  htmlContent: string; // konten tabel/HTML
  landscape?: boolean;
}) {
  const { title, subtitle, htmlContent, landscape } = opts;
  const win = window.open('', '_blank', 'width=1000,height=700');
  if (!win) {
    alert('Mohon izinkan pop-up untuk mengunduh PDF.');
    return;
  }
  win.document.write(`
    <!doctype html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <title>${title}</title>
      <style>
        @page { size: A4 ${landscape ? 'landscape' : 'portrait'}; margin: 10mm; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
        body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; margin: 0; padding: 16px; }
        h1 { font-size: 18px; text-align: center; margin: 0 0 4px; }
        .sub { font-size: 12px; text-align: center; color: #444; margin: 0; }
        table { border-collapse: collapse; width: 100%; margin-top: 12px; }
        td, th { border: 1px solid #555; padding: 4px 6px; font-size: 11px; }
        th { background: #166534; color: #fff; text-align: center; }
        tr:nth-child(even) td { background: #f7faf8; }
        .total { background: #fef3c7 !important; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${(subtitle || []).map(s => `<p class="sub">${s}</p>`).join('')}
      ${htmlContent}
      <script>
        window.onload = function () {
          setTimeout(function () { window.print(); }, 300);
        };
      <\/script>
    </body>
    </html>
  `);
  win.document.close();
}

// ===== Bangun tabel HTML sederhana untuk PDF =====
export function buildHTMLTable(headerRows: string[][], rows: (string | number)[][], totalRowIndexes: number[] = []): string {
  let html = '<table><thead>';
  headerRows.forEach(hr => {
    html += '<tr>';
    hr.forEach(c => { html += `<th>${c}</th>`; });
    html += '</tr>';
  });
  html += '</thead><tbody>';
  rows.forEach((r, idx) => {
    const cls = totalRowIndexes.includes(idx) ? ' class="total"' : '';
    html += `<tr${cls}>`;
    r.forEach(c => { html += `<td>${c ?? ''}</td>`; });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}
