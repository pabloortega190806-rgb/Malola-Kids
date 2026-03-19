-- Esquema de base de datos para Malola (PostgreSQL en Neon)

CREATE TABLE IF NOT EXISTS products (
    code VARCHAR(50) PRIMARY KEY, -- El código es la clave principal
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(100),
    original_price NUMERIC(10, 2) NOT NULL,
    discounted_price NUMERIC(10, 2) NOT NULL, -- Precio con 40% de descuento
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sizes_stock JSONB NOT NULL DEFAULT '{}'::jsonb,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar la eficiencia de carga y filtrado del catálogo (700+ productos)
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- ==========================================
-- EJEMPLO DE INSERCIÓN DE DATOS:
-- ==========================================
-- INSERT INTO products (name, description, price, brand, category, sizes_stock, image_url)
-- VALUES (
--   'Conjunto Punto Bebé',
--   'Precioso conjunto de punto de dos piezas ideal para primera postura.',
--   29.99,
--   'Calamaro',
--   'Primera postura',
--   '{"0 meses": 3, "1 mes": 5, "3 meses": 2}',
--   'https://ejemplo.com/imagen.jpg'
-- );
