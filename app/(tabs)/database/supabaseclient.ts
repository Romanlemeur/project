
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://suqlntdtdnrqcnkioxxp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1cWxudGR0ZG5ycWNua2lveHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODMyMzcsImV4cCI6MjA1OTM1OTIzN30.2Xc03vLsRmBqsDSw0tCaiSHJMzfqVlnVeEa1r-rBCIE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
