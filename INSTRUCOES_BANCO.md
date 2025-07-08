# Configuração do Banco de Dados - Sistema de Categorias

Para que o sistema de categorias funcione corretamente, você precisa criar as seguintes tabelas no seu projeto Supabase:

## 1. Tabela de Categorias

Execute o seguinte SQL no editor SQL do Supabase:

```sql
-- Criar tabela de categorias
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT para usuários anônimos
CREATE POLICY "Allow public read access" ON categories
    FOR SELECT USING (true);

-- Política para permitir INSERT, UPDATE, DELETE apenas para usuários autenticados
CREATE POLICY "Allow authenticated users full access" ON categories
    FOR ALL USING (auth.role() = 'authenticated');
```

## 2. Atualizar Tabela de Produtos

Se a tabela `products` já existe, adicione a coluna de categoria:

```sql
-- Adicionar coluna category_id à tabela products
ALTER TABLE products 
ADD COLUMN category_id BIGINT REFERENCES categories(id);

-- Criar índice para melhor performance
CREATE INDEX idx_products_category_id ON products(category_id);
```

Se a tabela `products` não existe ainda, crie ela com a coluna de categoria:

```sql
-- Criar tabela de produtos com categoria
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category_id BIGINT REFERENCES categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT para usuários anônimos
CREATE POLICY "Allow public read access" ON products
    FOR SELECT USING (true);

-- Política para permitir INSERT, UPDATE, DELETE apenas para usuários autenticados
CREATE POLICY "Allow authenticated users full access" ON products
    FOR ALL USING (auth.role() = 'authenticated');

-- Criar índices
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_created_at ON products(created_at);
```

## 3. Configuração de Storage (se ainda não configurado)

Para upload de imagens dos produtos:

```sql
-- Inserir bucket para produtos (execute uma única vez)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- Política para permitir upload de imagens
CREATE POLICY "Allow authenticated users to upload product images" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'products');

-- Política para permitir acesso público às imagens
CREATE POLICY "Allow public access to product images" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'products');

-- Política para permitir deletar imagens
CREATE POLICY "Allow authenticated users to delete product images" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'products');
```

## 4. Dados de Exemplo (Opcional)

Você pode inserir algumas categorias de exemplo:

```sql
-- Inserir categorias de exemplo
INSERT INTO categories (name, description) VALUES 
('Arranjos Florais', 'Belos arranjos para decoração e presentes'),
('Buquês', 'Buquês para ocasiões especiais'),
('Plantas', 'Plantas decorativas e ornamentais'),
('Vasos e Acessórios', 'Vasos, suportes e acessórios para plantas');
```

## Verificação

Após executar os comandos acima, você deve ter:

- ✅ Tabela `categories` criada com RLS habilitado
- ✅ Tabela `products` com coluna `category_id`
- ✅ Políticas de segurança configuradas
- ✅ Bucket `products` para storage de imagens
- ✅ Índices criados para performance

## Funcionalidades Disponíveis

Com essas configurações, o sistema oferece:

1. **Painel Administrativo:**
   - Gerenciar categorias (criar, editar, excluir)
   - Associar produtos às categorias
   - Visualizar produtos organizados por categoria

2. **Site Principal:**
   - Produtos exibidos agrupados por categoria
   - Design responsivo para mobile e desktop
   - Navegação intuitiva entre categorias

## Troubleshooting

Se você encontrar erros:

1. **Erro "relation does not exist"**: Verifique se todas as tabelas foram criadas
2. **Erro de permissão**: Verifique se as políticas RLS foram criadas corretamente
3. **Erro de upload de imagem**: Verifique se o bucket e políticas de storage foram configurados

Para mais ajuda, consulte a documentação do Supabase: https://supabase.com/docs 