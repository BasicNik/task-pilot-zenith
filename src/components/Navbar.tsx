
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
      <img src="/lovable-uploads/217b89ba-5dee-4e18-a30f-fb0110e23217.png" alt="TaskPilot Logo" className="h-8 w-auto" />
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
