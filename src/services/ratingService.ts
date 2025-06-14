import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type RatingInsert = Database['public']['Tables']['ratings']['Insert'];

export const ratingService = {
  async createRating(rating: Omit<RatingInsert, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('ratings')
      .insert(rating)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRatingsByInstitution(institutionId: string) {
    const { data, error } = await supabase
      .from('ratings')
      .select(`
        *,
        users(name, avatar_url),
        donations(title)
      `)
      .eq('institution_id', institutionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateRatingResponse(ratingId: string, response: string) {
    const { data, error } = await supabase
      .from('ratings')
      .update({ response })
      .eq('id', ratingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async checkUserCanRate(donorId: string, institutionId: string, donationId: string) {
    // Verificar se a doação foi entregue
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .select('status')
      .eq('id', donationId)
      .eq('donor_id', donorId)
      .eq('institution_id', institutionId)
      .single();

    if (donationError) throw donationError;
    if (donation.status !== 'delivered') {
      throw new Error('Só é possível avaliar após a entrega da doação');
    }

    // Verificar se já avaliou
    const { data: existingRating } = await supabase
      .from('ratings')
      .select('id')
      .eq('donor_id', donorId)
      .eq('institution_id', institutionId)
      .eq('donation_id', donationId)
      .single();

    if (existingRating) {
      throw new Error('Você já avaliou esta doação');
    }

    return true;
  }
};