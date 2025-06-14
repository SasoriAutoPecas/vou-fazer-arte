import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type DonationInsert = Database['public']['Tables']['donations']['Insert'];
type DonationUpdate = Database['public']['Tables']['donations']['Update'];

export const donationService = {
  async createDonation(donation: Omit<DonationInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('donations')
      .insert(donation)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDonationsByDonor(donorId: string) {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        categories(name),
        subcategories(name),
        institutions(
          users(name, avatar_url)
        )
      `)
      .eq('donor_id', donorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getDonationsByInstitution(institutionId: string) {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        categories(name),
        subcategories(name),
        users!donations_donor_id_fkey(name, avatar_url, phone)
      `)
      .eq('institution_id', institutionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateDonation(id: string, updates: DonationUpdate) {
    const { data, error } = await supabase
      .from('donations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDonation(id: string) {
    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async scheduleDonation(donationId: string, institutionId: string, scheduledDate: string, notes?: string) {
    // Atualizar status da doação
    await this.updateDonation(donationId, {
      status: 'scheduled',
      scheduled_date: scheduledDate,
      institution_id: institutionId
    });

    // Criar agendamento
    const { data, error } = await supabase
      .from('schedules')
      .insert({
        donation_id: donationId,
        donor_id: (await supabase.from('donations').select('donor_id').eq('id', donationId).single()).data?.donor_id,
        institution_id: institutionId,
        scheduled_date: scheduledDate,
        notes,
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};