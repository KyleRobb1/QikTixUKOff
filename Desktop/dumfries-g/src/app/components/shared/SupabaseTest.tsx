'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/server';

export default function SupabaseTest() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('places')
          .select('*')
          .limit(5);

        if (error) throw error;
        setPlaces(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, []);

  if (loading) return <div>Loading places...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Database Connection Test</h2>
      <div className="space-y-4">
        {places.map((place) => (
          <div key={place.id} className="p-4 border rounded">
            <h3 className="font-semibold">{place.name}</h3>
            <p className="text-gray-600">{place.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 