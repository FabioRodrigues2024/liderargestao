/*
  # Base Database Schema

  1. New Tables
    - companies (Base company information)
    - users (System users linked to companies)
    - accounting_firms (Accounting companies)
    - company_settings (Company-specific configurations)

  2. Security
    - Enable RLS on all tables
    - Add policies for data isolation by company
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  trading_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(9),
  tax_regime VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Accounting firms table
CREATE TABLE accounting_firms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  crc VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company settings table
CREATE TABLE company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  accounting_firm_id UUID REFERENCES accounting_firms(id),
  logo_url TEXT,
  primary_color VARCHAR(7),
  date_format VARCHAR(20),
  currency_format VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own company"
  ON companies FOR SELECT
  USING (id IN (
    SELECT company_id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can view their company users"
  ON users FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Accounting firms can view their client companies"
  ON companies FOR SELECT
  USING (id IN (
    SELECT company_id FROM company_settings 
    WHERE accounting_firm_id IN (
      SELECT id FROM accounting_firms 
      WHERE id IN (
        SELECT accounting_firm_id FROM users WHERE auth_id = auth.uid()
      )
    )
  ));