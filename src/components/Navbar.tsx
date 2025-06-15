
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Menu, AppWindow, PieChart, CheckSquare, ChevronDown, Phone, PlayCircle, Users, Github } from "lucide-react";

// Props interface for the Navbar
interface Props {
  active: "tasks" | "dashboard" | "login";
  onNav: (view: "tasks" | "dashboard" | "login") => void;
  loggedIn: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

// Feature menu data for desktop dropdown
const features = [
  {
    name: "Task Management",
    description: "Organize and track your tasks efficiently.",
    href: "#",
    icon: CheckSquare,
  },
  {
    name: "Project Planning",
    description: "Plan your projects from start to finish.",
    href: "#",
    icon: AppWindow,
  },
  {
    name: "Team Collaboration",
    description: "Work together with your team in real-time.",
    href: "#",
    icon: Users,
  },
  {
    name: "Analytics & Reporting",
    description: "Gain insights into your team's productivity.",
    href: "#",
    icon: PieChart,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircle },
  { name: "Contact support", href: "#", icon: Phone },
];

// The responsive Navbar component
const Navbar: React.FC<Props> = ({ active, onNav, loggedIn, onLogout, onLoginClick }) => {
  // State to control mobile menu visibility
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // When a link is clicked (mobile), close menu and navigate
  const handleMobileNav = (view: "tasks" | "dashboard" | "login") => {
    setIsMobileOpen(false);
    onNav(view);
  };

  // Handler to close mobile menu on background or link click
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      {/* NAVBAR HEADER: sticky at the top */}
      <header className="w-full bg-background/90 backdrop-blur-sm sticky top-0 z-40 flex items-center px-4 py-2 shadow-none">
        {/* Logo, always visible */}
        <img
          src="/lovable-uploads/cffeaf6d-aacf-45a3-a5b3-6020cb5985cd.png"
          alt="TaskPilot Logo"
          className="h-10 md:h-12 lg:h-14 w-auto"
        />
        {/* Desktop Navigation links - hidden on mobile */}
        <nav className="hidden lg:flex ml-12 items-center gap-4 text-base font-medium">
          <Button
            variant={active === "tasks" ? "aurora-outline" : "ghost"}
            size="xs"
            className={`w-28 ${active === "tasks" ? "aurora-glow nav-active" : ""}`}
            onClick={() => onNav("tasks")}
          >
            Tasks
          </Button>
          <Button
            variant={active === "dashboard" ? "aurora-outline" : "ghost"}
            size="xs"
            className={`w-28 ${active === "dashboard" ? "aurora-glow nav-active" : ""}`}
            onClick={() => onNav("dashboard")}
          >
            Dashboard
          </Button>
          {/* Features menu (only for desktop) */}
          <HoverCard openDelay={0} closeDelay={50}>
            <HoverCardTrigger asChild>
              <Button
                variant="ghost"
                size="xs"
                className="w-28 flex items-center gap-1 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground cursor-default"
                onClick={(e) => e.preventDefault()}
              >
                <span>Features</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-screen max-w-md mt-2 rounded-xl p-0 overflow-hidden shadow-lg">
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <linearGradient id="feature-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#da4af7" />
                    <stop offset="100%" stopColor="#fd8a4a" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="p-4 bg-popover">
                {features.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="p-3 flex items-start rounded-lg hover:bg-muted transition-colors"
                  >
                    <item.icon
                      className="flex-shrink-0 h-6 w-6 mt-1"
                      stroke="url(#feature-icon-gradient)"
                    />
                    <div className="ml-4">
                      <p className="text-base font-medium text-foreground">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
              <div className="grid grid-cols-2 divide-x divide-border bg-muted">
                {callsToAction.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-foreground hover:bg-muted/80 transition-colors"
                  >
                    <item.icon className="h-5 w-5 flex-none text-muted-foreground" />
                    {item.name}
                  </a>
                ))}
              </div>
              <a
                href="https://github.com/BasicNik"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-foreground hover:bg-muted/80 transition-colors bg-muted border-t border-border"
              >
                <Github className="h-5 w-5 flex-none text-muted-foreground" />
                About me
              </a>
            </HoverCardContent>
          </HoverCard>
        </nav>
        {/* Desktop User Actions - hidden on mobile */}
        <div className="hidden lg:flex ml-auto items-center gap-3">
          {loggedIn ? (
            // User profile dropdown/interface if logged in (componentized version)
            // You could further document its logic in its own file.
            <>{/* <UserDropdown /> */}</>
          ) : (
            <Button
              variant="aurora-outline"
              size="xs"
              className="w-28"
              onClick={onLoginClick}
            >
              Login
            </Button>
          )}
        </div>
        {/* Hamburger for mobile - shown on sm/md, hidden on large screens */}
        <button
          className="lg:hidden ml-auto flex items-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
          onClick={() => setIsMobileOpen((v) => !v)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-7 w-7 text-muted-foreground" />
        </button>
      </header>

      {/* MOBILE NAVIGATION OVERLAY */}
      {isMobileOpen && (
        // Overlay background, closes menu on click
        <div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={closeMobile}
          aria-label="Close navigation menu"
        >
          {/* The navigation drawer itself */}
          <nav
            className="absolute top-0 right-0 w-4/5 max-w-xs bg-background/95 h-full shadow-lg flex flex-col animate-slide-in-left"
            onClick={(e) => e.stopPropagation()} // Prevent bubble to overlay
            aria-label="Mobile Navigation Drawer"
          >
            {/* Close control */}
            <div className="flex justify-end p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobile}
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <Menu className="rotate-90 w-6 h-6" />
              </Button>
            </div>
            {/* App Logo again (small) */}
            <div className="flex justify-center mb-4">
              <img
                src="/lovable-uploads/cffeaf6d-aacf-45a3-a5b3-6020cb5985cd.png"
                alt="TaskPilot Logo"
                className="h-10"
              />
            </div>
            {/* Primary links */}
            <div className="flex flex-col gap-1 mx-4">
              <Button
                variant={active === "tasks" ? "aurora-outline" : "ghost"}
                size="lg"
                className={`mb-1 ${active === "tasks" ? "aurora-glow nav-active" : ""}`}
                onClick={() => handleMobileNav("tasks")}
                block
              >
                Tasks
              </Button>
              <Button
                variant={active === "dashboard" ? "aurora-outline" : "ghost"}
                size="lg"
                className={`mb-1 ${active === "dashboard" ? "aurora-glow nav-active" : ""}`}
                onClick={() => handleMobileNav("dashboard")}
                block
              >
                Dashboard
              </Button>
            </div>
            {/* Features, calls-to-action etc for mobile (stacked) */}
            <div className="mt-6 border-t border-muted pt-3 mx-4 flex flex-col gap-1">
              <span className="text-muted-foreground text-xs mb-1 mt-2 font-semibold">Features</span>
              {features.map((item, idx) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center py-2 px-2 rounded hover:bg-muted/70 gap-2"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </a>
              ))}
              <div className="flex flex-row gap-2 mt-4">
                {callsToAction.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-1 rounded px-3 py-2 text-foreground hover:bg-muted/80 text-sm font-semibold transition"
                  >
                    <item.icon className="h-5 w-5 flex-none text-muted-foreground" />
                    {item.name}
                  </a>
                ))}
              </div>
              <a
                href="https://github.com/BasicNik"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-2 p-2 font-semibold text-foreground hover:bg-muted/80 transition-colors mt-2 mb-2"
              >
                <Github className="h-5 w-5 flex-none text-muted-foreground" />
                About me
              </a>
            </div>
            {/* Bottom actions: login/logout */}
            <div className="flex flex-col gap-2 mt-auto mb-6 mx-4">
              {loggedIn ? (
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    closeMobile();
                    onLogout();
                  }}
                  block
                >
                  Logout
                </Button>
              ) : (
                <Button
                  variant="aurora-outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    closeMobile();
                    onLoginClick();
                  }}
                  block
                >
                  Login
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;

