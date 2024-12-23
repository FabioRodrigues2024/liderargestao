import { Transaction, Product } from '../types';
import { Quote, Service, Customer } from '../types/auth';

type CompanyData = {
  razaoSocial: string;
  cnpj: string;
  email: string;
  whatsapp: string;
  socioNome: string;
  socioCpf: string;
  endereco: string;
  telefoneFixo: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  dataAbertura: string;
  regimeTributario: string;
  ramoAtividade: string;
  logo: string;
  contasBancarias: Array<{
    banco: string;
    agencia: string;
    conta: string;
    tipo: string;
  }>;
  contatos: Array<{
    nome: string;
    cargo: string;
    email: string;
    telefone: string;
  }>;
};

export const demoCompanyData: CompanyData = {
  razaoSocial: 'TechSolutions Brasil LTDA',
  cnpj: '12.345.678/0001-90',
  email: 'empresa@teste.com.br',
  whatsapp: '(11) 98765-4321',
  socioNome: 'Roberto Santos Silva',
  socioCpf: '123.456.789-00',
  endereco: 'Av. Paulista, 1000 - Bela Vista - São Paulo/SP - CEP 01310-100',
  telefoneFixo: '(11) 3456-7890',
  inscricaoEstadual: '123.456.789.110',
  inscricaoMunicipal: '1.234.567-8',
  dataAbertura: '2020-01-15',
  regimeTributario: 'Simples Nacional',
  ramoAtividade: 'Tecnologia da Informação',
  logo: '',
  contasBancarias: [
    {
      banco: 'Itaú',
      agencia: '1234',
      conta: '56789-0',
      tipo: 'Corrente'
    },
    {
      banco: 'Bradesco',
      agencia: '5678',
      conta: '12345-6',
      tipo: 'Corrente'
    }
  ],
  contatos: [
    {
      nome: 'Roberto Santos Silva',
      cargo: 'Diretor',
      email: 'roberto@teste.com.br',
      telefone: '(11) 98765-4321'
    },
    {
      nome: 'Maria Oliveira',
      cargo: 'Financeiro',
      email: 'maria@teste.com.br',
      telefone: '(11) 98765-4322'
    }
  ]
};

export const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Notebook Premium',
    description: 'Notebook com processador i7, 16GB RAM, SSD 512GB',
    price: 4500.00,
    stock: 10,
    sku: 'NOT-001'
  },
  {
    id: '2',
    name: 'Monitor 27"',
    description: 'Monitor LED 27" Full HD',
    price: 1200.00,
    stock: 15,
    sku: 'MON-001'
  }
];

const DEMO_COMPANY_ID = 'demo-company-id';

export const demoServices: Service[] = [
  {
    id: '1',
    name: 'Instalação e Configuração',
    description: 'Serviço de instalação e configuração de equipamentos',
    price: 250.00,
    companyId: DEMO_COMPANY_ID,
    active: true
  },
  {
    id: '2',
    name: 'Suporte Técnico',
    description: 'Suporte técnico mensal',
    price: 150.00,
    companyId: DEMO_COMPANY_ID,
    active: true
  }
];

export const demoCustomers: Customer[] = [
  {
    id: 'client-1',
    name: 'Cliente Exemplo LTDA',
    email: 'contato@clienteexemplo.com.br',
    phone: '(11) 98765-4321',
    document: '00.111.222/0001-33',
    socioNome: 'Maria Santos',
    socioCpf: '111.222.333-44'
  }
];

export const demoQuotes: Quote[] = [
  {
    id: '1',
    companyId: DEMO_COMPANY_ID,
    clientId: 'client-1',
    clientName: 'Cliente Exemplo LTDA',
    clientEmail: 'contato@clienteexemplo.com.br',
    clientPhone: '(11) 98765-4321',
    items: [
      {
        type: 'product',
        id: '1',
        quantity: 2,
        price: 4500.00,
        name: 'Notebook Premium'
      },
      {
        type: 'service',
        id: '1',
        quantity: 2,
        price: 250.00,
        name: 'Instalação e Configuração'
      }
    ],
    total: 9500.00,
    date: new Date().toISOString(),
    status: 'draft',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Orçamento válido por 30 dias.'
  }
];

/**
 * Gera uma data aleatória para um número específico de meses atrás
 * @param monthsAgo Número de meses atrás para gerar a data
 * @returns Data aleatória em formato ISO string
 */
const getRandomDate = (monthsAgo: number): string => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(Math.floor(Math.random() * 28) + 1); // Dia aleatório entre 1-28
  return date.toISOString();
};

export const demoTransactions: Transaction[] = [
  // Current Month
  {
    id: '1',
    date: getRandomDate(0),
    amount: 4500.00,
    description: 'Venda de Notebook - Cliente A',
    paymentMethod: 'TRANSFER',
    type: 'INCOME',
    bankId: '1',
    category: 'Receita de Vendas',
    paid: true
  },
  {
    id: '2',
    date: getRandomDate(0),
    amount: 1200.00,
    description: 'Venda de Monitor - Cliente B',
    paymentMethod: 'TRANSFER',
    type: 'INCOME',
    bankId: '1',
    category: 'Receita de Vendas',
    paid: true
  },
  {
    id: '3',
    date: getRandomDate(0),
    amount: 2500.00,
    description: 'Aluguel do Escritório',
    paymentMethod: 'TRANSFER',
    type: 'EXPENSE',
    bankId: '1',
    category: 'Aluguel',
    paid: true
  },

  // Last Month
  {
    id: '4',
    date: getRandomDate(1),
    amount: 3500.00,
    description: 'Serviços de Consultoria - Cliente C',
    paymentMethod: 'TRANSFER',
    type: 'INCOME',
    bankId: '2',
    category: 'Receita de Serviços',
    paid: true
  },
  {
    id: '5',
    date: getRandomDate(1),
    amount: 1500.00,
    description: 'Conta de Energia',
    paymentMethod: 'TRANSFER',
    type: 'EXPENSE',
    bankId: '1',
    category: 'Utilidades',
    paid: true
  },
  {
    id: '6',
    date: getRandomDate(1),
    amount: 800.00,
    description: 'Internet e Telefone',
    paymentMethod: 'TRANSFER',
    type: 'EXPENSE',
    bankId: '1',
    category: 'Utilidades',
    paid: true
  },

  // Two Months Ago
  {
    id: '7',
    date: getRandomDate(2),
    amount: 5500.00,
    description: 'Projeto de TI - Cliente D',
    paymentMethod: 'TRANSFER',
    type: 'INCOME',
    bankId: '1',
    category: 'Receita de Serviços',
    paid: true
  },
  {
    id: '8',
    date: getRandomDate(2),
    amount: 1200.00,
    description: 'Material de Escritório',
    paymentMethod: 'TRANSFER',
    type: 'EXPENSE',
    bankId: '1',
    category: 'Material de Escritório',
    paid: true
  },
  {
    id: '9',
    date: getRandomDate(2),
    amount: 3000.00,
    description: 'Marketing Digital',
    paymentMethod: 'TRANSFER',
    type: 'EXPENSE',
    bankId: '1',
    category: 'Marketing',
    paid: true
  },

  // Future Transactions (Upcoming)
  {
    id: '10',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    amount: 2500.00,
    description: 'Aluguel do Escritório',
    paymentMethod: 'TRANSFER',
    type: 'EXPENSE',
    bankId: '1',
    category: 'Aluguel',
    paid: false
  },
  {
    id: '11',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    amount: 6000.00,
    description: 'Projeto Website - Cliente E',
    paymentMethod: 'TRANSFER',
    type: 'INCOME',
    bankId: '1',
    category: 'Receita de Serviços',
    paid: false
  }
];