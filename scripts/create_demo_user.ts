
import { createClient } from '@supabase/supabase-js';

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const email = 'testuser123@gmail.com';
  const password = 'Password123!';
  
  console.log(`Attempting to sign in ${email}...`);
  
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!signInError && signInData.session) {
    console.log('Sign in successful! Credentials are valid.');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    return;
  }

  console.log('Sign in failed:', signInError?.message);
  console.log('Attempting to create user...');
  
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'Demo User',
      },
    },
  });

  if (signUpError) {
    console.error('Error creating user:', signUpError.message);
  } else {
    console.log('User created successfully.');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    if (signUpData.session) {
        console.log('Session created automatically.');
    } else {
        console.log('User created but session not established immediately. Email verification might be required.');
    }
  }
}

main();
