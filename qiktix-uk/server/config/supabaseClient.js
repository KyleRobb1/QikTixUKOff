require('dotenv').config(); // Load environment variables
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL; 
// Ensure SUPABASE_ANON_KEY is used as provided in the previous step for the public anon key
const supabaseKey = process.env.SUPABASE_ANON_KEY; 

if (!supabaseUrl || !supabaseKey) {
    console.error("Error: Missing Supabase URL or Key. Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in your .env file.");
    // Optionally exit or provide default behavior if appropriate
    // process.exit(1); 
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase; 