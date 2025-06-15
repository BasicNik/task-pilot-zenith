
import React from "react";
import { UserDropdown } from "./UserDropdown";
import { Button } from "@/components/ui/button";

interface Props {
  active: "tasks" | "dashboard" | "login";
  onNav: (view: "tasks" | "dashboard" | "login") => void;
  loggedIn: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

const Navbar: React.FC<Props> = ({ active, onNav, loggedIn, onLogout, onLoginClick }) => {
  return (
    <header className="w-full bg-background/90 backdrop-blur-sm sticky top-0 z-30 flex px-4 py-2 items-center">
      {/* LOGO: 
          To change the logo image, modify the 'src' attribute in the <img> tag below.
          To change the logo size or its responsiveness, edit the Tailwind 'h-' classes in the className below.
          - 'h-10' sets default mobile height
          - 'md:h-12' sets medium (tablet) height
          - 'lg:h-14' sets large (desktop) height
          You can change these to values like 'h-8', 'md:h-10', 'lg:h-12', etc as you wish.
      */}
      <img
        src="/lovable-uploads/cffeaf6d-aacf-45a3-a5b3-6020cb5985cd.png"
        alt="TaskPilot Logo"
        className="h-10 md:h-12 lg:h-14 w-auto" // To adjust size: change h-10, md:h-12, lg:h-14
      />
      <nav className="ml-12 flex gap-4 text-base font-medium">
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

