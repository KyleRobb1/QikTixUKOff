import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[600px] w-full">
        <Image
          src="/images/hero-dumfries.jpg"
          alt="Dumfries & Galloway Landscape"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Discover Dumfries & Galloway
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Explore Scotland&apos;s hidden gem with its stunning landscapes, rich history, and unforgettable experiences
            </p>
            
            {/* Search Bar */}
            <div className="w-full max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for places, walks, or activities..."
                  className="w-full px-6 py-4 rounded-full bg-white/95 shadow-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/places" className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-48">
                  <Image
                    src="/images/places-card.jpg"
                    alt="Historic Places"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Explore Places
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Discover historic castles, charming towns, and hidden gems throughout the region
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/places" className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-48">
                  <Image
                    src="/images/walks-card.jpg"
                    alt="Walking Routes"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Walking Routes
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Find beautiful trails and scenic walks for all experience levels
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/places" className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-48">
                  <Image
                    src="/images/trips-card.jpg"
                    alt="Plan Your Trip"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Plan Your Trip
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Create your perfect itinerary and make the most of your visit
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of visitors who have discovered the beauty of Dumfries & Galloway
          </p>
          <Link 
            href="/places" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Exploring
          </Link>
        </div>
      </div>
    </main>
  );
}
