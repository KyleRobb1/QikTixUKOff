import Image from 'next/image';
import Link from 'next/link';
import { places } from '@/data/places';

const categories = ["All", "Historic", "Nature", "Family", "Food & Drink", "Activities"];

export default function PlacesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px]">
        <Image
          src="/images/places-hero.jpg"
          alt="Dumfries & Galloway Places"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore Places
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Discover the best attractions, hidden gems, and must-visit locations in Dumfries & Galloway
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Search places..."
                className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place) => (
            <Link key={place.id} href={`/places/${place.id}`} className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-64">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {place.name}
                    </h2>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {place.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {place.description}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {place.location}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 