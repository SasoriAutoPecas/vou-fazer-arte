import { supabase } from '../lib/supabase';

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        subcategories(*)
      `)
      .order('name');

    if (error) throw error;
    return data;
  },

  async getCategoryById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        subcategories(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getSubcategories(categoryId: string) {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('name');

    if (error) throw error;
    return data;
  }
};