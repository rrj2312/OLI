import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/submit", label: "Audit Project" },
  { to: "/portfolio", label: "PortfolioShield" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center">
          <span
            className="text-5xl font-bold tracking-wide"
            style={{
              fontFamily: "Futura, sans-serif",
              fontWeight: 600,
              background: "linear-gradient(90deg, #74b72a 30%, #14a09d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            OLI
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
