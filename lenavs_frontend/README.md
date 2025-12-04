# LenaVS Frontend

Frontend da aplicação LenaVS - Gerador de Vídeos Karaokê

## 🚀 Tecnologias

- React 18
- Vite
- React Router DOM
- Zustand (gerenciamento de estado)
- Axios (requisições HTTP)
- Lucide React (ícones)
- React Dropzone (upload de arquivos)

## 📋 Pré-requisitos

- Node.js 18 ou superior
- Backend LenaVS rodando

## 🔧 Instalação Local

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env e configurar VITE_API_URL
nano .env

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🌍 Variáveis de Ambiente

Configure no arquivo `.env`:

```env
VITE_API_URL=https://seu-backend.onrender.com
VITE_ENV=production
```

## 📦 Deploy no Render

### 1. Adicionar Logo

**IMPORTANTE:** Antes do deploy, adicione o arquivo `logo.png` na pasta `public/`:

1. Coloque sua logo (formato PNG) em: `LENAVS_FRONTEND/public/logo.png`
2. A logo deve ter fundo preto com "VS" em laranja (#FF9159)
3. Dimensões recomendadas: 800x200px (ou proporção similar)

### 2. Criar Static Site

1. Acesse [Render Dashboard](https://dashboard.render.com/)
2. Clique em "New +" → "Static Site"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** lenavs-frontend
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

### 3. Configurar Variáveis de Ambiente

No painel do Render, adicione:

- `VITE_API_URL` - URL do backend (ex: https://lenavs-backend.onrender.com)

### 4. Deploy Automático

- Cada push no repositório irá disparar um novo build automaticamente
- O build leva aproximadamente 2-3 minutos

## 📁 Estrutura de Pastas

```
LENAVS_FRONTEND/
├── public/
│   └── logo.png                # Logo da aplicação
├── src/
│   ├── api/
│   │   ├── axios.js           # Configuração do Axios
│   │   └── services.js        # Serviços de API
│   ├── components/
│   │   ├── Editor/
│   │   │   ├── Header.jsx     # Cabeçalho
│   │   │   ├── UploadPanel.jsx    # Painel de upload
│   │   │   ├── PreviewPanel.jsx   # Preview do vídeo
│   │   │   ├── LyricsEditor.jsx   # Editor de letras
│   │   │   └── ExportPanel.jsx    # Painel de exportação
│   │   └── Modals/
│   │       ├── HelpModal.jsx       # Modal de ajuda
│   │       ├── ProjectsModal.jsx   # Modal de projetos
│   │       └── LibraryModal.jsx    # Modal de biblioteca
│   ├── pages/
│   │   ├── Login.jsx          # Página de login
│   │   ├── Register.jsx       # Página de registro
│   │   └── Editor.jsx         # Página principal do editor
│   ├── store/
│   │   ├── authStore.js       # Store de autenticação
│   │   └── editorStore.js     # Store do editor
│   ├── App.jsx                # Componente principal
│   ├── main.jsx              # Entry point
│   └── index.css             # Estilos globais
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🎨 Personalização

### Cores (definidas em index.css)

```css
--primary-orange: #FF9159;  /* Cor principal (laranja LenaVS) */
--dark-bg: #000000;         /* Fundo preto */
--dark-secondary: #1a1a1a;  /* Fundo secundário */
--text-primary: #ffffff;    /* Texto primário */
```

### Fonte

A aplicação usa **Montserrat** como fonte padrão, carregada do Google Fonts.

## 🔒 Autenticação

O sistema usa JWT (JSON Web Tokens) armazenado no localStorage:
- Token válido por 7 dias
- Renovação automática ao fazer novas requisições
- Redirect automático para login quando token expira

## 🎭 Funcionalidades

### Autenticação
- ✅ Login e Registro
- ✅ Proteção de rotas
- ✅ Gerenciamento de sessão

### Editor
- ✅ Upload de arquivos (áudio, vídeo, imagem, letra)
- ✅ Editor de letras com sincronização
- ✅ Estilização de texto (fonte, cor, tamanho, efeitos)
- ✅ Preview em tempo real
- ✅ Controles de alinhamento e transição

### Projetos
- ✅ Salvar e carregar projetos
- ✅ Gerenciar múltiplos projetos
- ✅ Biblioteca pública (compartilhamento)
- ✅ Clonar projetos públicos

### Exportação
- ✅ Escolha de áudio (original/instrumental)
- ✅ Geração de vídeo MP4
- ✅ Download automático

## 📝 Notas de Desenvolvimento

### Gerenciamento de Estado

A aplicação usa Zustand para gerenciamento de estado:

**authStore:**
- Informações do usuário
- Token JWT
- Estado de autenticação

**editorStore:**
- Arquivos uploaded
- Letras e configurações
- Estado do preview
- Projeto atual

### Comunicação com Backend

Todas as requisições passam por interceptors que:
- Adicionam automaticamente o token JWT
- Tratam erros 401 (não autorizado)
- Fazem redirect para login quando necessário

## 🐛 Troubleshooting

### Erro de CORS
Certifique-se de que o backend tem `CORS_ORIGIN` configurado corretamente para a URL do frontend.

### Imagens não carregam
Verifique se a URL da API no `.env` está correta e se o backend está acessível.

### Build falha
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Logo não aparece
Certifique-se de que o arquivo `logo.png` está em `/public/logo.png` antes do build.

## 🌐 URLs de Produção

Após o deploy, você terá URLs como:
- Frontend: `https://lenavs-frontend.onrender.com`
- Backend: `https://lenavs-backend.onrender.com`

Atualize o `VITE_API_URL` no Render com a URL correta do backend.

## 📞 Suporte

Para bugs e dúvidas, use o sistema de "Relatar Erro" dentro da aplicação ou abra uma issue no GitHub.

## 📄 Licença

MIT License - LenaVS Team
