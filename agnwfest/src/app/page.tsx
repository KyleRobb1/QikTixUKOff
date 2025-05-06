import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-agnwBlack text-white font-body">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-agnwBlack/80 border-b border-agnwGrey backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/">
            <Image src="/logo.svg" alt="AGNW Logo" width={56} height={56} className="h-12 w-12" />
          </Link>
          <ul className="flex gap-8 font-headline text-lg tracking-widest">
            <li><a href="#lineup" className="hover:text-neonGreen transition">Line-Up</a></li>
            <li><a href="#tickets" className="hover:text-neonGreen transition">Tickets</a></li>
            <li><a href="#info" className="hover:text-neonGreen transition">Info</a></li>
            <li><a href="#sustainability" className="hover:text-neonGreen transition">Sustainability</a></li>
            <li><a href="#gallery" className="hover:text-neonGreen transition">Media</a></li>
          </ul>
        </div>
      </nav>
      {/* Hero Section */}
      <header className="relative flex flex-col justify-center items-center h-screen bg-agnwBlack overflow-hidden pt-24">
        {/* Optional: Add a video or animated background here */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <Image src="/logo.svg" alt="AGNW Festival" width={192} height={192} className="w-48 mb-8" />
          <h1 className="font-headline text-5xl md:text-7xl text-white tracking-widest text-center animate-flicker drop-shadow-lg">
            Shift the Frequency.
          </h1>
          <p className="mt-4 text-neonGreen text-3xl font-headline animate-glitch">30.05.26</p>
          <div className="mt-10 flex gap-6">
            <a href="#tickets" className="bg-neonGreen text-black font-bold px-8 py-3 rounded-md text-xl tracking-widest animate-flicker hover:animate-glitch transition-all duration-150 shadow-lg">BUY TICKETS</a>
            <a href="#lineup" className="bg-agnwGrey text-white border border-neonGreen font-bold px-8 py-3 rounded-md text-xl tracking-widest hover:bg-neonGreen hover:text-black transition-all duration-150 shadow-lg">SEE LINE-UP</a>
          </div>
        </div>
      </header>
    </div>
  );
}

