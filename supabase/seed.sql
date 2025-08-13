
-- courses table
INSERT INTO public.courses (id, title, description, image_url, created_at, updated_at)
VALUES
    ('1', 'Introdução ao Desenvolvimento Web', 'Aprenda os fundamentos do desenvolvimento web com HTML, CSS e JavaScript.', 'https://example.com/web_dev.jpg', NOW(), NOW()),
    ('2', 'Programação em Python para Iniciantes', 'Um curso completo para começar a programar em Python.', 'https://example.com/python.jpg', NOW(), NOW()),
    ('3', 'Design de UI/UX com Figma', 'Crie interfaces de usuário incríveis e experiências de usuário intuitivas.', 'https://example.com/ui_ux.jpg', NOW(), NOW());

-- lessons table
INSERT INTO public.lessons (id, title, content, lesson_type, video_url, quiz_data, created_at, updated_at)
VALUES
    ('101', 'HTML Básico', 'Conteúdo sobre tags HTML básicas.', 'text', NULL, NULL, NOW(), NOW()),
    ('102', 'CSS Essencial', 'Conteúdo sobre seletores CSS e estilização.', 'text', NULL, NULL, NOW(), NOW()),
    ('103', 'Introdução ao JavaScript', 'Conteúdo sobre variáveis e funções em JavaScript.', 'text', NULL, NULL, NOW(), NOW()),
    ('201', 'Primeiros Passos em Python', 'Conteúdo sobre sintaxe básica e tipos de dados em Python.', 'text', NULL, NULL, NOW(), NOW()),
    ('202', 'Estruturas de Controle', 'Conteúdo sobre condicionais e loops em Python.', 'text', NULL, NULL, NOW(), NOW()),
    ('301', 'Fundamentos do Figma', 'Conteúdo sobre a interface e ferramentas básicas do Figma.', 'text', NULL, NULL, NOW(), NOW());

-- course_lessons table (linking courses and lessons)
INSERT INTO public.course_lessons (course_id, lesson_id, lesson_order, created_at, updated_at)
VALUES
    ('1', '101', 1, NOW(), NOW()),
    ('1', '102', 2, NOW(), NOW()),
    ('1', '103', 3, NOW(), NOW()),
    ('2', '201', 1, NOW(), NOW()),
    ('2', '202', 2, NOW(), NOW()),
    ('3', '301', 1, NOW(), NOW());
