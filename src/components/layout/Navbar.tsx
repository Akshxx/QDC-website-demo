// ─────────────────────────────────────────────────────────────
// NAVBAR.TSX — Logo section fix
// Find the logo/image cluster and wrap it like this:
// ─────────────────────────────────────────────────────────────

// REPLACE your current logo block with this:

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

// ─────────────────────────────────────────────────────────────
// Also make sure your outer nav wrapper has:
// ─────────────────────────────────────────────────────────────

<nav className="flex items-center justify-between gap-6 px-6 py-3 ...">
  {/* Logo cluster — left */}
  <div className="flex items-center gap-3 flex-shrink-0">
    ...logos...
  </div>

  {/* Nav links — centre (use flex-1 + justify-center) */}
  <div className="flex items-center justify-center gap-1 flex-1">
    {navItems.map(...)}
  </div>

  {/* Follow Us — right */}
  <div className="flex-shrink-0">
    <Button>Follow Us →</Button>
  </div>
</nav>
