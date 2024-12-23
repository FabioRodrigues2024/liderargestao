import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { UserOptions } from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface DREItem {
  categoria: string;
  valor: number;
}

interface DREData {
  period: {
    startDate: string;
    endDate: string;
  };
  receitas: DREItem[];
  custos: DREItem[];
  despesas: DREItem[];
}

export function generateDREPDF(data: DREData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // Title
  doc.setFontSize(16);
  doc.text('DEMONSTRAÇÃO DO RESULTADO DO EXERCÍCIO', pageWidth / 2, yPos, { align: 'center' });
  
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
  const startDate = new Date(data.period.startDate).toLocaleDateString();
  const endDate = new Date(data.period.endDate).toLocaleDateString();
  doc.text(`Período: ${startDate} a ${endDate}`, pageWidth / 2, yPos, { align: 'center' });

  // Calculate totals
  const totalReceitas = data.receitas.reduce((acc, item) => acc + item.valor, 0);
  const totalCustos = data.custos.reduce((acc, item) => acc + item.valor, 0);
  const totalDespesas = data.despesas.reduce((acc, item) => acc + item.valor, 0);
  const resultadoLiquido = totalReceitas - totalCustos - totalDespesas;

  // DRE Tables
  yPos += 15;

  // Receitas
  doc.autoTable({
    startY: yPos,
    head: [['RECEITAS', 'Valor']],
    body: [
      ...data.receitas.map(item => [
        item.categoria,
        `R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      ]),
      ['Total Receitas', `R$ ${totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
    styles: { fontSize: 10 },
    margin: { left: 20, right: 20 }
  });

  // Custos
  yPos = doc.lastAutoTable.finalY + 10;
  doc.autoTable({
    startY: yPos,
    head: [['CUSTOS', 'Valor']],
    body: [
      ...data.custos.map(item => [
        item.categoria,
        `R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      ]),
      ['Total Custos', `R$ ${totalCustos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
    styles: { fontSize: 10 },
    margin: { left: 20, right: 20 }
  });

  // Despesas
  yPos = doc.lastAutoTable.finalY + 10;
  doc.autoTable({
    startY: yPos,
    head: [['DESPESAS', 'Valor']],
    body: [
      ...data.despesas.map(item => [
        item.categoria,
        `R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      ]),
      ['Total Despesas', `R$ ${totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
    styles: { fontSize: 10 },
    margin: { left: 20, right: 20 }
  });

  // Resultado
  yPos = doc.lastAutoTable.finalY + 10;
  doc.autoTable({
    startY: yPos,
    body: [[
      'RESULTADO LÍQUIDO',
      `R$ ${resultadoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]],
    theme: 'grid',
    styles: { 
      fontSize: 11,
      fontStyle: 'bold',
      textColor: resultadoLiquido >= 0 ? [0, 128, 0] : [255, 0, 0],
      halign: 'left' 
    },
    margin: { left: 20, right: 20 }
  });

  // Signatures
  yPos = doc.lastAutoTable.finalY + 40;
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