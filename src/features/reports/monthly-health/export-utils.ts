import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import type { MonthlyAttachmentTemplate } from '@/types/monthly-health-report';

export function exportAttachmentToExcel(template: MonthlyAttachmentTemplate, rows: Record<string, string | number | boolean | null>[]) {
  const data = [template.fields.map((f) => f.label), ...rows.map((row) => template.fields.map((f) => row[f.key] ?? ''))];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, template.code.replace(/\//g, '-').slice(0, 30));
  XLSX.writeFile(wb, `${template.code.replace(/\//g, '-')}.xlsx`);
}

export function exportAttachmentToPdf(template: MonthlyAttachmentTemplate, rows: Record<string, string | number | boolean | null>[]) {
  const pdf = new jsPDF({ orientation: 'landscape' });
  pdf.setFontSize(12);
  pdf.text(`Laporan Bulanan Satkes - ${template.code}`, 10, 12);
  pdf.setFontSize(10);
  pdf.text(template.title, 10, 18);

  let y = 26;
  pdf.text(template.fields.map((f) => f.label).join(' | '), 10, y);
  rows.slice(0, 20).forEach((row) => {
    y += 6;
    pdf.text(template.fields.map((f) => String(row[f.key] ?? '-')).join(' | '), 10, y, { maxWidth: 280 });
  });
  pdf.save(`${template.code.replace(/\//g, '-')}.pdf`);
}

export function exportNarrativeToPdf(title: string, sections: Record<string, string>) {
  const pdf = new jsPDF();
  pdf.setFontSize(13);
  pdf.text(title, 14, 14);
  let y = 24;
  Object.entries(sections).forEach(([key, value]) => {
    pdf.setFontSize(11);
    pdf.text(key.replace(/_/g, ' ').toUpperCase(), 14, y);
    y += 6;
    pdf.setFontSize(10);
    const lines = pdf.splitTextToSize(value || '-', 180);
    pdf.text(lines, 14, y);
    y += lines.length * 5 + 3;
    if (y > 270) {
      pdf.addPage();
      y = 20;
    }
  });
  pdf.save('laporan-naratif-bulanan-satkes.pdf');
}
