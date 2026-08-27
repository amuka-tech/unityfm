'use server';

import { supabase } from './supabase';

// Pings the database to keep the listener active
export async function pingListener(listenerId: string) {
  try {
    const now = new Date().toISOString();
    await supabase.from('live_listeners').upsert(
      { id: listenerId, last_ping: now },
      { onConflict: 'id' }
    );
  } catch (error) {
    console.error('Failed to ping listener', error);
  }
}

// Retrieves the total count of listeners active in the last 60 seconds
export async function getLiveListenersCount() {
  try {
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
    
    // We use a select with count: exact
    const { count, error } = await supabase
      .from('live_listeners')
      .select('*', { count: 'exact', head: true })
      .gt('last_ping', oneMinuteAgo);
      
    if (error) {
      console.error('Failed to get live listeners count', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Failed to get live listeners count', error);
    return 0;
  }
}
