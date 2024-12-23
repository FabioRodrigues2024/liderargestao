-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    owner UUID REFERENCES auth.users(id),
    active BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    accounting_cnpj TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Accountings
CREATE TABLE IF NOT EXISTS accountings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    owner UUID REFERENCES auth.users(id),
    active BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Rest of the tables remain the same...

-- Policies
CREATE POLICY "Companies are viewable by owner"
ON companies FOR SELECT
USING (auth.uid() = owner);

CREATE POLICY "Companies are insertable by owner"
ON companies FOR INSERT
WITH CHECK (auth.uid() = owner);

CREATE POLICY "Companies are updatable by owner"
ON companies FOR UPDATE
USING (auth.uid() = owner);

-- Accounting policies
CREATE POLICY "Accountings are viewable by owner"
ON accountings FOR SELECT
USING (auth.uid() = owner);

CREATE POLICY "Accountings can view their linked companies"
ON companies FOR SELECT
USING (
    accounting_cnpj IN (
        SELECT cnpj FROM accountings 
        WHERE owner = auth.uid()
    )
);

-- Function to handle company registration
CREATE OR REPLACE FUNCTION handle_new_company()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.companies (id, name, cnpj, email, owner, status)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'company_name',
        NEW.raw_user_meta_data->>'cnpj',
        NEW.email,
        NEW.id,
        'pending'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new company registrations
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    WHEN (NEW.raw_user_meta_data->>'type' = 'company')
    EXECUTE FUNCTION handle_new_company();