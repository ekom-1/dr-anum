// Supabase Configuration for Admin Panel
const SUPABASE_URL = 'https://dgbxlrzxxeqploptckul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnYnhscnp4eGVxcGxvcHRja3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTEwNzYsImV4cCI6MjA4OTE2NzA3Nn0.Cr0I3h2iPWxQYNWmCUmnibzO1SULlwn_RyChEXfyAow';

// Wait for Supabase library to load
function initializeSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library not loaded');
        return false;
    }

    // Initialize Supabase client and export for use in other files
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase initialized successfully for admin panel');
    return true;
}

// Initialize immediately if library is already loaded
if (typeof window.supabase !== 'undefined') {
    initializeSupabase();
} else {
    // Wait for library to load
    window.addEventListener('load', initializeSupabase);
}

