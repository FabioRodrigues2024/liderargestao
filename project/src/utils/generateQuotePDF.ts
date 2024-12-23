import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

// Certifique-se de que o tipo Quote está corretamente importado ou definido
import { Quote } from '../types/auth';

interface CompanyData {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  logo?: string;
}

// Adicione esta declaração de módulo para incluir o método autoTable e a propriedade lastAutoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export function generateQuotePDF(quote: Quote, companyData: CompanyData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // Add logo if exists
  if (companyData.logo) {
    doc.addImage(companyData.logo, 'PNG', 20, yPos, 40, 40);
    yPos += 45;
  }

  // Company header
  doc.setFontSize(16);
  doc.text(companyData.razaoSocial, 20, yPos);
  doc.setFontSize(10);
  doc.text(`CNPJ: ${companyData.cnpj}`, 20, yPos + 7);
  doc.text(companyData.endereco, 20, yPos + 14);

  // Quote number and date
  yPos += 25;
  doc.setFontSize(14);
  doc.text('ORÇAMENTO', pageWidth / 2, yPos, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Data: ${new Date(quote.date).toLocaleDateString()}`, pageWidth - 20, yPos, { align: 'right' });

  // Client information
  yPos += 15;
  doc.setFontSize(12);
  doc.text('Dados do Cliente', 20, yPos);
  doc.setFontSize(10);
  yPos += 7;
  doc.text(`Nome: ${quote.clientName}`, 20, yPos);
  yPos += 7;
  doc.text(`Email: ${quote.clientEmail}`, 20, yPos);
  yPos += 7;
  doc.text(`Telefone: ${quote.clientPhone}`, 20, yPos);

  // Items table
  yPos += 15;
  const tableColumns = ['Item', 'Qtd', 'Valor Unit.', 'Total'];
  const tableRows = quote.items.map(item => [
    item.name,
    item.quantity.toString(),
    `R$ ${item.price.toFixed(2)}`,
    `R$ ${(item.quantity * item.price).toFixed(2)}`
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

  // Total
  yPos = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`Valor Total: R$ ${quote.total.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });

  // Notes
  if (quote.notes) {
    yPos += 15;
    doc.setFontSize(10);
    doc.text('Observações:', 20, yPos);
    yPos += 7;
    doc.text(quote.notes, 20, yPos);
  }

  // Validity
  yPos += 15;
  doc.text(`Validade: ${new Date(quote.validUntil).toLocaleDateString()}`, 20, yPos);

  // Signature
  yPos += 30;
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 5;
  doc.text('Assinatura do Cliente', pageWidth / 2, yPos, { align: 'center' });
  yPos += 7;
  doc.text('Data: ____/____/________', pageWidth / 2, yPos, { align: 'center' });

  return doc;
}