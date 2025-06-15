import { supabase } from '../lib/supabase';

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('donation_categories')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) throw error;
    return data;
  },

  async getCategoryById(id: string) {
    const { data, error } = await supabase
      .from('donation_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getSubcategories(categoryId: string) {
    // Since subcategories reference the old categories table, 
    // we'll return an empty array for now
    return [];
  }
};