import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class CommentsService {
  // Hardcoding the credentials directly to bypass .env issues
  private supabase = createClient(
    'https://mfqubfjakdfsmsszaxai.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcXViZmpha2Rmc21zc3pheGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NjkxODcsImV4cCI6MjA4NzI0NTE4N30.Q7VjclZFeK9kjV1qohE4iLTilOJlVS0o10b8OYqG8PM'
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
      .select();

    if (error) {
      console.error("Supabase Error:", error.message);
      throw error;
    }
    return data ? data[0] : null; 
  }
}