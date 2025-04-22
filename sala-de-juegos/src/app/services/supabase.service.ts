import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService
{
  url: string = "https://hyrqyhaafqgfwofdhqzq.supabase.co";
  key: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cnF5aGFhZnFnZndvZmRocXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyOTUxODIsImV4cCI6MjA2MDg3MTE4Mn0.pz5UNlb9g1Bf3dyqeJMDGvirtNdQpt04KdZ9p2Cek6o";
  supabase: SupabaseClient;

  constructor()
  {
    this.supabase = createClient(this.url, this.key);
  }

  get client(): SupabaseClient
  {
    return this.supabase;
  }
}
