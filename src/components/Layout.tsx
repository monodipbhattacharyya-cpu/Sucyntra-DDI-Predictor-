import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Activity, LayoutDashboard, BookMarked, Home, Pill, ShieldAlert, Menu, X, ArrowRight } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/checker", label: "Interaction Checker", icon: Activity },
  { to: "/safety", label: "Tolerance & Abuse", icon: ShieldAlert },
  { to: "/dashboard", label: "Patient Dashboard", icon: LayoutDashboard },
  { to: "/library", label: "Drug Library", icon: BookMarked },
];

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-lg amber-gradient flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-sm font-bold font-display text-foreground">SUCYNTRA</p>
              <p className="text-[8px] uppercase tracking-wider text-muted-foreground -mt-1">DDI Predictor</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-foreground/70 hover:text-foreground hover:bg-primary/5"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/checker"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg amber-gradient text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <Activity className="w-4 h-4" /> 
              <span className="hidden md:inline">Run Check</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm animate-fade-in-up">
            <nav className="flex flex-col p-3 gap-1">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={closeMobileMenu}
                  className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-foreground/70 hover:text-foreground hover:bg-primary/5"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border bg-secondary/40 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg amber-gradient flex items-center justify-center shadow-md">
                  <Pill className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-foreground">SUCYNTRA</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Evidence-based drug interaction checking powered by deterministic clinical rules.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Quick Links</h3>
              <ul className="space-y-2">
                {navItems.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Legal</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Not a substitute for professional clinical judgment. Always consult with healthcare providers for prescription decisions.
              </p>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">
                © 2024 SUCYNTRA DDI Predictor · Fully Offline Analysis
              </p>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Made with <span className="text-severe animate-pulse">♥</span> by <span className="font-semibold text-foreground">Monodip Bhattacharyya</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
