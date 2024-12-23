import React, { useState, useEffect } from 'react';
import { 
  Download,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { generateDREPDF } from '../utils/generateDREPDF';
import { generateRevenueReportPDF } from '../utils/generateRevenueReportPDF';
import { Transaction } from '../types';
import { demoTransactions } from '../data/demoData';

interface DREPeriod {
  startDate: string;
  endDate: string;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export function Reports() {
  const [drePeriod, setDrePeriod] = useState<DREPeriod>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [transactions] = useState<Transaction[]>(demoTransactions);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);

  useEffect(() => {
    // Calculate revenue for the last 12 months
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
        date: date
      };
    }).reverse();

    const revenueByMonth = last12Months.map(({ month, date }) => {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthRevenue = transactions
        .filter(t => 
          t.type === 'INCOME' &&
          t.category && t.category.toLowerCase().includes('receita') &&
          new Date(t.date) >= startOfMonth &&
          new Date(t.date) <= endOfMonth
        )
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month,
        revenue: monthRevenue
      };
    });

    setMonthlyRevenue(revenueByMonth);
  }, [transactions]);

  const calculateDREData = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const periodTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= start && date <= end;
    });

    const receitas = periodTransactions
      .filter(t => t.type === 'INCOME' && t.category && t.category.toLowerCase().includes('receita'))
      .reduce((acc, t) => {
        const categoria = t.category || 'Sem categoria';
        const existingCategory = acc.find(r => r.categoria === categoria);
        if (existingCategory) {
          existingCategory.valor += t.amount;
        } else {
          acc.push({ categoria, valor: t.amount });
        }
        return acc;
      }, [] as Array<{ categoria: string; valor: number }>);

    const custos = periodTransactions
      .filter(t => t.type === 'EXPENSE' && t.category && t.category.toLowerCase().includes('custo'))
      .reduce((acc, t) => {
        const categoria = t.category || 'Sem categoria';
        const existingCategory = acc.find(c => c.categoria === categoria);
        if (existingCategory) {
          existingCategory.valor += t.amount;
        } else {
          acc.push({ categoria, valor: t.amount });
        }
        return acc;
      }, [] as Array<{ categoria: string; valor: number }>);

    const despesas = periodTransactions
      .filter(t => t.type === 'EXPENSE' && (!t.category || !t.category.toLowerCase().includes('custo')))
      .reduce((acc, t) => {
        const categoria = t.category || 'Sem categoria';
        const existingCategory = acc.find(d => d.categoria === categoria);
        if (existingCategory) {
          existingCategory.valor += t.amount;
        } else {
          acc.push({ categoria, valor: t.amount });
        }
        return acc;
      }, [] as Array<{ categoria: string; valor: number }>);

    return {
      period: { startDate, endDate },
      receitas,
      custos,
      despesas
    };
  };

  const handleGenerateDRE = () => {
    const dreData = calculateDREData(drePeriod.startDate, drePeriod.endDate);
    const doc = generateDREPDF(dreData);
    doc.save(`dre_${drePeriod.startDate}_${drePeriod.endDate}.pdf`);
  };

  const handleGenerateRevenueReport = () => {
    const doc = generateRevenueReportPDF({ months: monthlyRevenue });
    doc.save('relatorio_faturamento.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Relatórios</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DRE Report */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              DRE - Demonstração do Resultado
            </h3>
            <TrendingUp className="h-6 w-6 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={drePeriod.startDate}
                  onChange={(e) => setDrePeriod({ ...drePeriod, startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data Final
                </label>
                <input
                  type="date"
                  value={drePeriod.endDate}
                  onChange={(e) => setDrePeriod({ ...drePeriod, endDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateDRE}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Gerar DRE
            </button>
          </div>
        </div>

        {/* Revenue Report */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Relatório de Faturamento
            </h3>
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Gere um relatório detalhado do faturamento dos últimos 12 meses.
            </p>

            <button
              onClick={handleGenerateRevenueReport}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Gerar Relatório de Faturamento
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Faturamento Mensal
        </h3>
        <div className="space-y-4">
          {monthlyRevenue.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.month}</span>
              <span className="text-sm font-medium text-gray-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(item.revenue)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}