import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface RevenueData {
  months: Array<{
    month: string;
    revenue: number;
  }>;
}

export function generateRevenueReportPDF(data: RevenueData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // Title
  doc.setFontSize(16);
  doc.text('RELATÓRIO DE FATURAMENTO', pageWidth / 2, yPos, { align: 'center' });
  
  // Company Info
  yPos += 20;
  doc.setFontSize(12);
  doc.text('Empresa Demo LTDA', 20, yPos);
  doc.setFontSize(10);
  doc.text('CNPJ: 00.000.000/0001-00', 20, yPos + 7);
  doc.text('Endereço: Rua Exemplo, 123 - Centro', 20, yPos + 14);

  // Report Period
  yPos += 25;
  doc.setFontSize(11);
  const today = new Date();
  const period = `Período: ${new Date(today.getFullYear(), today.getMonth() - 11, 1).toLocaleDateString()} a ${today.toLocaleDateString()}`;
  doc.text(period, pageWidth / 2, yPos, { align: 'center' });

  // Revenue Table
  yPos += 15;
  const tableColumns = ['Competência', 'Faturamento'];
  const tableRows = data.months.map(item => [
    item.month,
    `R$ ${item.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  ]);

  doc.autoTable({
    startY: yPos,
    head: [tableColumns],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
    styles: { fontSize: 10 },
    margin: { left: 20, right: 20 }
  });

  // Calculate and add average
  const average = data.months.reduce((acc, curr) => acc + curr.revenue, 0) / data.months.length;
  yPos = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.text(`Média de Faturamento: R$ ${average.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPos);

  // Signatures
  yPos += 40;
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 5;
  doc.setFontSize(10);
  doc.text('Empresa Demo LTDA', pageWidth / 4, yPos, { align: 'center' });
  doc.text('Liderar Contabilidade', (pageWidth * 3) / 4, yPos, { align: 'center' });
  
  yPos += 7;
  doc.text('CNPJ: 00.000.000/0001-00', pageWidth / 4, yPos, { align: 'center' });
  doc.text('CNPJ: 13.636.911/0001-51', (pageWidth * 3) / 4, yPos, { align: 'center' });
  
  yPos += 7;
  doc.text('João da Silva', pageWidth / 4, yPos, { align: 'center' });
  doc.text('Maria Santos', (pageWidth * 3) / 4, yPos, { align: 'center' });
  
  yPos += 7;
  doc.text('Sócio Administrador', pageWidth / 4, yPos, { align: 'center' });
  doc.text('CRC SP-123456/O-0', (pageWidth * 3) / 4, yPos, { align: 'center' });

  return doc;
}