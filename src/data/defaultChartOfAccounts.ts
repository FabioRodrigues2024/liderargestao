export interface AccountItem {
  id: string;
  code: string;
  name: string;
  type: 'revenue' | 'expense';
  parentId?: string;
  children?: AccountItem[];
}

export const defaultChartOfAccounts: AccountItem[] = [
  {
    id: '1',
    code: '1',
    name: 'Receitas',
    type: 'revenue',
    children: [
      {
        id: '1.1',
        code: '1.1',
        name: 'Receita de Vendas',
        type: 'revenue',
        parentId: '1'
      },
      {
        id: '1.2',
        code: '1.2',
        name: 'Receita de Serviços',
        type: 'revenue',
        parentId: '1'
      },
      {
        id: '1.3',
        code: '1.3',
        name: 'Receitas Financeiras',
        type: 'revenue',
        parentId: '1'
      },
      {
        id: '1.4',
        code: '1.4',
        name: 'Outras Receitas',
        type: 'revenue',
        parentId: '1'
      }
    ]
  },
  {
    id: '2',
    code: '2',
    name: 'Despesas',
    type: 'expense',
    children: [
      {
        id: '2.1',
        code: '2.1',
        name: 'Custos de Produtos/Serviços Vendidos',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.2',
        code: '2.2',
        name: 'Salários e Encargos',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.3',
        code: '2.3',
        name: 'Aluguel',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.4',
        code: '2.4',
        name: 'Utilidades',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.5',
        code: '2.5',
        name: 'Material de Escritório',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.6',
        code: '2.6',
        name: 'Manutenção e Reparos',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.7',
        code: '2.7',
        name: 'Marketing e Publicidade',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.8',
        code: '2.8',
        name: 'Seguros',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.9',
        code: '2.9',
        name: 'Impostos e Taxas',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.10',
        code: '2.10',
        name: 'Despesas Financeiras',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.11',
        code: '2.11',
        name: 'Depreciação',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.12',
        code: '2.12',
        name: 'Viagens e Representação',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.13',
        code: '2.13',
        name: 'Treinamento e Desenvolvimento',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.14',
        code: '2.14',
        name: 'Serviços Profissionais',
        type: 'expense',
        parentId: '2'
      },
      {
        id: '2.15',
        code: '2.15',
        name: 'Despesas com Veículos',
        type: 'expense',
        parentId: '2'
      }
    ]
  }
];