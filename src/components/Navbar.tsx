
import React from "react";
import { UserDropdown } from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  AppWindow,
  PieChart,
  CheckSquare,
  ChevronDown,
  Phone,
  PlayCircle,
  Users,
  Github,
} from "lucide-react";

interface Props {
  active: "tasks" | "dashboard" | "login";
  onNav: (view: "tasks" | "dashboard" | "login") => void;
  loggedIn: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

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

const Navbar: React.FC<Props> = ({ active, onNav, loggedIn, onLogout, onLoginClick }) => {
  return (
    <header className="w-full bg-background/90 backdrop-blur-sm sticky top-0 z-30 flex px-4 py-2 items-center">
      {/* LOGO: ... */}
      <img
        src="/lovable-uploads/cffeaf6d-aacf-45a3-a5b3-6020cb5985cd.png"
        alt="TaskPilot Logo"
        className="h-10 md:h-12 lg:h-14 w-auto" // To adjust size: change h-10, md:h-12, lg:h-14
      />
      <nav className="ml-12 flex items-center gap-4 text-base font-medium">
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
            <div className="p-4">
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
            <div className="grid grid-cols-2 divide-x divide-border bg-muted/40">
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
              className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-foreground hover:bg-muted/80 transition-colors bg-muted/40 border-t border-border"
            >
              <Github className="h-5 w-5 flex-none text-muted-foreground" />
              About me
            </a>
          </HoverCardContent>
        </HoverCard>
      </nav>
      <div className="ml-auto flex items-center gap-3">
        {loggedIn ? (
          <UserDropdown />
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
    </header>
  );
};

export default Navbar;
