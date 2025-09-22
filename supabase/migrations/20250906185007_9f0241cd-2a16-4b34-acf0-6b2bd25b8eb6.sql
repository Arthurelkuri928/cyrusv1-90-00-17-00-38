
-- Garante índice único por slug (evita colisões)
create unique index if not exists pages_slug_unique on public.pages (slug);

-- Garante a página pública de afiliados (sem alterar is_visible caso já exista, mas atualiza o nome)
insert into public.pages (name, slug, is_visible)
values ('Afiliados (Público)', 'affiliates-public', true)
on conflict (slug) do update
  set name = excluded.name;

-- Garante a página de afiliados da área de membros (sem alterar is_visible caso já exista, mas atualiza o nome)
insert into public.pages (name, slug, is_visible)
values ('Afiliados (Área de Membros)', 'affiliates', true)
on conflict (slug) do update
  set name = excluded.name;
