import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useSupabase<T>(tableName: string, queryOpts?: { order?: string, ascending?: boolean }) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        let query = supabase.from(tableName).select('*');
        if (queryOpts?.order) {
          query = query.order(queryOpts.order, { ascending: queryOpts.ascending ?? false });
        }
        
        const { data: result, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        if (isMounted && result) {
          setData(result as unknown as T[]);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err);
          console.error(`Error fetching ${tableName}:`, err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    // Set up realtime subscription
    const channel = supabase.channel(`public:${tableName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => {
        // Simple reload strategy for now
        fetchData();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [tableName, queryOpts?.order, queryOpts?.ascending]);

  return { data, loading, error };
}
