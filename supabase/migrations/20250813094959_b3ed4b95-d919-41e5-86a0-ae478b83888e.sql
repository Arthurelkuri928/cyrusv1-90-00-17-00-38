
-- Primeiro, vamos limpar a tabela tools e inserir todas as ferramentas com os IDs corretos do frontend
DELETE FROM tools;

-- Inserir todas as ferramentas do frontend com os IDs e dados corretos
INSERT INTO tools (id, name, slug, is_active, is_maintenance, access_url, email, password, cookies, created_at, updated_at) VALUES
-- Design/Creation Tools
(1, 'Canva Pro', 'canva-pro', true, false, null, null, null, null, now(), now()),
(2, 'Adobe Stock', 'adobe-stock', true, false, null, null, null, null, now(), now()),
(3, 'Flaticon', 'flaticon', true, false, null, null, null, null, now(), now()),
(4, 'Envato Elements', 'envato-elements', true, false, null, null, null, null, now(), now()),
(5, 'Freepik', 'freepik', true, false, null, null, null, null, now(), now()),
(6, 'Storyblocks', 'storyblocks', true, false, null, null, null, null, now(), now()),
(7, 'CapCut Pro', 'capcut-pro', true, false, null, null, null, null, now(), now()),
(8, 'FreeLaHub', 'freelahub', true, false, null, null, null, null, now(), now()),
(9, 'LovePik', 'lovepik', true, false, null, null, null, null, now(), now()),
(10, 'Vectorizer', 'vectorizer', true, false, null, null, null, null, now(), now()),
(11, 'Epidemic Sound', 'epidemic-sound', true, false, null, null, null, null, now(), now()),

-- AI Tools
(12, 'ChatGPT 4.0', 'chatgpt', true, false, null, null, null, null, now(), now()),
(13, 'Midjourney', 'midjourney', true, false, null, null, null, null, now(), now()),
(14, 'Leonardo AI', 'leonardo-ai', true, false, null, null, null, null, now(), now()),
(15, 'Gamma App', 'gamma-app', true, false, null, null, null, null, now(), now()),
(16, 'HeyGen', 'heygen', true, false, null, null, null, null, now(), now()),
(17, 'ChatBot X', 'chatbot-x', false, true, null, null, null, null, now(), now()),
(18, 'Claude AI', 'claude-ai', true, false, null, null, null, null, now(), now()),
(19, 'Dreamface', 'dreamface', true, false, null, null, null, null, now(), now()),
(20, 'Grok', 'grok', true, false, null, null, null, null, now(), now()),
(21, 'CliCopy', 'clicopy', false, false, null, null, null, null, now(), now()),

-- Mining Tools
(23, 'Filtrify', 'filtrify', true, false, null, null, null, null, now(), now()),
(24, 'DropTool', 'droptool', true, false, null, null, null, null, now(), now()),
(25, 'Adminer', 'adminer', true, false, null, null, null, null, now(), now()),
(26, 'PipiAds', 'pipiads', true, false, null, null, null, null, now(), now()),

-- SEO Tools
(27, 'SEMrush', 'semrush', true, false, null, null, null, null, now(), now()),
(28, 'UberSuggest', 'ubersuggest', true, false, null, null, null, null, now(), now()),
(29, 'Similar Web', 'similar-web', true, false, null, null, null, null, now(), now()),
(30, 'AnswerThePublic', 'answer-the-public', true, false, null, null, null, null, now(), now()),

-- Espionagem Tools
(31, 'BigSpy', 'bigspy', true, false, null, null, null, null, now(), now()),
(32, 'SpyHero', 'spyhero', false, false, null, null, null, null, now(), now()),
(33, 'SpyGuru', 'spyguru', false, true, null, null, null, null, now(), now()),
(34, 'AdSparo', 'adsparo', true, false, null, null, null, null, now(), now()),
(35, 'SpyHorus', 'spyhorus', true, false, null, null, null, null, now(), now()),

-- Streaming
(36, 'Netflix Premium', 'netflix-premium', true, false, null, null, null, null, now(), now()),
(37, 'Disney+', 'disney-plus', true, false, null, null, null, null, now(), now()),
(38, 'Prime Video', 'prime-video', true, false, null, null, null, null, now(), now()),
(39, 'Crunchyroll', 'crunchyroll', true, false, null, null, null, null, now(), now()),
(40, 'Paramount+', 'paramount-plus', true, false, null, null, null, null, now(), now()),

-- Diversos
(41, 'BlackRat', 'blackrat', true, false, null, null, null, null, now(), now());

-- Resetar a sequência do ID para que novos registros comecem do próximo ID disponível
SELECT setval('tools_id_seq', (SELECT MAX(id) FROM tools));
