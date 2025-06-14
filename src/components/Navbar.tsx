
import React from "react";
import { CalendarCheck } from "lucide-react";

interface Props {
  active: "tasks" | "dashboard" | "login";
  onNav: (view: "tasks" | "dashboard" | "login") => void;
  loggedIn: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

const Navbar: React.FC<Props> = ({ active, onNav, loggedIn, onLogout, onLoginClick }) => {
  return (
    <header className="w-full border-b bg-white/90 sticky top-0 z-30 flex px-4 py-2 items-center shadow-sm">
      <span className="flex items-center gap-2 font-extrabold text-2xl tracking-tight text-primary">
        <CalendarCheck size={28} className="text-primary" />
        TaskPilot
      </span>
      <nav className="ml-12 flex gap-4 text-base font-medium">
        <button
          className={`px-3 py-1 rounded ${active === "tasks" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover-scale"}`}
          onClick={() => onNav("tasks")}
        >
          Tasks
        </button>
        <button
          className={`px-3 py-1 rounded ${active === "dashboard" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover-scale"}`}
          onClick={() => onNav("dashboard")}
        >
          Dashboard
        </button>
      </nav>
      <div className="ml-auto flex items-center gap-3">
        {loggedIn ? (
          <button
            className="text-red-600 border border-destructive px-3 py-1 rounded hover:bg-destructive hover:text-white transition"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className={`px-3 py-1 rounded bg-primary text-primary-foreground hover-scale`}
            onClick={onLoginClick}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
