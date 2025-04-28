import { notFound } from 'next/navigation';
import { Place } from '@/types/place';
import { createClient } from '@/utils/supabase/server';

export default async function PlacePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  const { data: place } = await supabase
    .from('places')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!place) {
    notFound();
  }

  const placeData = place as Place;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Image */}
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <img
            src={placeData.imageUrl}
            alt={placeData.name}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{placeData.name}</h1>
          <p className="text-lg text-gray-700">{placeData.description}</p>

          {/* Highlights */}
          {placeData.highlights && placeData.highlights.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Highlights</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {placeData.highlights.map((highlight, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold">{highlight.title}</h3>
                    <p className="text-gray-600">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Location</h2>
            <p>{placeData.address}</p>
            <div className="h-[300px] bg-gray-100 rounded-lg">
              {/* Map component will go here */}
            </div>
          </div>

          {/* Contact */}
          {(placeData.website || placeData.phone) && (
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Contact</h2>
              {placeData.website && (
                <p>
                  <a
                    href={placeData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </p>
              )}
              {placeData.phone && (
                <p>
                  <a
                    href={`tel:${placeData.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {placeData.phone}
                  </a>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div>
          <a
            href="/places"
            className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            ← Back to Places
          </a>
        </div>
      </div>
    </main>
  );
} 