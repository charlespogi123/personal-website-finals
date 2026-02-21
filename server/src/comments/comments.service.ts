import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class CommentsService {
  // Add the ! at the end of the env variables to tell TypeScript "I promise these exist"
  private supabase = createClient(
    process.env.SUPABASE_URL!, 
    process.env.SUPABASE_KEY!
  );

  async findAll() {
    const { data } = await this.supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });
    return data;
  }

  async create(username: string, content: string) {
    const { data, error } = await this.supabase
      .from('comments')
      .insert([{ username, content }])
      .select(); // <--- CRUCIAL: This returns the new comment to React

    if (error) {
      console.error("Supabase Error:", error.message);
      throw error;
    }
    return data[0]; // Return the first (and only) new comment
  }
}