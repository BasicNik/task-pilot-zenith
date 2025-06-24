import * as React from "react"
import {
  CheckSquare,
  PieChart,
  Settings,
  Users,
  AppWindow,
  FolderOpen,
  Calendar,
  ListTodo,
  User2,
  ShieldCheck,
  Bell,
  BarChart2,
  FileText,
  Group,
  ClipboardList,
  UserCheck,
  UserPlus,
  LayoutDashboard,
  Layers,
  Briefcase,
  MoreHorizontal,
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
      icon: ListTodo,
      isActive: true,
      items: [
        {
          title: "All Tasks",
          url: "#",
          icon: ClipboardList,
        },
        {
          title: "My Tasks",
          url: "#",
          icon: User2,
        },
        {
          title: "Completed",
          url: "#",
          icon: CheckSquare,
        },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChart2,
      items: [
        {
          title: "Overview",
          url: "#",
          icon: LayoutDashboard,
        },
        {
          title: "Reports",
          url: "#",
          icon: FileText,
        },
        {
          title: "Insights",
          url: "#",
          icon: PieChart,
        },
      ],
    },
    {
      title: "Team",
      url: "#",
      icon: Group,
      items: [
        {
          title: "Members",
          url: "#",
          icon: UserCheck,
        },
        {
          title: "Permissions",
          url: "#",
          icon: ShieldCheck,
        },
        {
          title: "Invitations",
          url: "#",
          icon: UserPlus,
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
          icon: Settings,
        },
        {
          title: "Notifications",
          url: "#",
          icon: Bell,
        },
        {
          title: "Security",
          url: "#",
          icon: ShieldCheck,
        },
      ],
    },
  ],
  projects: [
    {
      name: "Project Planning",
      url: "#",
      icon: Layers,
    },
    {
      name: "Team Collaboration",
      url: "#",
      icon: Users,
    },
    {
      name: "Resource Management",
      url: "#",
      icon: Briefcase,
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
