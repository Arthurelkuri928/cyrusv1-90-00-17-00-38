-- Criar tabela para candidaturas de parceria
CREATE TABLE public.partnership_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo text NOT NULL,
  whatsapp text NOT NULL,
  email_profissional text NOT NULL,
  numero_seguidores text NOT NULL,
  experiencia_afiliacao text NOT NULL,
  area_atuacao_principal text NOT NULL,
  plataforma text NOT NULL,
  motivo_parceria text NOT NULL,
  link_perfil_principal text NOT NULL,
  data_candidatura timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.partnership_applications ENABLE ROW LEVEL SECURITY;

-- Política para administradores visualizarem todas as candidaturas
CREATE POLICY "Admins can view all partnership applications" 
ON public.partnership_applications 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Política para inserção (permitir inserção pública para o formulário)
CREATE POLICY "Allow public insert of partnership applications" 
ON public.partnership_applications 
FOR INSERT 
WITH CHECK (true);

-- Política para atualização apenas por admins
CREATE POLICY "Admins can update partnership applications" 
ON public.partnership_applications 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Política para exclusão apenas por admins
CREATE POLICY "Admins can delete partnership applications" 
ON public.partnership_applications 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_partnership_applications_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_partnership_applications_updated_at
  BEFORE UPDATE ON public.partnership_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_partnership_applications_updated_at();

-- Criar índices para otimização
CREATE INDEX idx_partnership_applications_email ON public.partnership_applications(email_profissional);
CREATE INDEX idx_partnership_applications_status ON public.partnership_applications(status);
CREATE INDEX idx_partnership_applications_data_candidatura ON public.partnership_applications(data_candidatura DESC);