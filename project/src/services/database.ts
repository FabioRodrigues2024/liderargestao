import { Company, Accounting } from '../types/auth';

// Simulating a simple database using localStorage
const DB_KEYS = {
  PENDING_COMPANIES: 'pending_companies',
  APPROVED_COMPANIES: 'approved_companies',
  PENDING_ACCOUNTINGS: 'pending_accountings',
  APPROVED_ACCOUNTINGS: 'approved_accountings'
};

// Initialize storage if empty
if (!localStorage.getItem(DB_KEYS.PENDING_COMPANIES)) {
  localStorage.setItem(DB_KEYS.PENDING_COMPANIES, '[]');
}
if (!localStorage.getItem(DB_KEYS.APPROVED_COMPANIES)) {
  localStorage.setItem(DB_KEYS.APPROVED_COMPANIES, '[]');
}
if (!localStorage.getItem(DB_KEYS.PENDING_ACCOUNTINGS)) {
  localStorage.setItem(DB_KEYS.PENDING_ACCOUNTINGS, '[]');
}
if (!localStorage.getItem(DB_KEYS.APPROVED_ACCOUNTINGS)) {
  localStorage.setItem(DB_KEYS.APPROVED_ACCOUNTINGS, '[]');
}

export const db = {
  // Company methods
  addPendingCompany: (company: Company) => {
    const companies = db.getPendingCompanies();
    companies.push({
      ...company,
      status: 'pending',
      active: false,
      createdAt: new Date()
    });
    localStorage.setItem(DB_KEYS.PENDING_COMPANIES, JSON.stringify(companies));
  },

  getPendingCompanies: (): Company[] => {
    const data = localStorage.getItem(DB_KEYS.PENDING_COMPANIES);
    return data ? JSON.parse(data) : [];
  },

  approveCompany: (companyId: string) => {
    const pendingCompanies = db.getPendingCompanies();
    const approvedCompanies = db.getApprovedCompanies();
    
    const companyIndex = pendingCompanies.findIndex(c => c.id === companyId);
    if (companyIndex !== -1) {
      const company = pendingCompanies[companyIndex];
      company.status = 'approved';
      company.active = true;
      approvedCompanies.push(company);
      pendingCompanies.splice(companyIndex, 1);
      
      localStorage.setItem(DB_KEYS.PENDING_COMPANIES, JSON.stringify(pendingCompanies));
      localStorage.setItem(DB_KEYS.APPROVED_COMPANIES, JSON.stringify(approvedCompanies));
    }
  },

  rejectCompany: (companyId: string) => {
    const pendingCompanies = db.getPendingCompanies();
    const companyIndex = pendingCompanies.findIndex(c => c.id === companyId);
    
    if (companyIndex !== -1) {
      pendingCompanies[companyIndex].status = 'rejected';
      pendingCompanies[companyIndex].active = false;
      localStorage.setItem(DB_KEYS.PENDING_COMPANIES, JSON.stringify(pendingCompanies));
    }
  },

  getApprovedCompanies: (): Company[] => {
    const data = localStorage.getItem(DB_KEYS.APPROVED_COMPANIES);
    return data ? JSON.parse(data) : [];
  },

  // Accounting methods
  addPendingAccounting: (accounting: Accounting) => {
    const accountings = db.getPendingAccountings();
    accountings.push({
      ...accounting,
      status: 'pending',
      active: false,
      createdAt: new Date()
    });
    localStorage.setItem(DB_KEYS.PENDING_ACCOUNTINGS, JSON.stringify(accountings));
  },

  getPendingAccountings: (): Accounting[] => {
    const data = localStorage.getItem(DB_KEYS.PENDING_ACCOUNTINGS);
    return data ? JSON.parse(data) : [];
  },

  approveAccounting: (accountingId: string) => {
    const pendingAccountings = db.getPendingAccountings();
    const approvedAccountings = db.getApprovedAccountings();
    
    const accountingIndex = pendingAccountings.findIndex(a => a.id === accountingId);
    if (accountingIndex !== -1) {
      const accounting = pendingAccountings[accountingIndex];
      accounting.status = 'approved';
      accounting.active = true;
      approvedAccountings.push(accounting);
      pendingAccountings.splice(accountingIndex, 1);
      
      localStorage.setItem(DB_KEYS.PENDING_ACCOUNTINGS, JSON.stringify(pendingAccountings));
      localStorage.setItem(DB_KEYS.APPROVED_ACCOUNTINGS, JSON.stringify(approvedAccountings));
    }
  },

  rejectAccounting: (accountingId: string) => {
    const pendingAccountings = db.getPendingAccountings();
    const accountingIndex = pendingAccountings.findIndex(a => a.id === accountingId);
    
    if (accountingIndex !== -1) {
      pendingAccountings[accountingIndex].status = 'rejected';
      pendingAccountings[accountingIndex].active = false;
      localStorage.setItem(DB_KEYS.PENDING_ACCOUNTINGS, JSON.stringify(pendingAccountings));
    }
  },

  getApprovedAccountings: (): Accounting[] => {
    const data = localStorage.getItem(DB_KEYS.APPROVED_ACCOUNTINGS);
    return data ? JSON.parse(data) : [];
  }
};