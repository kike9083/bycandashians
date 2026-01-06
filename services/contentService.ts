
import { supabase } from './supabaseClient';

export const contentService = {
  async getContent(key: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        console.error('Error fetching content:', error);
      }
      return null;
    }

    return data?.value || null;
  },

  async getAllContent(): Promise<Record<string, string>> {
    const { data, error } = await supabase
      .from('site_content')
      .select('key, value');

    if (error) {
      console.error('Error fetching all content:', error);
      return {};
    }

    return data.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {});
  },

  async updateContent(key: string, value: string): Promise<boolean> {
    const { error } = await supabase
      .from('site_content')
      .upsert({ key, value, updated_at: new Date().toISOString() });

    if (error) {
      console.error('Error updating content:', error);
      return false;
    }

    return true;
  }
};
