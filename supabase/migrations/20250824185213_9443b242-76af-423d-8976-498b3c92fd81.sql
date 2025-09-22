
-- Criar tabela para armazenar candidaturas de afiliados
CREATE TABLE public.partnership_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  dados_audiencia TEXT NOT NULL,
  data_candidatura TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar índice para otimizar consultas por email
CREATE INDEX idx_partnership_applications_email ON public.partnership_applications(email);

-- Adicionar índice para otimizar consultas por data de candidatura
CREATE INDEX idx_partnership_applications_data_candidatura ON public.partnership_applications(data_candidatura);

-- Habilitar Row Level Security
ALTER TABLE public.partnership_applications ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir inserção pública (para o formulário de candidatura)
CREATE POLICY "Allow public insert of partnership applications" 
  ON public.partnership_applications 
  FOR INSERT 
  WITH CHECK (true);

-- Criar política para permitir que apenas admins vejam as candidaturas
CREATE POLICY "Admins can view all partnership applications" 
  ON public.partnership_applications 
  FOR SELECT 
  USING (is_admin(auth.uid()));

-- Criar trigger para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_partnership_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_partnership_applications_updated_at
  BEFORE UPDATE ON public.partnership_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_partnership_applications_updated_at();
