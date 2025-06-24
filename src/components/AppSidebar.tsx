
import * as React from "react"
import {
  CheckSquare,
  PieChart,
  Settings,
  Users,
  AppWindow,
  FolderOpen,
  Calendar,
} from "lucide-react"

import { NavMain } from './NavMain'
import { NavProjects } from './NavProjects'
import { NavUser } from './NavUser'
import { TeamSwitcher } from './TeamSwitcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from './ui/sidebar'
import { useAuth } from '../hooks/useAuth'

// Navigation data for TaskPilot
const data = {
  teams: [
    {
      name: "TaskPilot",
      logo: CheckSquare,
      plan: "Professional",
    },
  ],
  navMain: [
    {
      title: "Task Management",
      url: "#",
      icon: CheckSquare,
      isActive: true,
      items: [
        {
          title: "All Tasks",
          url: "#",
        },
        {
          title: "My Tasks",
          url: "#",
        },
        {
          title: "Completed",
          url: "#",
        },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: PieChart,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Reports",
          url: "#",
        },
        {
          title: "Insights",
          url: "#",
        },
      ],
    },
    {
      title: "Team",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Members",
          url: "#",
        },
        {
          title: "Permissions",
          url: "#",
        },
        {
          title: "Invitations",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
        {
          title: "Security",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Project Planning",
      url: "#",
      icon: AppWindow,
    },
    {
      name: "Team Collaboration",
      url: "#",
      icon: Users,
    },
    {
      name: "Resource Management",
      url: "#",
      icon: FolderOpen,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { customUser } = useAuth()
  
  const userData = customUser ? {
    name: customUser.username || "User",
    email: customUser.email || "",
    avatar: customUser.avatar_url || "",
  } : {
    name: "Guest",
    email: "guest@taskpilot.com",
    avatar: "",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
