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
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 w-full max-w-md">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Welcome to TaskPilot</h1>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground text-center">
              A modern task management application with beautiful dark mode support
            </p>
            <Auth onSuccess={() => setView("tasks")} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <AuroraBanner />
      <div className="min-h-screen w-full bg-background">
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border/40">
                <div className="flex items-center gap-2 px-3 sm:px-4 w-full">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb className="hidden sm:block">
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
                  <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setView("tasks")}
                      className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                        view === "tasks" 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      }`}
                    >
                      Tasks
                    </button>
                    <button
                      onClick={() => setView("dashboard")}
                      className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                        view === "dashboard" 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      }`}
                    >
                      Dashboard
                    </button>
                  </div>
                </div>
              </header>
              <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {view === "tasks" ? <TaskList /> : <Dashboard />}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};

export default Index;
