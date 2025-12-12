-- ============================================
-- Empower Database Initialization Script
-- PostgreSQL 15
-- ============================================

-- Drop tables if they exist (for clean initialization)
DROP TABLE IF EXISTS puntos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- ============================================
-- Table: usuarios
-- Description: Stores user account information
-- ============================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    escuela VARCHAR(200) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_nombre_length CHECK (LENGTH(nombre) >= 2),
    CONSTRAINT chk_apellidos_length CHECK (LENGTH(apellidos) >= 2),
    CONSTRAINT chk_correo_format CHECK (correo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index on email for faster lookups
CREATE INDEX idx_usuarios_correo ON usuarios(correo);

-- ============================================
-- Table: puntos
-- Description: Stores recycling points for each user
-- ============================================
CREATE TABLE puntos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    plastico INTEGER DEFAULT 0 NOT NULL,
    carton INTEGER DEFAULT 0 NOT NULL,
    aluminio INTEGER DEFAULT 0 NOT NULL,
    total INTEGER DEFAULT 0 NOT NULL,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key relationship
    CONSTRAINT fk_usuario 
        FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) 
        ON DELETE CASCADE,
    
    -- Ensure points are non-negative
    CONSTRAINT chk_plastico_positive CHECK (plastico >= 0),
    CONSTRAINT chk_carton_positive CHECK (carton >= 0),
    CONSTRAINT chk_aluminio_positive CHECK (aluminio >= 0),
    CONSTRAINT chk_total_positive CHECK (total >= 0)
);

-- Create index on usuario_id for faster lookups
CREATE INDEX idx_puntos_usuario_id ON puntos(usuario_id);

-- ============================================
-- Trigger: calculate_total_points
-- Description: Automatically calculates total points
--              when inserting or updating points
-- ============================================
CREATE OR REPLACE FUNCTION calculate_total_points()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total := NEW.plastico + NEW.carton + NEW.aluminio;
    NEW.ultima_actualizacion := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_total_points
    BEFORE INSERT OR UPDATE ON puntos
    FOR EACH ROW
    EXECUTE FUNCTION calculate_total_points();

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================
-- Uncomment the following lines to insert sample data

-- INSERT INTO usuarios (nombre, apellidos, escuela, correo, contrasena) 
-- VALUES 
--     ('Juan', 'Pérez García', 'TecNM Campus Querétaro', 'juan.perez@queretaro.tecnm.mx', '$2b$10$example_hashed_password_here'),
--     ('María', 'López Hernández', 'TecNM Campus Querétaro', 'maria.lopez@queretaro.tecnm.mx', '$2b$10$example_hashed_password_here');

-- INSERT INTO puntos (usuario_id, plastico, carton, aluminio) 
-- VALUES 
--     (1, 150, 200, 75),
--     (2, 300, 150, 100);

-- ============================================
-- Verification Queries
-- ============================================
-- Run these queries to verify the schema was created correctly:
-- 
-- List all tables:
-- \dt
--
-- Describe usuarios table:
-- \d usuarios
--
-- Describe puntos table:
-- \d puntos
--
-- View all triggers:
-- SELECT trigger_name, event_manipulation, event_object_table 
-- FROM information_schema.triggers 
-- WHERE trigger_schema = 'public';
--
-- ============================================

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema initialized successfully!';
    RAISE NOTICE 'Tables created: usuarios, puntos';
    RAISE NOTICE 'Trigger created: calculate_total_points';
END $$;
