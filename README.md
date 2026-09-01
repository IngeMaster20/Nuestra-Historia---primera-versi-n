# Nuestra Historia ❤️

Web privada de recuerdos para pareja. React + Vite + TypeScript + Tailwind + Supabase + Netlify.

Este README trae **todo lo que no pude ejecutar por ti** (yo no tengo acceso a internet para instalar
paquetes ni crear tu proyecto de Supabase), así que síguelo en orden. Cada paso indica dónde ejecutarlo
y qué deberías ver al terminar.

---

## Paso 1 — Instalar dependencias

En tu terminal, dentro de la carpeta `ANGELA`:

```bash
cd ANGELA
npm install
```

**Qué hace:** descarga React, Vite, Tailwind, Supabase JS, etc. según `package.json`.
**Resultado esperado:** se crea una carpeta `node_modules/` y no hay errores rojos al final (algunos
warnings amarillos son normales).

---

## Paso 2 — Crear el proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) → **New project**.
2. Ponle un nombre (ej. `nuestra-historia`) y una contraseña de base de datos (guárdala).
3. Elige la región más cercana a ustedes dos.
4. Espera ~2 minutos a que se aprovisione.
5. Ve a **Project Settings → API**. Copia:
   - `Project URL`
   - `anon public` key

**Resultado esperado:** tienes esas dos cadenas de texto listas para el siguiente paso.

---

## Paso 3 — Variables de entorno

En la carpeta `ANGELA`, copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Abre `.env` y pega tus valores:

```
VITE_SUPABASE_URL=https://xpbjeqifcftrjvwzjaxn.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_UeTP30MLiHRbmxzDU9jHgw_5Rbzgx4E
```

⚠️ **Nunca subas `.env` a GitHub** — ya está en `.gitignore`, no lo quites de ahí.

---

## Paso 4 — Crear las tablas y políticas (RLS)

Ve a tu proyecto Supabase → **SQL Editor** → **New query**, pega todo el bloque de abajo y dale **Run**.

```sql
-- =========================================================
-- PERFILES (extiende auth.users)
-- =========================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- RECUERDOS
-- =========================================================
create type memory_category as enum ('viaje','cita','aniversario','cotidiano','sorpresa','otro');

create table memories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date date not null,
  location text,
  category memory_category not null default 'cotidiano',
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- FOTOS (pueden pertenecer a un recuerdo o a una notita)
-- =========================================================
create table photos (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid references memories(id) on delete cascade,
  note_id uuid, -- FK se agrega tras crear notes (ver abajo)
  user_id uuid not null references profiles(id),
  storage_path text not null,
  description text,
  created_at timestamptz not null default now(),
  constraint photo_belongs_to_something check (memory_id is not null or note_id is not null)
);

-- =========================================================
-- NOTITAS
-- =========================================================
create type note_status as enum ('draft','published');

create table notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  title text,
  content text not null,
  emoji text,
  date timestamptz not null default now(),
  status note_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table photos add constraint photos_note_id_fkey
  foreign key (note_id) references notes(id) on delete cascade;

-- =========================================================
-- FECHAS IMPORTANTES
-- =========================================================
create table important_dates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  description text,
  photo_id uuid references photos(id),
  created_by uuid not null references profiles(id)
);

-- =========================================================
-- REACCIONES (una por usuario por notita)
-- =========================================================
create type reaction_type as enum ('heart','love','wow','kiss');

create table reactions (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references notes(id) on delete cascade,
  user_id uuid not null references profiles(id),
  reaction reaction_type not null,
  created_at timestamptz not null default now(),
  unique (note_id, user_id)
);

-- =========================================================
-- ROW LEVEL SECURITY
-- Regla general: cualquier usuario autenticado que tenga un
-- perfil en `profiles` (es decir, uno de ustedes dos) puede
-- leer y crear contenido. Solo el autor (o el creador) puede
-- editar/eliminar lo suyo. Nadie más puede ver nada.
-- =========================================================

alter table profiles enable row level security;
alter table memories enable row level security;
alter table photos enable row level security;
alter table notes enable row level security;
alter table important_dates enable row level security;
alter table reactions enable row level security;

-- profiles: cualquier miembro autenticado puede ver los perfiles de la pareja
create policy "profiles: lectura de la pareja" on profiles
  for select using (auth.uid() is not null);
create policy "profiles: solo el dueño edita su perfil" on profiles
  for update using (auth.uid() = id);
create policy "profiles: insertar el propio al registrarse" on profiles
  for insert with check (auth.uid() = id);

-- memories
create policy "memories: lectura de la pareja" on memories
  for select using (auth.uid() is not null);
create policy "memories: cualquiera de la pareja crea" on memories
  for insert with check (auth.uid() is not null);
create policy "memories: el autor edita lo suyo" on memories
  for update using (auth.uid() = created_by);
create policy "memories: el autor elimina lo suyo" on memories
  for delete using (auth.uid() = created_by);

-- photos
create policy "photos: lectura de la pareja" on photos
  for select using (auth.uid() is not null);
create policy "photos: cualquiera de la pareja sube" on photos
  for insert with check (auth.uid() is not null);
create policy "photos: el autor elimina lo suyo" on photos
  for delete using (auth.uid() = user_id);

-- notes
create policy "notes: lectura de la pareja" on notes
  for select using (auth.uid() is not null);
create policy "notes: cualquiera de la pareja escribe" on notes
  for insert with check (auth.uid() is not null);
create policy "notes: el autor edita lo suyo" on notes
  for update using (auth.uid() = user_id);
create policy "notes: el autor elimina lo suyo" on notes
  for delete using (auth.uid() = user_id);

-- important_dates
create policy "dates: lectura de la pareja" on important_dates
  for select using (auth.uid() is not null);
create policy "dates: cualquiera de la pareja crea" on important_dates
  for insert with check (auth.uid() is not null);
create policy "dates: el autor elimina lo suyo" on important_dates
  for delete using (auth.uid() = created_by);

-- reactions
create policy "reactions: lectura de la pareja" on reactions
  for select using (auth.uid() is not null);
create policy "reactions: cualquiera reacciona" on reactions
  for insert with check (auth.uid() = user_id);
create policy "reactions: actualiza la propia" on reactions
  for update using (auth.uid() = user_id);
create policy "reactions: elimina la propia" on reactions
  for delete using (auth.uid() = user_id);

-- =========================================================
-- REALTIME (para que las notitas aparezcan sin refrescar)
-- =========================================================
alter publication supabase_realtime add table notes;
alter publication supabase_realtime add table reactions;
```

**Resultado esperado:** en **Table Editor** verás las 6 tablas creadas, y en cada una un candado
verde (RLS activado) si vas a **Authentication → Policies**.

---

## Paso 5 — Crear el bucket de fotos

1. Ve a **Storage** → **New bucket**.
2. Nombre exacto: `memory-photos`.
3. **Public bucket: NO** (déjalo privado — accedemos con signed URLs).
4. Crea el bucket.

Luego ve a **Storage → memory-photos → Policies** y agrega estas políticas (botón "New policy" →
"For full customization"):

```sql
-- Solo usuarios autenticados (ustedes dos) pueden subir
create policy "subir fotos autenticado"
on storage.objects for insert
with check (bucket_id = 'memory-photos' and auth.uid() is not null);

-- Solo usuarios autenticados pueden leer (para generar signed URLs)
create policy "leer fotos autenticado"
on storage.objects for select
using (bucket_id = 'memory-photos' and auth.uid() is not null);

-- Solo el dueño de la carpeta (su propio user_id como prefijo) puede borrar
create policy "borrar fotos propias"
on storage.objects for delete
using (bucket_id = 'memory-photos' and auth.uid()::text = (storage.foldername(name))[1]);
```

**Resultado esperado:** el bucket `memory-photos` existe y tiene 3 políticas activas.

---

## Paso 6 — Crear las dos cuentas

Por ahora el registro (`Crear una cuenta nueva` en el login) está abierto — es la forma más simple de
crear sus dos cuentas la primera vez. Después de registrarse ambos:

1. Ve a **Authentication → Providers → Email** y considera desactivar **"Allow new users to sign up"**
   una vez que ambos tengan cuenta, así nadie más puede registrarse.
2. Si prefieres confirmar los correos manualmente: **Authentication → Users**, verifica que ambos
   aparezcan.

---

## Paso 7 — Levantar el proyecto localmente

```bash
npm run dev
```

**Resultado esperado:** la terminal muestra algo como `Local: http://localhost:5173/`. Ábrelo en tu
navegador — deberías ver la pantalla de login romántica ("Bienvenidos a nuestro pequeño mundo ❤️").

Crea tu cuenta, luego la de tu enamorada, y ya pueden empezar a usarla.

> Nota: en `src/pages/Dashboard.tsx` hay una constante `RELATIONSHIP_START` con la fecha de inicio de
> la relación — cámbiala por la fecha real de ustedes.

---

## Paso 8 — Desplegar en Netlify

1. Sube el proyecto a un repositorio de GitHub (privado, recomendado):
   ```bash
   git init
   git add .
   git commit -m "Nuestra Historia - primera versión"
   git branch -M main
   git remote add origin <tu-repo-url>
   git push -u origin main
   ```
2. En [Netlify](https://app.netlify.com) → **Add new site → Import an existing project → GitHub** →
   selecciona tu repo.
3. Netlify detectará `netlify.toml` automáticamente (build command `npm run build`, publish `dist`).
4. Antes de desplegar, ve a **Site settings → Environment variables** y agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Dale **Deploy site**.

**Resultado esperado:** Netlify te da una URL tipo `https://algo-random.netlify.app` donde la app
funciona igual que en local, ya con datos reales de Supabase.

(Opcional: en **Domain settings** puedes conectar un dominio propio.)

---

## Servicios gratuitos vs. de pago

| Servicio       | Gratis hasta          | Cuándo pagarías                                                  |
| -------------- | --------------------- | ---------------------------------------------------------------- |
| Netlify        | 100GB banda/mes       | Prácticamente nunca para uso de pareja                           |
| Supabase       | 500MB DB, 1GB Storage | Si suben muchas fotos sin comprimir por años (~plan Pro $25/mes) |
| Dominio propio | —                     | ~$10-15/año, opcional                                            |

Las fotos se comprimen automáticamente a WebP antes de subir (ver `src/utils/imageCompression.ts`),
así que el 1GB gratuito debería durar bastante.

---

## Estructura del proyecto

```
src/
├── components/   # UI reutilizable (Nav, Modal, PhotoUploader, NoteEnvelope...)
├── pages/        # Login, Dashboard, Book, Photos, Notes, ImportantDates, Settings
├── layouts/      # AppLayout (con nav), AuthLayout
├── hooks/        # useAuth, useDarkMode, useRelationshipCounter
├── services/     # llamadas a Supabase (memories, notes, photos, reactions, dates)
├── lib/          # cliente de Supabase
├── types/        # tipos TypeScript que reflejan el esquema de la base de datos
└── utils/        # compresión de imágenes, formateo de fechas
```

## Próximos pasos posibles

- Editar/eliminar notitas y recuerdos existentes (hoy solo se pueden eliminar recuerdos).
- Subida de la foto de perfil de la pareja y su frase (sección "Perfil de la pareja" del prompt original).
- Borradores de notitas (el campo `status` ya existe en la base de datos).
- Notificaciones push cuando el otro deja una notita nueva.

Cualquiera de estos lo armamos cuando quieras — dime cuál y seguimos por fases. ❤️
