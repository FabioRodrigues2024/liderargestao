import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error('Invalid or missing VITE_SUPABASE_URL. Must be a valid URL starting with http:// or https://');
}

if (!supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database initialization function
export const initializeDatabase = async () => {
  try {
    const { data: dbVersion, error: versionError } = await supabase
      .from('version')
      .select('*')
      .single();

    if (versionError && versionError.code === 'PGRST116') {
      // Tables don't exist yet, create them
      await createTables();
    } else if (versionError) {
      throw versionError;
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

// Create database tables
async function createTables() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS version (
      id SERIAL PRIMARY KEY,
      version TEXT NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS companies (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      cnpj TEXT UNIQUE NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      owner UUID REFERENCES auth.users(id),
      active BOOLEAN DEFAULT false,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      company_id UUID REFERENCES companies(id),
      amount DECIMAL NOT NULL,
      description TEXT,
      type TEXT CHECK (type IN ('INCOME', 'EXPENSE')),
      category TEXT,
      date TIMESTAMP WITH TIME ZONE,
      paid BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      company_id UUID REFERENCES companies(id),
      name TEXT NOT NULL,
      description TEXT,
      price DECIMAL NOT NULL,
      stock INTEGER DEFAULT 0,
      sku TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS services (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      company_id UUID REFERENCES companies(id),
      name TEXT NOT NULL,
      description TEXT,
      price DECIMAL NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      company_id UUID REFERENCES companies(id),
      name TEXT NOT NULL,
      document TEXT,
      email TEXT,
      phone TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS quotes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      company_id UUID REFERENCES companies(id),
      customer_id UUID REFERENCES customers(id),
      total DECIMAL NOT NULL,
      status TEXT DEFAULT 'draft',
      valid_until TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS quote_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      quote_id UUID REFERENCES quotes(id),
      product_id UUID REFERENCES products(id),
      service_id UUID REFERENCES services(id),
      quantity INTEGER NOT NULL,
      price DECIMAL NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const query of queries) {
    const { error } = await supabase.rpc('exec', { query });
    if (error) throw error;
  }

  // Insert initial version
  await supabase
    .from('version')
    .insert([{ version: '1.0.0' }]);
}