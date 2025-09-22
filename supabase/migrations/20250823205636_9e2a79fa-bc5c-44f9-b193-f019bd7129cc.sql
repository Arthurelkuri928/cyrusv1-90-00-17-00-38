-- Adicionar dados de exemplo para o usuário atual (9582dcd0-ad59-445b-848d-f5aa935e2c74)
INSERT INTO public.affiliate_sales (user_id, order_id, product_name, amount, commission_amount, status, sale_date) VALUES
('9582dcd0-ad59-445b-848d-f5aa935e2c74', 'ORD-2024-101', 'Plano Premium Mensal', 297.00, 59.40, 'paid', '2024-01-15T10:30:00Z'),
('9582dcd0-ad59-445b-848d-f5aa935e2c74', 'ORD-2024-102', 'Plano Premium Anual', 2970.00, 594.00, 'paid', '2024-01-20T14:22:00Z'),
('9582dcd0-ad59-445b-848d-f5aa935e2c74', 'ORD-2024-103', 'Plano Básico Mensal', 97.00, 19.40, 'pending', '2024-01-25T09:15:00Z');