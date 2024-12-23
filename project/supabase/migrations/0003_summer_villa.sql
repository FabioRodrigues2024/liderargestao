/*
  # Business Tables Schema

  1. New Tables
    - customers (Customer information)
    - products (Product catalog)
    - services (Services catalog)
    - quotes (Sales quotes)
    - quote_items (Quote line items)

  2. Security
    - Enable RLS on all tables
    - Add policies for data isolation by company
*/

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  name VARCHAR(255) NOT NULL,
  document VARCHAR(18),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(9),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  code VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  cost DECIMAL(15,2),
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  unit VARCHAR(10),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  code VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  unit VARCHAR(10),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  customer_id UUID REFERENCES customers(id),
  quote_number VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  valid_until DATE,
  status VARCHAR(20) DEFAULT 'draft',
  subtotal DECIMAL(15,2) NOT NULL,
  discount DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote items
CREATE TABLE quote_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES quotes(id),
  product_id UUID REFERENCES products(id),
  service_id UUID REFERENCES services(id),
  description TEXT NOT NULL,
  quantity DECIMAL(15,2) NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  discount DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (
    (product_id IS NOT NULL AND service_id IS NULL) OR
    (product_id IS NULL AND service_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their company customers"
  ON customers FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can view their company products"
  ON products FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can view their company services"
  ON services FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can view their company quotes"
  ON quotes FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can view their company quote items"
  ON quote_items FOR SELECT
  USING (quote_id IN (
    SELECT id FROM quotes WHERE company_id IN (
      SELECT company_id FROM users WHERE auth_id = auth.uid()
    )
  ));