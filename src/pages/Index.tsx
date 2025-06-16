import React from "react";
import Navbar from "../components/Navbar";
import TaskList from "../components/TaskList";
import Dashboard from "../components/Dashboard";
import Auth from "../components/Auth";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import AuroraBanner from "../components/AuroraBanner";

const Index = () => {
  // Simple navigation state
  const [view, setView] = React.useState<"tasks" | "dashboard" | "login">("tasks");
  const { user, customUser, loading, logout } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center animate-fade-in">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary transition-all duration-300"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Aurora Banner */}
      <AuroraBanner />
      <Navbar
        active={view}
        onNav={setView}
        loggedIn={!!user}
        onLogout={logout}
        onLoginClick={() => setView("login")}
      />
      <main className="flex-1 w-full max-w-6xl mx-auto mt-8 animate-fade-in px-4 sm:px-6">
        {!user ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Welcome to TaskPilot</h1>
              <div className="hidden lg:block">
                <ThemeToggle variant="outline" size="default" />
              </div>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground text-center max-w-md">
              A modern task management application with beautiful dark mode support
            </p>
            <Auth onSuccess={() => setView("tasks")} />
          </div>
        ) : (
          <>
            {view === "tasks" && <TaskList />}
            {view === "dashboard" && <Dashboard />}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
