import { supabaseAdmin } from '../supabaseAdminClient';

export const registerUser = async (email: string, password: string) => {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};