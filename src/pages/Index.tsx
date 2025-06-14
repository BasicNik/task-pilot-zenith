import React from "react";
import Navbar from "../components/Navbar";
import TaskList from "../components/TaskList";
import Dashboard from "../components/Dashboard";
import Auth from "../components/Auth";
import { useAuth } from "../hooks/useAuth";

const Index = () => {
  // Simple navigation state
  const [view, setView] = React.useState<"tasks" | "dashboard" | "login">("tasks");
  const { user, customUser, loading, logout } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        active={view}
        onNav={setView}
        loggedIn={!!user}
        onLogout={logout}
        onLoginClick={() => setView("login")}
        user={customUser}
      />
      <main className="flex-1 w-full max-w-6xl mx-auto mt-8 animate-fade-in px-6">
        {!user ? (
          <Auth onSuccess={() => setView("tasks")} />
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
