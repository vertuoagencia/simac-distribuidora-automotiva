# SIMAC - Distribuidora Automotiva

Site de catálogo de produtos automotivos com integração Supabase.

## 🚀 Instalação e Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Variáveis de Ambiente
O arquivo `.env.local` já está configurado com as credenciais do Supabase.

Se precisar atualizar, edite `.env.local`:
```
VITE_SUPABASE_URL=https://updqzeidruylrupzetai.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_Ae5EYlmGzoPXw4SyAiavDQ_OhquU5z4
```

### 3. Executar em desenvolvimento
```bash
npm run dev
```

O site abrirá automaticamente em `http://localhost:5173`

### 4. Build para produção
```bash
npm run build
```

## 📋 Estrutura da Tabela de Produtos

A tabela `products` no Supabase deve ter os seguintes campos:
- `id` - Identificador único
- `codigo_sistema` - Código do produto
- `marca` - Marca do produto
- `nome_produto` - Nome do produto
- `categoria` - Categoria do produto
- `quantidade_caixa` - Quantidade por caixa
- `quantidade_embalagem` - Volume/tamanho
- `especificacoes` - Especificações técnicas
- `indicacao` - Indicação de uso
- `image_url` - URL da imagem (opcional)

## 🎨 Páginas

- **index.html** - Página inicial com hero, slider promocional e seções informativas
- **catalogo.html** - Catálogo com filtros, busca e grid de produtos

## ✨ Funcionalidades do Catálogo

✅ Busca por nome, marca e especificações  
✅ Filtro por Categoria  
✅ Filtro por Marca  
✅ Filtro por Tamanho/Volume  
✅ Filtro por Quantidade por Caixa  
✅ Ordenação (A-Z, Z-A, Mais recentes)  
✅ Responsivo (mobile, tablet, desktop)  
✅ Integração com Supabase em tempo real  

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)
- Vite
- Supabase
- DM Sans Font
- Font Awesome Icons
