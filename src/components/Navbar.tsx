
import React from "react";
import { CalendarCheck } from "lucide-react";
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
    <header className="w-full border-b bg-background/90 backdrop-blur-sm sticky top-0 z-30 flex px-4 py-2 items-center shadow-sm">
      <span className="flex items-center gap-2 font-extrabold text-2xl tracking-tight text-primary">
        <CalendarCheck size={28} className="text-primary" />
        TaskPilot
      </span>
      <nav className="ml-12 flex gap-4 text-base font-medium">
        <Button
          variant="aurora-outline"
          size="default"
          className={`w-36 ${active === "tasks" ? "opacity-100" : "opacity-70"}`}
          onClick={() => onNav("tasks")}
        >
          Tasks
        </Button>
        <Button
          variant="aurora-outline"
          size="default"
          className={`w-36 ${active === "dashboard" ? "opacity-100" : "opacity-70"}`}
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
            size="default"
            className="w-36"
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
