
import { createClient } from '@supabase/supabase-js';

const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dHpqcmNwdHVranphbm1xZGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTkwNzY0NCwiZXhwIjoyMDgxNDgzNjQ0fQ.yTNDx3szbbFmK7IOdXLoRB_ovu2-Td3_ya-di_ldJWY';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

async function main() {
  if (!SUPABASE_URL) {
    console.error('Missing Supabase URL');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const email = 'demo@example.com';
  const password = 'Password123!';
  
  console.log(`Creating verified user ${email}...`);
  
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError.message);
    return;
  }

  const existingUser = listData?.users.find(u => u.email === email);

  if (existingUser) {
    console.log('User already exists. Updating password and verifying...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { password: password, email_confirm: true, user_metadata: { full_name: 'Demo User' } }
    );
    if (updateError) {
        console.error('Error updating user:', updateError.message);
    } else {
        console.log('User updated successfully.');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    }
  } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: 'Demo User' }
      });

      if (error) {
        console.error('Error creating user:', error.message);
      } else {
        console.log('User created and verified successfully.');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
      }
  }
}

main();
