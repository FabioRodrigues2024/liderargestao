import React, { useState } from 'react';
import { Plus, Trash2, FileText, Send, Download } from 'lucide-react';
import type { Quote } from '../../types/auth';
import { ProductSelectionModal } from './ProductSelectionModal';
import { ServiceSelectionModal } from './ServiceSelectionModal';
import { generateQuotePDF } from '../../utils/generateQuotePDF';
import { demoQuotes, demoProducts, demoServices, demoCompanyData } from '../../data/demoData';

interface QuoteItem {
  type: 'product' | 'service';
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>(demoQuotes);
  const [showForm, setShowForm] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [client, setClient] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
  });

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const newItems = [...items];
    newItems[index].quantity = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quote: Quote = {
      id: crypto.randomUUID(),
      companyId: 'current-company-id',
      clientId: client.id || crypto.randomUUID(),
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      items: items.map(item => ({
        type: item.type,
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      })),
      total: calculateTotal(),
      date: new Date().toISOString(),
      status: 'draft',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Orçamento válido por 30 dias.'
    };

    setQuotes([...quotes, quote]);
    setShowForm(false);
    setItems([]);
    setClient({ id: '', name: '', email: '', phone: '' });
  };

  const handleGeneratePDF = (quote: Quote) => {
    const doc = generateQuotePDF(quote, demoCompanyData);
    doc.save(`orcamento_${quote.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Orçamentos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Orçamento</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Novo Orçamento
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  required
                  value={client.name}
                  onChange={(e) => setClient({ ...client, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={client.email}
                  onChange={(e) => setClient({ ...client, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={client.phone}
                  onChange={(e) => setClient({ ...client, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Items Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium text-gray-700">Itens</h4>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(true)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                  >
                    Adicionar Produto
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowServiceModal(true)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                  >
                    Adicionar Serviço
                  </button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Item
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Quantidade
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Preço Unit.
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          Nenhum item adicionado
                        </td>
                      </tr>
                    ) : (
                      items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.type === 'product' ? 'Produto' : 'Serviço'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  index,
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-20 px-2 py-1 text-right border rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 text-right text-gray-900">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(item.price)}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-900">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(item.price * item.quantity)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                    {items.length > 0 && (
                      <tr className="bg-gray-50">
                        <td
                          colSpan={3}
                          className="px-6 py-4 text-right font-medium"
                        >
                          Total
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(calculateTotal())}
                        </td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setItems([]);
                  setClient({ id: '', name: '', email: '', phone: '' });
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salvar Orçamento
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quotes List */}
      <div className="bg-white rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Data
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Total
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nenhum orçamento cadastrado
                  </td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr key={quote.id} className="border-b last:border-0">
                    <td className="px-6 py-4 text-gray-900">
                      {quote.clientName}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(quote.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(quote.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          quote.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : quote.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : quote.status === 'sent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {quote.status === 'approved'
                          ? 'Aprovado'
                          : quote.status === 'rejected'
                          ? 'Rejeitado'
                          : quote.status === 'sent'
                          ? 'Enviado'
                          : 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleGeneratePDF(quote)}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="Gerar PDF"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600">
                          <FileText className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600">
                          <Send className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showProductModal && (
        <ProductSelectionModal
          onClose={() => setShowProductModal(false)}
          onSelect={(product) => {
            setItems([
              ...items,
              {
                type: 'product',
                id: product.id,
                name: product.name,
                quantity: 1,
                price: product.price,
              },
            ]);
            setShowProductModal(false);
          }}
          products={demoProducts}
        />
      )}

      {showServiceModal && (
        <ServiceSelectionModal
          onClose={() => setShowServiceModal(false)}
          onSelect={(service) => {
            setItems([
              ...items,
              {
                type: 'service',
                id: service.id,
                name: service.name,
                quantity: 1,
                price: service.price,
              },
            ]);
            setShowServiceModal(false);
          }}
          services={demoServices}
        />
      )}
    </div>
  );
}