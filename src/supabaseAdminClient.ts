// src/supabaseAdminClient.ts

import { createClient } from '@supabase/supabase-js';

// --- PRUEBA DE DIAGNÓSTICO ---
// Vamos a ignorar el .env temporalmente.

const supabaseUrl = 'https://vowxllznupxfflplzsff.supabase.co'; // Tu URL
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvd3hsbHpudXB4ZmZscGx6c2ZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ4OTU2MCwiZXhwIjoyMDcyMDY1NTYwfQ.IeQ-Ub55siDMQwEQZDNtsIxfZOse36FXJUHgOboltxk'; // Pega la clave aquí

console.log('--- INICIALIZANDO SUPABASE ADMIN CLIENT ---');
if (!supabaseServiceKey || supabaseServiceKey.length < 50) {
  console.error('¡ERROR FATAL! La service_role key parece incorrecta o no está definida.');
} else {
  console.log('Cliente Admin inicializado con una service_role key.');
}
// --- FIN DE LA PRUEBA ---

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);