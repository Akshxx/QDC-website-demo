import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  // Define your navigation links here so the map function works
  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Tracks", href: "#tracks" },
    { name: "Timeline", href: "#timeline" },
  ];

  return (
    // Fixed Line 29: Removed the "..." from the className
    <nav className="flex items-center justify-between gap-6 px-6 py-3 bg-white w-full border-b border-gray-100">
      
      {/* Fixed Line 32: Replaced "...logos..." with the actual logo cluster code */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          {/* QDC Logo */}
          <Image src="/images/qdc.png" alt="QDC Logo" width={48} height={48} style={{ objectFit: "contain" }} />

          {/* Vertical divider */}
          <div style={{ width: 1, height: 36, background: "rgba(0,0,0,0.12)" }} />

          {/* SRM Logo */}
          <Image src="/images/srmlogo.png" alt="SRM" width={90} height={40} style={{ objectFit: "contain" }} />

          {/* SOC Logo */}
          <Image src="/images/soc.png" alt="SOC" width={36} height={36} style={{ objectFit: "contain" }} />

          {/* NWC Logo */}
          <Image src="/images/nwc.png" alt="NWC" width={36} height={36} style={{ objectFit: "contain" }} />
        </div>
      </div>

      {/* Fixed Line 37: Replaced "{navItems.map(...)}" with actual mapping logic */}
      <div className="flex items-center justify-center gap-6 flex-1">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className="text-sm font-semibold text-gray-600 hover:text-black transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Follow Us — right */}
      <div className="flex-shrink-0">
        <a 
          href="https://www.instagram.com/qdc_srmist/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <button className="bg-black text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors">
            Follow Us →
          </button>
        </a>
      </div>

    </nav>
  );
}
