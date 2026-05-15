# 📋 Task Manager - Premium Dark Mode

Um aplicativo web moderno e elegante para gerenciamento de tarefas com design glassmorphism, tema escuro/claro, e persistência de dados em localStorage.

## ✨ Características

- **Design Premium**: Interface glassmorphism com efeitos neon e desfoque
- **Tema Dark/Light**: Alterna entre modo escuro profundo e modo claro sofisticado
- **Persistência de Dados**: Todas as tarefas são salvas no localStorage do navegador
- **Prioridades**: Categorize tarefas por prioridade (Baixa, Média, Alta)
- **Busca e Filtros**: Procure tarefas e filtre por status (Todas, Pendentes, Concluídas)
- **Edição em Tempo Real**: Edite texto e prioridade de tarefas sem recarregar
- **Confirmação de Delete**: Modal de confirmação antes de excluir tarefas
- **Estatísticas**: Visualize total, pendentes e concluídas com progresso
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Timestamps**: Data e hora de criação para cada tarefa

## 🚀 Tecnologias

- **React 18.2.0** - Framework JavaScript
- **Vite 5.0.0** - Build tool ultra rápido
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Font Awesome 6.4.0** - Ícones
- **Google Fonts** - Typography (Inter, Plus Jakarta Sans)

## 📦 Instalação

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/task-manager.git
   cd task-manager
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:3000 (ou porta indicada no terminal)
   ```

## 🛠️ Scripts Disponíveis

```bash
# Inicia o servidor de desenvolvimento
npm run dev

# Compila para produção
npm run build

# Visualiza a build de produção localmente
npm run preview
```

## 💻 Como Usar

### Adicionar Tarefa
1. Digite a descrição da tarefa no campo "O que você precisa fazer?"
2. Selecione a prioridade (Baixa, Média, Alta)
3. Clique em "+ Adicionar" ou pressione Enter

### Editar Tarefa
1. Clique no ícone ✏️ (editar) na tarefa desejada
2. Modifique o texto e/ou prioridade
3. Clique em "Salvar"

### Deletar Tarefa
1. Clique no ícone 🗑️ (lixo) na tarefa
2. Confirme a exclusão no modal que aparece
3. A tarefa será removida permanentemente

### Marcar como Concluída
1. Clique no checkbox ☐ ao lado da tarefa
2. A tarefa será marcada como concluída com efeito visual

### Buscar Tarefas
1. Use a barra de busca para filtrar por texto
2. Os resultados aparecem em tempo real

### Filtrar por Status
- **Todas**: Mostra todas as tarefas
- **Pendentes**: Mostra apenas tarefas não concluídas
- **Concluídas**: Mostra apenas tarefas marcadas como concluídas

### Alternar Tema
1. Clique no ícone de sol ☀️ ou lua 🌙 no canto superior direito
2. O tema alterna entre modo escuro e claro

## 📁 Estrutura do Projeto

```
task-manager/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Cabeçalho com toggle de tema
│   │   ├── TaskForm.jsx            # Formulário para adicionar tarefas
│   │   ├── Stats.jsx               # Cards de estatísticas
│   │   ├── Filters.jsx             # Busca e filtros
│   │   ├── TaskList.jsx            # Container de tarefas
│   │   ├── TaskItem.jsx            # Item individual de tarefa
│   │   ├── EditTaskModal.jsx       # Modal de edição
│   │   ├── ConfirmDeleteModal.jsx  # Modal de confirmação de delete
│   │   ├── Toast.jsx               # Notificações
│   │   └── Footer.jsx              # Rodapé com data/hora
│   ├── App.jsx                     # Componente principal
│   ├── index.css                   # Estilos globais
│   └── main.jsx                    # Entrada da aplicação
├── index.html                      # HTML base
├── package.json                    # Dependências
├── vite.config.js                  # Configuração Vite
├── tailwind.config.js              # Configuração Tailwind
└── .gitignore                      # Arquivos ignorados pelo git
```

## 🎨 Design & Estilos

### Tema Escuro (Padrão)
- Background: Gradiente profundo de `#0f111a` a `#181b2a`
- Cards: Glassmorphism com `bg-white/5` e `backdrop-blur-xl`
- Texto: Branco e cinza claro para melhor legibilidade
- Acentos: Azul, âmbar e esmeralda com efeitos neon

### Tema Claro
- Background: Gradiente sofisticado de slate-100 a slate-200
- Cards: Branco com bordas sutis em cinza
- Texto: Cinza escuro e preto para máximo contraste
- Acentos: Cores vibrantes em versões claras

## 💾 Armazenamento de Dados

As tarefas são armazenadas no **localStorage** do navegador:
- Cada tarefa contém: ID, texto, prioridade, status (concluída), data e hora de criação
- Os dados persistem entre sessões (não serão perdidos ao recarregar a página)
- O tema (dark/light) também é persistido

## 🔧 Desenvolvimento

### Adicionar Nova Funcionalidade

1. Crie um novo componente em `src/components/`
2. Importe em `App.jsx` ou no componente pai
3. Integre a lógica de estado conforme necessário
4. Teste no servidor de desenvolvimento

### Modificar Estilos

- Utilize as classes do Tailwind CSS
- Estilos globais em `src/index.css`
- Configurações Tailwind em `tailwind.config.js`

## 📱 Responsividade

O projeto é totalmente responsivo usando:
- Tailwind CSS breakpoints (`sm:`, `md:`, `lg:`)
- Flexbox e Grid layouts
- Viewport meta tag

## 🌐 Deploy

### Preparar para Produção

1. Execute o build:
   ```bash
   npm run build
   ```

2. A pasta `dist/` contém os arquivos otimizados para produção

### Publicar em Plataformas

- **Vercel**: Conecte seu repositório GitHub
- **Netlify**: Arraste a pasta `dist/` ou conecte o repositório
- **GitHub Pages**: Configure em Settings > Pages

## 🤝 Contribuindo

Sinta-se livre para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Desenvolvido por **Jacielio da Silva Queiroz**

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se o Node.js está instalado corretamente
2. Delete `node_modules` e `package-lock.json`, depois execute `npm install` novamente
3. Limpe o cache do navegador
4. Verifique o console do navegador (F12) para mensagens de erro

## 🎓 Recursos de Aprendizado

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Font Awesome Icons](https://fontawesome.com)

---

**Desenvolvido com ❤️ usando React + Vite + Tailwind CSS**
