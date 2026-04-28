/*
  # Create products table for Simac catalog

  ## Summary
  Creates the main products table for the Simac Distribuidora Automotiva product catalog.

  ## New Tables
  - `products`
    - `id` (bigserial, primary key)
    - `nome_produto` (text) - Product name
    - `marca` (text) - Brand name
    - `categoria` (text) - Product category
    - `quantidade_caixa` (text) - Units per box
    - `quantidade_embalagem` (text) - Package size/volume
    - `especificacoes` (text) - Technical specifications
    - `indicacao` (text) - Usage indication
    - `image_url` (text) - Product image URL
    - `created_at` (timestamptz) - Row creation timestamp

  ## Security
  - Enable RLS on `products` table
  - Public read access for anonymous users (catalog is public-facing)
  - No insert/update/delete for anonymous users
*/

CREATE TABLE IF NOT EXISTS products (
  id bigserial PRIMARY KEY,
  nome_produto text NOT NULL DEFAULT '',
  marca text NOT NULL DEFAULT '',
  categoria text NOT NULL DEFAULT '',
  quantidade_caixa text DEFAULT '',
  quantidade_embalagem text DEFAULT '',
  especificacoes text DEFAULT '',
  indicacao text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);
