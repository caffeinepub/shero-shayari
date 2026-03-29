import { Button } from "@/components/ui/button";
import { useProfile } from "@/context/ProfileContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useLocation } from "@tanstack/react-router";
import { Loader2, LogIn, LogOut, Menu, PenLine, User, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, identity, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const { profile, setProfile } = useProfile();

  const isLoggedIn = !!identity;

  const handleLogout = () => {
    setProfile(null);
    clear();
    setMobileOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/feed", label: "Feed" },
    { to: "/discover", label: "Discover" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
            <PenLine className="w-4 h-4 text-gold" />
          </div>
          <span className="font-display text-lg font-bold text-gold tracking-wide">
            Shero Shayari
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={`nav.${link.label.toLowerCase()}.link`}
              className={`text-sm font-medium transition-colors hover:text-gold ${
                location.pathname === link.to
                  ? "text-gold"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn && profile ? (
            <>
              {/* Profile avatar + name */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20">
                {profile.profilePicture ? (
                  <ProfileAvatar
                    blob={profile.profilePicture}
                    name={profile.name}
                    size={6}
                  />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: "#C9A84C", color: "#1B1F22" }}
                  >
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs text-gold font-medium max-w-[120px] truncate">
                  {profile.name}
                </span>
              </div>
              <Button
                variant="ghost"
                data-ocid="header.logout.button"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-gold hover:bg-gold/10 text-sm px-3"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            </>
          ) : isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20">
                <User className="w-3.5 h-3.5 text-gold" />
                <span className="text-xs text-gold">Connected</span>
              </div>
              <Button
                variant="ghost"
                data-ocid="header.logout.button"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-gold hover:bg-gold/10 text-sm px-3"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              data-ocid="header.login.button"
              onClick={login}
              disabled={isInitializing || isLoggingIn}
              className="border-gold/50 text-gold bg-transparent hover:bg-gold/10 hover:text-gold text-sm px-4"
            >
              {isInitializing || isLoggingIn ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-1.5" />
              )}
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          )}
          <Link to="/compose">
            <Button
              data-ocid="header.add_shayari.button"
              className="font-semibold text-sm px-5"
              style={{ backgroundColor: "#CFA2A8", color: "#1B1F22" }}
            >
              <PenLine className="w-4 h-4 mr-2" />
              Add Shayari
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden text-muted-foreground hover:text-gold"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gold/20 bg-charcoal px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 transition-colors hover:text-gold ${
                location.pathname === link.to
                  ? "text-gold"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/compose" onClick={() => setMobileOpen(false)}>
            <Button
              className="w-full mt-2 font-semibold"
              style={{ backgroundColor: "#CFA2A8", color: "#1B1F22" }}
            >
              <PenLine className="w-4 h-4 mr-2" />
              Add Shayari
            </Button>
          </Link>
          {isLoggedIn ? (
            <div className="space-y-2 pt-1">
              {profile && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold/10 border border-gold/20">
                  <User className="w-3.5 h-3.5 text-gold" />
                  <span className="text-xs text-gold">{profile.name}</span>
                </div>
              )}
              <Button
                variant="ghost"
                data-ocid="header.mobile.logout.button"
                onClick={handleLogout}
                className="w-full text-muted-foreground hover:text-gold hover:bg-gold/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              data-ocid="header.mobile.login.button"
              onClick={() => {
                login();
                setMobileOpen(false);
              }}
              disabled={isInitializing || isLoggingIn}
              className="w-full border-gold/50 text-gold bg-transparent hover:bg-gold/10 hover:text-gold"
            >
              {isInitializing || isLoggingIn ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          )}
        </div>
      )}
    </header>
  );
}

function ProfileAvatar({
  blob,
  name,
  size,
}: {
  blob: { getDirectURL(): string };
  name: string;
  size: number;
}) {
  const url = blob.getDirectURL();
  const sizeClass = `w-${size} h-${size}`;
  return (
    <img
      src={url}
      alt={name}
      className={`${sizeClass} rounded-full object-cover`}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
