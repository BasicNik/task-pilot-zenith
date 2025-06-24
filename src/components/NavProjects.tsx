
import {
  FolderOpen,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar'
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip'

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-xs sm:text-sm font-normal truncate">{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                In development, will be live soon
              </TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <FolderOpen className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <MoreHorizontal className="text-sidebar-foreground/70 w-4 h-4 mr-2" />
                <span className="text-xs sm:text-sm font-normal">More</span>
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              In development, will be live soon
            </TooltipContent>
          </Tooltip>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
