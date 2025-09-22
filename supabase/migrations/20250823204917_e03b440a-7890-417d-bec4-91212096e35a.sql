-- Create affiliate_sales table
CREATE TABLE public.affiliate_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'pending',
  sale_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.affiliate_sales ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own sales" 
ON public.affiliate_sales 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sales" 
ON public.affiliate_sales 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can create sales" 
ON public.affiliate_sales 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update sales" 
ON public.affiliate_sales 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_affiliate_sales_updated_at
BEFORE UPDATE ON public.affiliate_sales
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.affiliate_sales (user_id, order_id, product_name, amount, commission_amount, status, sale_date) VALUES
(gen_random_uuid(), 'ORD-2024-001', 'Plano Premium Mensal', 297.00, 59.40, 'paid', '2024-01-15T10:30:00Z'),
(gen_random_uuid(), 'ORD-2024-002', 'Plano Premium Anual', 2970.00, 594.00, 'paid', '2024-01-20T14:22:00Z'),
(gen_random_uuid(), 'ORD-2024-003', 'Plano Básico Mensal', 97.00, 19.40, 'pending', '2024-01-25T09:15:00Z'),
(gen_random_uuid(), 'ORD-2024-004', 'Plano Premium Mensal', 297.00, 59.40, 'paid', '2024-02-01T16:45:00Z'),
(gen_random_uuid(), 'ORD-2024-005', 'Plano Premium Anual', 2970.00, 594.00, 'processing', '2024-02-10T11:30:00Z');