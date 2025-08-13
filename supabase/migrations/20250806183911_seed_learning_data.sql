-- Insert a learning path
INSERT INTO public.learning_paths (id, title, description)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Desenvolvimento Web Fullstack', 'Aprenda a construir aplicações web completas do front-end ao back-end.');

-- Insert a course
INSERT INTO public.courses (id, path_id, title, description, "order")
VALUES
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Introdução ao React e TypeScript', 'Comece sua jornada com React, a biblioteca JavaScript mais popular, e TypeScript para código mais robusto.', 1);

-- Insert modules for the course
INSERT INTO public.modules (id, course_id, title, "order")
VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Fundamentos do React', 1),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Trabalhando com TypeScript', 2);

-- Insert lessons for Module 1 (Fundamentos do React)
INSERT INTO public.lessons (id, module_id, title, content, lesson_type, "order", xp_value)
VALUES
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'O que é React?', '# O que é React?

React é uma biblioteca JavaScript para construir interfaces de usuário. É mantida pelo Facebook e uma comunidade de desenvolvedores individuais e empresas.

## Por que usar React?

*   **Componentes:** Permite construir UIs complexas a partir de pequenas e isoladas peças de código.
*   **Virtual DOM:** Otimiza a atualização da UI, tornando as aplicações rápidas.
*   **Ecossistema:** Grande comunidade, muitas ferramentas e bibliotecas disponíveis.

## Exemplo Básico

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Mundo" />;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

Este é apenas o começo! Prepare-se para mergulhar fundo no mundo do React.', 'text', 1, 10),
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Primeiro Componente', 'https://www.youtube.com/watch?v=S_R_d9_4c0c', 'video', 2, 15);

-- Insert lessons for Module 2 (Trabalhando com TypeScript)
INSERT INTO public.lessons (id, module_id, title, content, lesson_type, "order", xp_value)
VALUES
    ('g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Introdução ao TypeScript', '# Introdução ao TypeScript

TypeScript é um *superset* de JavaScript que adiciona tipagem estática opcional. Isso significa que você pode escrever JavaScript e, em seguida, adicionar tipos para tornar seu código mais robusto e fácil de manter.

## Benefícios do TypeScript

*   **Detecção de Erros:** Captura erros de tipo em tempo de compilação, antes que seu código seja executado.
*   **Autocompletar e Refatoração:** Melhora a experiência do desenvolvedor com IDEs.
*   **Legibilidade:** Torna o código mais fácil de entender e documentar.

## Exemplo de Tipagem

```typescript
function greet(person: string) {
  return "Hello, " + person;
}

let user = "Jane User";
document.body.textContent = greet(user);
```

TypeScript compila para JavaScript puro, então ele pode ser executado em qualquer lugar que JavaScript possa.', 'text', 1, 10),
    ('h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Quiz de TypeScript', '[{"question": "Qual a principal vantagem do TypeScript sobre o JavaScript?", "options": ["É mais rápido em tempo de execução", "Adiciona tipagem estática opcional", "Não precisa de navegador para rodar", "É uma linguagem de programação completamente diferente"], "correctAnswer": "Adiciona tipagem estática opcional"}, {"question": "TypeScript é compilado para qual linguagem?", "options": ["Python", "Java", "JavaScript", "C#"], "correctAnswer": "JavaScript"}]', 'quiz', 2, 20);

-- Insert user progress for a specific lesson (replace 'YOUR_USER_ID_HERE' with an actual user ID from auth.users)
INSERT INTO public.user_progress (user_id, lesson_id, completed_at, status)
VALUES
    ('00000000-0000-0000-0000-000000000000', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(), 'completed');
