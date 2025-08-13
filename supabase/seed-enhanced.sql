-- Enhanced seed data for better visualization
-- Clear existing data (for development only)
DELETE FROM user_progress;
DELETE FROM lessons;
DELETE FROM modules;
DELETE FROM courses;
DELETE FROM learning_paths;

-- Insert multiple learning paths
INSERT INTO learning_paths (id, title, description) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Desenvolvimento Web Fullstack', 'Aprenda a construir aplicações web completas do front-end ao back-end.'),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Blockchain e Web3', 'Domine o desenvolvimento de aplicações descentralizadas e smart contracts.'),
('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Data Science e IA', 'Aprenda análise de dados, machine learning e inteligência artificial.'),
('a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mobile Development', 'Desenvolvimento de aplicativos móveis para iOS e Android.');

-- Insert courses for Web Fullstack path
INSERT INTO courses (id, path_id, title, description, "order") VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Introdução ao React e TypeScript', 'Comece sua jornada com React e TypeScript para desenvolvimento moderno.', 1),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Node.js e APIs RESTful', 'Aprenda a criar APIs robustas com Node.js e Express.', 2),
('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Banco de Dados e ORMs', 'Domine PostgreSQL, MongoDB e ORMs como Prisma.', 3);

-- Insert courses for Blockchain path
INSERT INTO courses (id, path_id, title, description, "order") VALUES
('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Fundamentos de Blockchain', 'Entenda os conceitos básicos de blockchain e criptomoedas.', 1),
('b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Smart Contracts com Solidity', 'Aprenda a programar contratos inteligentes na Ethereum.', 2);

-- Insert modules for React course
INSERT INTO modules (id, course_id, title, "order") VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Fundamentos do React', 1),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TypeScript Avançado', 2),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Estado e Context API', 3);

-- Insert modules for Node.js course
INSERT INTO modules (id, course_id, title, "order") VALUES
('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Configuração do Ambiente', 1),
('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Express e Middleware', 2);

-- Insert modules for Blockchain course
INSERT INTO modules (id, course_id, title, "order") VALUES
('c5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'O que é Blockchain', 1),
('c6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Criptomoedas e Tokens', 2);

-- Lessons for React Module 1 (Fundamentos do React)
INSERT INTO lessons (id, module_id, title, content, lesson_type, "order", xp_value) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'O que é React?', 
'# O que é React?

React é uma biblioteca JavaScript para construir interfaces de usuário. É mantida pelo Facebook e uma comunidade de desenvolvedores individuais e empresas.

## Por que usar React?

- **Componentes:** Permite construir UIs complexas a partir de pequenas e isoladas peças de código.
- **Virtual DOM:** Otimiza a atualização da UI, tornando as aplicações rápidas.
- **Ecossistema:** Grande comunidade, muitas ferramentas e bibliotecas disponíveis.

## Exemplo Básico

```jsx
import React from ''react'';
import ReactDOM from ''react-dom'';

function Welcome(props) {
  return <h1>Olá, {props.name}!</h1>;
}

const element = <Welcome name="Mundo" />;
ReactDOM.render(element, document.getElementById(''root''));
```

Este é apenas o começo! Prepare-se para mergulhar fundo no mundo do React.', 'text', 1, 10),

('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Criando seu Primeiro Componente', 
'https://www.youtube.com/watch?v=SqcY0GlETPk', 'video', 2, 15),

('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Quiz: Componentes React', 
'[{"question": "O que é um componente React?", "options": ["Uma função que retorna JSX", "Uma classe que herda de Component", "Ambas as opções acima", "Apenas uma função JavaScript"], "correctAnswer": "Ambas as opções acima"}, {"question": "Qual é a vantagem do Virtual DOM?", "options": ["Facilita o debugging", "Melhora a performance", "Reduz o tamanho do bundle", "Simplifica o CSS"], "correctAnswer": "Melhora a performance"}]', 'quiz', 3, 20);

-- Lessons for React Module 2 (TypeScript Avançado)
INSERT INTO lessons (id, module_id, title, content, lesson_type, "order", xp_value) VALUES
('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Tipagem de Componentes', 
'# Tipagem de Componentes React

TypeScript traz benefícios enormes para o desenvolvimento React, especialmente na tipagem de props e estados.

## Tipando Props

```typescript
interface WelcomeProps {
  name: string;
  age?: number; // opcional
  isStudent: boolean;
}

function Welcome({ name, age, isStudent }: WelcomeProps) {
  return (
    <div>
      <h1>Olá, {name}!</h1>
      {age && <p>Você tem {age} anos</p>}
      {isStudent && <p>Você é estudante</p>}
    </div>
  );
}
```

## Componentes com Children

```typescript
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

function Container({ children, className }: ContainerProps) {
  return <div className={className}>{children}</div>;
}
```', 'text', 1, 15),

('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Hooks com TypeScript', 
'https://www.youtube.com/watch?v=TNhaISOUy6Q', 'video', 2, 20);

-- Lessons for Node.js Module 1
INSERT INTO lessons (id, module_id, title, content, lesson_type, "order", xp_value) VALUES
('e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Configurando Node.js', 
'# Configurando o Ambiente Node.js

Node.js é um runtime JavaScript que permite executar JavaScript no servidor.

## Instalação

1. Baixe o Node.js do site oficial
2. Instale seguindo as instruções do seu sistema operacional
3. Verifique a instalação:

```bash
node --version
npm --version
```

## Criando um Projeto

```bash
mkdir meu-projeto-node
cd meu-projeto-node
npm init -y
```

## Primeiro Servidor

```javascript
const http = require(''http'');

const server = http.createServer((req, res) => {
  res.writeHead(200, { ''Content-Type'': ''text/plain'' });
  res.end(''Olá, Node.js!'');
});

server.listen(3000, () => {
  console.log(''Servidor rodando na porta 3000'');
});
```', 'text', 1, 10);

-- Lessons for Blockchain Module 1
INSERT INTO lessons (id, module_id, title, content, lesson_type, "order", xp_value) VALUES
('e6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Conceitos Básicos de Blockchain', 
'# O que é Blockchain?

Blockchain é uma tecnologia de livro-razão distribuído que mantém uma lista crescente de registros (blocos) vinculados e protegidos por criptografia.

## Características Principais

- **Descentralização:** Não há uma autoridade central
- **Imutabilidade:** Uma vez registrado, é muito difícil alterar
- **Transparência:** Todas as transações são visíveis
- **Segurança:** Protegido por criptografia avançada

## Como Funciona

1. **Transação:** Alguém solicita uma transação
2. **Broadcast:** A transação é transmitida para a rede
3. **Validação:** Os nós da rede validam a transação
4. **Bloco:** A transação é incluída em um novo bloco
5. **Adição:** O bloco é adicionado à cadeia

## Aplicações

- Criptomoedas (Bitcoin, Ethereum)
- Smart Contracts
- Supply Chain
- Identidade Digital', 'text', 1, 15),

('e7eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'História do Bitcoin', 
'https://www.youtube.com/watch?v=bBC-nXj3Ng4', 'video', 2, 15);

-- Sample user progress (replace with actual user IDs in production)
INSERT INTO user_progress (user_id, lesson_id, completed_at, status) VALUES
('00000000-0000-0000-0000-000000000000', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '2 days', 'completed'),
('00000000-0000-0000-0000-000000000000', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '1 day', 'completed'),
('00000000-0000-0000-0000-000000000000', 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NULL, 'in_progress');

-- Function to calculate learning path progress for a user
CREATE OR REPLACE FUNCTION get_path_progress(path_id UUID, user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    progress_percentage INTEGER;
BEGIN
    -- Get total lessons in the learning path
    SELECT COUNT(l.id) INTO total_lessons
    FROM lessons l
    JOIN modules m ON l.module_id = m.id
    JOIN courses c ON m.course_id = c.id
    WHERE c.path_id = $1;
    
    -- Get completed lessons by user
    SELECT COUNT(up.lesson_id) INTO completed_lessons
    FROM user_progress up
    JOIN lessons l ON up.lesson_id = l.id
    JOIN modules m ON l.module_id = m.id
    JOIN courses c ON m.course_id = c.id
    WHERE c.path_id = $1 
    AND up.user_id = $2 
    AND up.status = 'completed';
    
    -- Calculate percentage
    IF total_lessons > 0 THEN
        progress_percentage := ROUND((completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100);
    ELSE
        progress_percentage := 0;
    END IF;
    
    RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql;