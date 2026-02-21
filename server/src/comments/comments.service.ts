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
      .select(); // <--- Add this to return the new data to the frontend

    if (error) {
      console.error("Supabase error:", error.message);
      throw error;
    }
    return data;
  }
}