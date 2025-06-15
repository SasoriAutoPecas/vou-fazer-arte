import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type InstitutionQueryResult = Database['public']['Tables']['institutions']['Row'] & {
  users: Database['public']['Tables']['users']['Row'] & {
    addresses: Database['public']['Tables']['addresses']['Row'][];
  };
  working_hours: Database['public']['Tables']['working_hours']['Row'][];
  institution_categories: {
    categories: Database['public']['Tables']['categories']['Row'];
  }[];
};

type InstitutionWithDetails = Database['public']['Tables']['institutions']['Row'] & {
  users: Database['public']['Tables']['users']['Row'];
  addresses: Database['public']['Tables']['addresses']['Row'][];
  working_hours: Database['public']['Tables']['working_hours']['Row'][];
  institution_categories: {
    categories: Database['public']['Tables']['categories']['Row'];
  }[];
};

// Transform function to flatten the nested structure
function transformInstitutionData(institution: InstitutionQueryResult): InstitutionWithDetails {
  return {
    ...institution,
    addresses: institution.users.addresses || [],
    users: {
      ...institution.users,
      // Remove addresses from users object to avoid duplication
      addresses: undefined as any
    }
  };
}

export const institutionService = {
  async getInstitutions(filters?: {
    categories?: string[];
    institutionTypes?: string[];
    minRating?: number;
    maxDistance?: number;
    userLocation?: [number, number];
  }) {
    let query = supabase
      .from('institutions')
      .select(`
        *,
        users!inner(
          *,
          addresses(*)
        ),
        working_hours(*),
        institution_categories(
          categories(*)
        )
      `);

    // Aplicar filtros
    if (filters?.institutionTypes?.length) {
      query = query.in('institution_type', filters.institutionTypes);
    }

    if (filters?.minRating) {
      query = query.gte('average_rating', filters.minRating);
    }

    const { data, error } = await query;
    if (error) throw error;

    let institutions = (data as InstitutionQueryResult[]).map(transformInstitutionData);

    // Filtrar por categorias se especificado
    if (filters?.categories?.length) {
      institutions = institutions.filter(institution =>
        institution.institution_categories.some(ic =>
          filters.categories!.includes(ic.categories.id)
        )
      );
    }

    // Calcular distância se localização do usuário fornecida
    if (filters?.userLocation && filters?.maxDistance) {
      institutions = institutions.filter(institution => {
        const address = institution.addresses[0];
        if (!address?.latitude || !address?.longitude) return true;

        const distance = calculateDistance(
          filters.userLocation![0],
          filters.userLocation![1],
          Number(address.latitude),
          Number(address.longitude)
        );

        return distance <= filters.maxDistance!;
      });
    }

    return institutions;
  },

  async getInstitutionById(id: string) {
    const { data, error } = await supabase
      .from('institutions')
      .select(`
        *,
        users(
          *,
          addresses(*)
        ),
        working_hours(*),
        institution_categories(
          categories(*)
        ),
        reviews(
          *,
          users(full_name, avatar_url)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Transform the data structure for single institution
    const transformedData = {
      ...data,
      addresses: data.users?.addresses || [],
      users: {
        ...data.users,
        addresses: undefined as any
      }
    };
    
    return transformedData;
  },

  async updateInstitution(id: string, updates: Partial<Database['public']['Tables']['institutions']['Update']>) {
    const { data, error } = await supabase
      .from('institutions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateWorkingHours(institutionId: string, workingHours: Array<{
    dayOfWeek: number;
    openTime?: string;
    closeTime?: string;
    isClosed: boolean;
  }>) {
    // Primeiro, deletar horários existentes
    await supabase
      .from('working_hours')
      .delete()
      .eq('institution_id', institutionId);

    // Inserir novos horários
    const { error } = await supabase
      .from('working_hours')
      .insert(
        workingHours.map(wh => ({
          institution_id: institutionId,
          day_of_week: wh.dayOfWeek,
          open_time: wh.openTime,
          close_time: wh.closeTime,
          is_closed: wh.isClosed,
        }))
      );

    if (error) throw error;
  },

  async updateAcceptedCategories(institutionId: string, categoryIds: string[]) {
    // Primeiro, deletar categorias existentes
    await supabase
      .from('institution_categories')
      .delete()
      .eq('institution_id', institutionId);

    // Inserir novas categorias
    if (categoryIds.length > 0) {
      const { error } = await supabase
        .from('institution_categories')
        .insert(
          categoryIds.map(categoryId => ({
            institution_id: institutionId,
            category_id: categoryId,
          }))
        );

      if (error) throw error;
    }
  }
};

// Função auxiliar para calcular distância entre dois pontos
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}