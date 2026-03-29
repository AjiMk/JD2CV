"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Database,
  Map,
  LayoutDashboard,
  Activity,
  Settings,
  UserCircle2,
  FileSearch,
  Users,
  Workflow,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const sidebarSections = [
  {
    title: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: Users, label: "Jobs", href: "/jobs" },
    ],
  },
  {
    title: "Workflow",
    items: [
      { icon: Briefcase, label: "Job Tracker", href: "/job-tracker" },
      { icon: Activity, label: "Activity", href: "/activity" },
      { icon: Workflow, label: "Automations", href: "/automations" },
    ],
  },
  {
    title: "Resume",
    items: [
      { icon: Database, label: "All resumes", href: "/resume" },
      { icon: Database, label: "Resume builder", href: "/resume-builder" },
      { icon: Map, label: "Resume map", href: "/resume-map" },
      { icon: FileSearch, label: "JD to Resume", href: "/jd-to-resume" },
    ],
  },
  {
    title: "System",
    items: [
      { icon: Settings, label: "Settings", href: "/settings" },
      { icon: UserCircle2, label: "Profile", href: "/profile" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            JD
          </div>
          <div className="sidebar-labels leading-tight">
            <div className="text-sm font-semibold">Job Dashboard</div>
            <div className="text-xs text-muted-foreground">Shadcn layout</div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {sidebarSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="sidebar-labels">
              {section.title}
            </SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => {
                const active = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.label}>
                    <Link
                      href={item.href}
                      title={item.label}
                      className={`app-sidebar-link flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="sidebar-labels">{item.label}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Badge
          variant="outline"
          className="sidebar-labels w-full justify-center border-border bg-secondary text-xs"
        >
          ATS Ready
        </Badge>
      </SidebarFooter>
    </Sidebar>
  );
}
