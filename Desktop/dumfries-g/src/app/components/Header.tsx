import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl hover:text-blue-100">
            D&G Explorer
          </Link>
          <div className="flex space-x-4">
            <Link href="/places" className="hover:text-blue-100 px-3 py-2">
              Places
            </Link>
            <Link href="/places" className="hover:text-blue-100 px-3 py-2">
              Walks
            </Link>
            <Link href="/places" className="hover:text-blue-100 px-3 py-2">
              My Trips
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
} 