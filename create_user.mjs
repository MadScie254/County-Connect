import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://glcfoxkwsymgjuogjerb.supabase.co';
const supabaseServiceRoleKey = 'sb_secret_8WigRQ2CmnMu1cAb1yUcbg_5ysMc_vB';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function main() {
  console.log('Creating user danieleinstein1998@gmail.com...');
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'danieleinstein1998@gmail.com',
    password: '4805640@Kmt',
    email_confirm: true,
    user_metadata: {
      name: 'Daniel Einstein',
      role: 'super_admin'
    }
  });

  if (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }

  console.log('User created successfully:', data.user.id);
  
  // Wait a couple seconds to ensure trigger has fired
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Also verify they are super_admin in the profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'super_admin' })
    .eq('id', data.user.id)
    .select()
    .single();
    
  if (profileError) {
    console.error('Error updating profile:', profileError);
    process.exit(1);
  }
  
  console.log('Profile is now super_admin:', profile);
}

main();
