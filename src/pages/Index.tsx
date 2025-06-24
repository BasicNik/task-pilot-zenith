
import React from "react";
import { AppSidebar } from "../components/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Separator } from "../components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import TaskList from "../components/TaskList";
import Dashboard from "../components/Dashboard";
import Auth from "../components/Auth";
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

  // If not logged in, show auth page
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AuroraBanner />
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Welcome to TaskPilot</h1>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground text-center max-w-md">
              A modern task management application with beautiful dark mode support
            </p>
            <Auth onSuccess={() => setView("tasks")} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <AuroraBanner />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#" onClick={() => setView("tasks")}>
                        TaskPilot
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {view === "tasks" ? "Task Management" : "Dashboard"}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="ml-auto flex items-center gap-2 px-4">
                <button
                  onClick={() => setView("tasks")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    view === "tasks" 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setView("dashboard")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    view === "dashboard" 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  Dashboard
                </button>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {view === "tasks" && <TaskList />}
              {view === "dashboard" && <Dashboard />}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
