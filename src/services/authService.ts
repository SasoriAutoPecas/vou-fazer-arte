import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type UserType = Database['public']['Enums']['user_type'];
type InstitutionType = Database['public']['Enums']['institution_type'];

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  cpf?: string;
  cnpj?: string;
  userType: UserType;
  institutionType?: InstitutionType;
  description?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
  };
}

export const authService = {
  async signUp(data: RegisterData) {
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Falha ao criar usuário');

    // 2. Criar perfil do usuário
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        cpf: data.cpf,
        cnpj: data.cnpj,
        user_type: data.userType,
      });

    if (userError) throw userError;

    // 3. Criar endereço
    const { error: addressError } = await supabase
      .from('addresses')
      .insert({
        user_id: authData.user.id,
        street: data.address.street,
        number: data.address.number,
        complement: data.address.complement,
        neighborhood: data.address.neighborhood,
        city: data.address.city,
        state: data.address.state,
        zip_code: data.address.zipCode,
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      });

    if (addressError) throw addressError;

    // 4. Se for instituição, criar dados específicos
    if (data.userType === 'institution' && data.institutionType && data.description) {
      const { error: institutionError } = await supabase
        .from('institutions')
        .insert({
          user_id: authData.user.id,
          description: data.description,
          institution_type: data.institutionType,
        });

      if (institutionError) throw institutionError;
    }

    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Buscar dados completos do usuário
    const { data: userData, error } = await supabase
      .from('users')
      .select(`
        *,
        addresses(*),
        institutions(*)
      `)
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return userData;
  },

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = await this.getCurrentUser();
        callback(userData);
      } else {
        callback(null);
      }
    });
  }
};