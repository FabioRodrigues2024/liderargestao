/*
  # Data Export Function
  
  Creates a function to export all company data in JSON format
*/

CREATE OR REPLACE FUNCTION export_company_data(p_company_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Check if user has access to company
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE auth_id = auth.uid() 
    AND company_id = p_company_id
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT jsonb_build_object(
    'company', (SELECT row_to_json(c) FROM companies c WHERE id = p_company_id),
    'settings', (SELECT row_to_json(cs) FROM company_settings cs WHERE company_id = p_company_id),
    'chart_of_accounts', (SELECT jsonb_agg(row_to_json(coa)) FROM chart_of_accounts coa WHERE company_id = p_company_id),
    'bank_accounts', (SELECT jsonb_agg(row_to_json(ba)) FROM bank_accounts ba WHERE company_id = p_company_id),
    'payment_methods', (SELECT jsonb_agg(row_to_json(pm)) FROM payment_methods pm WHERE company_id = p_company_id),
    'categories', (SELECT jsonb_agg(row_to_json(cat)) FROM categories cat WHERE company_id = p_company_id),
    'transactions', (SELECT jsonb_agg(row_to_json(t)) FROM transactions t WHERE company_id = p_company_id),
    'customers', (SELECT jsonb_agg(row_to_json(cust)) FROM customers cust WHERE company_id = p_company_id),
    'products', (SELECT jsonb_agg(row_to_json(p)) FROM products p WHERE company_id = p_company_id),
    'services', (SELECT jsonb_agg(row_to_json(s)) FROM services s WHERE company_id = p_company_id),
    'quotes', (SELECT jsonb_agg(row_to_json(q)) FROM quotes q WHERE company_id = p_company_id),
    'quote_items', (
      SELECT jsonb_agg(row_to_json(qi)) 
      FROM quote_items qi 
      WHERE quote_id IN (SELECT id FROM quotes WHERE company_id = p_company_id)
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;