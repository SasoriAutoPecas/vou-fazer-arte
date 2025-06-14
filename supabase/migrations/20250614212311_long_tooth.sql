/*
  # Schema completo do sistema Benigna

  1. Tabelas principais
    - `users` - Usuários (doadores e instituições)
    - `institutions` - Dados específicos das instituições
    - `addresses` - Endereços
    - `categories` - Categorias de doação
    - `subcategories` - Subcategorias
    - `donations` - Doações cadastradas
    - `schedules` - Agendamentos
    - `ratings` - Avaliações
    - `working_hours` - Horários de funcionamento

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas específicas por tipo de usuário
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para tipos de usuário
CREATE TYPE user_type AS ENUM ('donor', 'institution');

-- Enum para tipos de instituição
CREATE TYPE institution_type AS ENUM ('ong', 'church', 'social_project', 'hospital', 'school');

-- Enum para condição dos itens
CREATE TYPE item_condition AS ENUM ('new', 'semi_new', 'used');

-- Enum para status das doações
CREATE TYPE donation_status AS ENUM ('pending', 'scheduled', 'delivered', 'cancelled');

-- Tabela de usuários
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  cpf text,
  cnpj text,
  user_type user_type NOT NULL DEFAULT 'donor',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de endereços
CREATE TABLE addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  street text NOT NULL,
  number text NOT NULL,
  complement text,
  neighborhood text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  created_at timestamptz DEFAULT now()
);

-- Tabela de instituições (dados específicos)
CREATE TABLE institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  description text NOT NULL,
  institution_type institution_type NOT NULL,
  rating decimal(3, 2) DEFAULT 0,
  total_ratings integer DEFAULT 0,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de categorias
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabela de subcategorias
CREATE TABLE subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabela de horários de funcionamento
CREATE TABLE working_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES institutions(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time time,
  close_time time,
  is_closed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Tabela de doações
CREATE TABLE donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  institution_id uuid REFERENCES institutions(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  category_id uuid REFERENCES categories(id),
  subcategory_id uuid REFERENCES subcategories(id),
  condition item_condition NOT NULL,
  status donation_status DEFAULT 'pending',
  images text[] DEFAULT '{}',
  scheduled_date timestamptz,
  delivered_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de agendamentos
CREATE TABLE schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid REFERENCES donations(id) ON DELETE CASCADE,
  donor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  institution_id uuid REFERENCES institutions(id) ON DELETE CASCADE,
  scheduled_date timestamptz NOT NULL,
  notes text,
  status text DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now()
);

-- Tabela de avaliações
CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  institution_id uuid REFERENCES institutions(id) ON DELETE CASCADE,
  donation_id uuid REFERENCES donations(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  response text,
  created_at timestamptz DEFAULT now()
);

-- Tabela de categorias aceitas por instituição
CREATE TABLE institution_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES institutions(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(institution_id, category_id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_categories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can read public user data" ON users
  FOR SELECT USING (true);

-- Políticas RLS para addresses
CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read addresses" ON addresses
  FOR SELECT USING (true);

-- Políticas RLS para institutions
CREATE POLICY "Institution owners can manage their data" ON institutions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read institutions" ON institutions
  FOR SELECT USING (true);

-- Políticas RLS para categories (público)
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can create categories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Políticas RLS para subcategories (público)
CREATE POLICY "Anyone can read subcategories" ON subcategories
  FOR SELECT USING (true);

-- Políticas RLS para working_hours
CREATE POLICY "Institution owners can manage working hours" ON working_hours
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM institutions WHERE id = working_hours.institution_id
    )
  );

CREATE POLICY "Anyone can read working hours" ON working_hours
  FOR SELECT USING (true);

-- Políticas RLS para donations
CREATE POLICY "Donors can manage own donations" ON donations
  FOR ALL USING (auth.uid() = donor_id);

CREATE POLICY "Institutions can read donations directed to them" ON donations
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM institutions WHERE id = donations.institution_id
    )
  );

CREATE POLICY "Institutions can update donation status" ON donations
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM institutions WHERE id = donations.institution_id
    )
  );

-- Políticas RLS para schedules
CREATE POLICY "Users can manage own schedules" ON schedules
  FOR ALL USING (
    auth.uid() = donor_id OR 
    auth.uid() IN (
      SELECT user_id FROM institutions WHERE id = schedules.institution_id
    )
  );

-- Políticas RLS para ratings
CREATE POLICY "Donors can create ratings" ON ratings
  FOR INSERT WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Anyone can read ratings" ON ratings
  FOR SELECT USING (true);

CREATE POLICY "Institution owners can respond to ratings" ON ratings
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM institutions WHERE id = ratings.institution_id
    )
  );

-- Políticas RLS para institution_categories
CREATE POLICY "Institution owners can manage categories" ON institution_categories
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM institutions WHERE id = institution_categories.institution_id
    )
  );

CREATE POLICY "Anyone can read institution categories" ON institution_categories
  FOR SELECT USING (true);

-- Inserir categorias padrão
INSERT INTO categories (name, icon) VALUES
  ('Roupas', 'shirt'),
  ('Móveis', 'armchair'),
  ('Alimentos', 'apple'),
  ('Livros', 'book'),
  ('Brinquedos', 'gamepad-2'),
  ('Eletrônicos', 'smartphone'),
  ('Produtos de Higiene', 'droplets'),
  ('Material Escolar', 'pencil');

-- Inserir subcategorias
INSERT INTO subcategories (category_id, name) VALUES
  ((SELECT id FROM categories WHERE name = 'Roupas'), 'Roupas Infantis'),
  ((SELECT id FROM categories WHERE name = 'Roupas'), 'Roupas Adultas'),
  ((SELECT id FROM categories WHERE name = 'Roupas'), 'Calçados'),
  ((SELECT id FROM categories WHERE name = 'Roupas'), 'Acessórios'),
  ((SELECT id FROM categories WHERE name = 'Móveis'), 'Móveis de Quarto'),
  ((SELECT id FROM categories WHERE name = 'Móveis'), 'Móveis de Sala'),
  ((SELECT id FROM categories WHERE name = 'Móveis'), 'Móveis de Cozinha'),
  ((SELECT id FROM categories WHERE name = 'Móveis'), 'Eletrodomésticos'),
  ((SELECT id FROM categories WHERE name = 'Alimentos'), 'Alimentos Não Perecíveis'),
  ((SELECT id FROM categories WHERE name = 'Alimentos'), 'Frutas e Verduras'),
  ((SELECT id FROM categories WHERE name = 'Alimentos'), 'Produtos de Limpeza'),
  ((SELECT id FROM categories WHERE name = 'Livros'), 'Livros Didáticos'),
  ((SELECT id FROM categories WHERE name = 'Livros'), 'Literatura'),
  ((SELECT id FROM categories WHERE name = 'Livros'), 'Livros Infantis'),
  ((SELECT id FROM categories WHERE name = 'Brinquedos'), 'Brinquedos Educativos'),
  ((SELECT id FROM categories WHERE name = 'Brinquedos'), 'Jogos'),
  ((SELECT id FROM categories WHERE name = 'Brinquedos'), 'Pelúcias');

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON institutions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar rating da instituição
CREATE OR REPLACE FUNCTION update_institution_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE institutions 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM ratings 
      WHERE institution_id = NEW.institution_id
    ),
    total_ratings = (
      SELECT COUNT(*) 
      FROM ratings 
      WHERE institution_id = NEW.institution_id
    )
  WHERE id = NEW.institution_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar rating automaticamente
CREATE TRIGGER update_institution_rating_trigger
  AFTER INSERT OR UPDATE ON ratings
  FOR EACH ROW EXECUTE FUNCTION update_institution_rating();