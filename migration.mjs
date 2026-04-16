import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres.ddhfzgsojpgvacosoxdp:Pratyush2006@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

const migrationSQL = `
BEGIN;

-- 1. Insert existing users into auth.users 
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, recovery_sent_at, last_sign_in_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
  confirmation_token, email_change, email_change_token_new, recovery_token
)
SELECT 
  '00000000-0000-0000-0000-000000000000', 
  id::uuid, 
  'authenticated', 
  'authenticated', 
  username || '@hushlink.app', 
  crypt("password", gen_salt('bf')), 
  now(), now(), now(), 
  '{"provider":"email","providers":["email"]}', 
  '{}', 
  "createdAt", "createdAt", 
  '', '', '', ''
FROM public."User";

-- Insert into auth.identities to ensure login with email works properly
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
SELECT
  id::uuid, id::uuid, 
  json_build_object('sub', id, 'email', username || '@hushlink.app'), 
  'email', now(), "createdAt", "createdAt"
FROM public."User";

-- 2. Drop the password column from public.User
ALTER TABLE public."User" DROP COLUMN "password";

-- 3. Enable RLS
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ChatRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Message" ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- User policies
CREATE POLICY "Public users are viewable by everyone." 
ON public."User" FOR SELECT USING ( true );

CREATE POLICY "Users can insert their own profile." 
ON public."User" FOR INSERT WITH CHECK ( auth.uid()::text = id );

CREATE POLICY "Users can update own profile." 
ON public."User" FOR UPDATE USING ( auth.uid()::text = id );

-- ChatRequest policies
CREATE POLICY "Users can view their own chat requests." 
ON public."ChatRequest" FOR SELECT USING ( auth.uid()::text = "senderId" OR auth.uid()::text = "receiverId" );

CREATE POLICY "Users can insert chat requests as sender." 
ON public."ChatRequest" FOR INSERT WITH CHECK ( auth.uid()::text = "senderId" );

CREATE POLICY "Users can update chat requests they received." 
ON public."ChatRequest" FOR UPDATE USING ( auth.uid()::text = "receiverId" );

CREATE POLICY "Users can delete their own chat requests." 
ON public."ChatRequest" FOR DELETE USING ( auth.uid()::text = "senderId" OR auth.uid()::text = "receiverId" );

-- Message policies
CREATE POLICY "Users can view their own messages." 
ON public."Message" FOR SELECT USING ( auth.uid()::text = "senderId" OR auth.uid()::text = "receiverId" );

CREATE POLICY "Users can insert messages as sender." 
ON public."Message" FOR INSERT WITH CHECK ( auth.uid()::text = "senderId" );

COMMIT;
`;

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to DB');
    await client.query(migrationSQL);
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
