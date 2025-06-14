
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import TaskList from "../components/TaskList";
import Dashboard from "../components/Dashboard";
import MockAuth from "../components/MockAuth";

const Index = () => {
  // Simple navigation state
  const [view, setView] = useState<"tasks" | "dashboard" | "login">("tasks");
  // Store the login state (authentication will use backend later)
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  // Optional: persist login state (mock)
  React.useEffect(() => {
    const saved = localStorage.getItem("tp_logged_in");
    if (saved) setLoggedIn(saved === "true");
  }, []);
  React.useEffect(() => {
    localStorage.setItem("tp_logged_in", loggedIn ? "true" : "false");
  }, [loggedIn]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        active={view}
        onNav={setView}
        loggedIn={loggedIn}
        onLogout={() => setLoggedIn(false)}
        onLoginClick={() => setView("login")}
      />
      <main className="flex-1 w-full max-w-6xl mx-auto mt-8 animate-fade-in px-6">
        {!loggedIn ? (
          <MockAuth onLogin={() => { setLoggedIn(true); setView("tasks"); }} />
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
