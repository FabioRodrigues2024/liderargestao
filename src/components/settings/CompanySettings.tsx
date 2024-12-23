import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface CompanySettingsProps {
  initialData?: any;
  onSave: (data: any) => void;
}

export function CompanySettings({ initialData, onSave }: CompanySettingsProps) {
  const [formData, setFormData] = useState({
    razaoSocial: initialData?.razaoSocial || '',
    cnpj: initialData?.cnpj || '',
    email: initialData?.email || '',
    whatsapp: initialData?.whatsapp || '',
    socioNome: initialData?.socioNome || '',
    socioCpf: initialData?.socioCpf || '',
    endereco: initialData?.endereco || '',
    telefoneFixo: initialData?.telefoneFixo || '',
    inscricaoEstadual: initialData?.inscricaoEstadual || '',
    inscricaoMunicipal: initialData?.inscricaoMunicipal || '',
    dataAbertura: initialData?.dataAbertura || '',
    regimeTributario: initialData?.regimeTributario || 'Simples Nacional',
    ramoAtividade: initialData?.ramoAtividade || '',
    accountingCnpj: initialData?.accountingCnpj || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Dados da Empresa</h2>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Save className="h-5 w-5" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Razão Social
              </label>
              <input
                type="text"
                value={formData.razaoSocial}
                onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CNPJ
              </label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Sócio
              </label>
              <input
                type="text"
                value={formData.socioNome}
                onChange={(e) => setFormData({ ...formData, socioNome: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CPF do Sócio
              </label>
              <input
                type="text"
                value={formData.socioCpf}
                onChange={(e) => setFormData({ ...formData, socioCpf: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Endereço
              </label>
              <input
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefone Fixo
              </label>
              <input
                type="tel"
                value={formData.telefoneFixo}
                onChange={(e) => setFormData({ ...formData, telefoneFixo: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Inscrição Estadual
              </label>
              <input
                type="text"
                value={formData.inscricaoEstadual}
                onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Inscrição Municipal
              </label>
              <input
                type="text"
                value={formData.inscricaoMunicipal}
                onChange={(e) => setFormData({ ...formData, inscricaoMunicipal: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data de Abertura
              </label>
              <input
                type="date"
                value={formData.dataAbertura}
                onChange={(e) => setFormData({ ...formData, dataAbertura: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Regime Tributário
              </label>
              <select
                value={formData.regimeTributario}
                onChange={(e) => setFormData({ ...formData, regimeTributario: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="Simples Nacional">Simples Nacional</option>
                <option value="Lucro Presumido">Lucro Presumido</option>
                <option value="Lucro Real">Lucro Real</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ramo de Atividade
              </label>
              <input
                type="text"
                value={formData.ramoAtividade}
                onChange={(e) => setFormData({ ...formData, ramoAtividade: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CNPJ da Contabilidade
              </label>
              <input
                type="text"
                value={formData.accountingCnpj}
                onChange={(e) => setFormData({ ...formData, accountingCnpj: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Digite o CNPJ da sua contabilidade"
              />
              <p className="mt-1 text-sm text-gray-500">
                Se você trabalha com uma contabilidade, informe o CNPJ dela para vincular o acesso
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}