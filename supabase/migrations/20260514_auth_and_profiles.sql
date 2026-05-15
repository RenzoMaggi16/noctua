-- 1. Crear tabla profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT,
    telefono TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Actualizar tabla reservas
-- Agregamos las columnas necesarias si no existen
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'activa' CHECK (estado IN ('activa', 'cancelada', 'completada')),
ADD COLUMN IF NOT EXISTS cancelada_en TIMESTAMPTZ;

-- 3. Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- 4. Políticas para profiles
CREATE POLICY "Usuarios pueden ver su propio perfil" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden insertar su propio perfil" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 5. Políticas para reservas
CREATE POLICY "Usuarios pueden ver sus propias reservas" 
ON public.reservas FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus propias reservas" 
ON public.reservas FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias reservas" 
ON public.reservas FOR UPDATE 
USING (auth.uid() = user_id);

-- 6. Trigger para crear perfil automáticamente al registrarse (opcional pero recomendado)
-- CREATE OR REPLACE FUNCTION public.handle_new_user() 
-- RETURNS trigger AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, nombre)
--   VALUES (new.id, new.raw_user_meta_data->>'nombre');
--   RETURN new;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
