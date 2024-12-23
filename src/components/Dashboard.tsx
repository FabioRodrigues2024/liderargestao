import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        <div className="flex space-x-2">
          <select className="px-4 py-2 rounded-lg border bg-white">
            <option>Últimos 30 dias</option>
            <option>Este mês</option>
            <option>Este ano</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="flex items-center text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              12%
            </span>
          </div>
          <div>
            <p className="text-gray-600">Receitas</p>
            <h3 className="text-2xl font-bold text-gray-800">R$ 45.850,00</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <span className="flex items-center text-red-600">
              <ArrowDownRight className="h-4 w-4" />
              8%
            </span>
          </div>
          <div>
            <p className="text-gray-600">Despesas</p>
            <h3 className="text-2xl font-bold text-gray-800">R$ 32.150,00</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="flex items-center text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              15%
            </span>
          </div>
          <div>
            <p className="text-gray-600">Saldo</p>
            <h3 className="text-2xl font-bold text-gray-800">R$ 13.700,00</h3>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Transações Recentes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${i % 2 === 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                    {i % 2 === 0 ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {i % 2 === 0 ? 'Pagamento Fornecedor' : 'Recebimento Cliente'}
                    </p>
                    <p className="text-sm text-gray-500">Itaú - 15/03/2024</p>
                  </div>
                </div>
                <span className={`font-medium ${i % 2 === 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {i % 2 === 0 ? '-' : '+'}R$ {(Math.random() * 1000).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}