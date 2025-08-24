import { supabase } from './supabase';

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1);

    if (error && error.code === 'PGRST116') {
      // Table doesn't exist, but connection is working
      console.log('✅ Supabase connection successful');
      return { success: true, message: 'Connection established' };
    }

    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Supabase connection and query successful');
    return { success: true, message: 'Connection and query successful', data };
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Initialize Supabase with auth state listener
export function initializeSupabase() {
  console.log('🚀 Initializing Supabase...');

  // Set up auth state change listener
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.email || 'No user');
  });

  // Test connection
  testSupabaseConnection();

  return {
    subscription,
    cleanup: () => {
      subscription.unsubscribe();
    },
  };
}

// Get Supabase client info
export function getSupabaseInfo() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasUrl = !!url;
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return {
    url: hasUrl ? url : 'Not configured',
    hasCredentials: hasUrl && hasKey,
    status: hasUrl && hasKey ? 'Ready' : 'Missing environment variables',
  };
}
