'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Place } from '@/types/place';

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={place.imageUrl}
          alt={place.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {place.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {place.category}
          </span>
          <Link
            href={`/places/${place.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
} 