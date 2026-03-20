"use client";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <h1 className="text-lg font-semibold tracking-wide">
          SnapCart<span className="text-purple-500">AI</span>
        </h1>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#" className="hover:text-white transition">Home</a>
          <a href="#" className="hover:text-white transition">About</a>
        </nav>

        {/* Button */}
        <button className="bg-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-500 transition">
          Try Demo
        </button>

      </div>

    </header>
  );
}