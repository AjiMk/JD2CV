"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  ChevronRight,
  Database,
  Filter,
  LayoutDashboard,
  Search,
  Settings,
  Target,
  TrendingUp,
  UserCircle2,
  Users,
  MoreHorizontal,
  ChevronsUpDown,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardNavbar from "@/components/DashboardNavbar";

const sidebarSections = [
  {
    title: "Overview",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        active: true,
        href: "/dashboard",
      },
      { icon: Users, label: "Applications", href: "/job-tracker" },
    ],
  },
  {
    title: "Workflow",
    items: [
      { icon: Briefcase, label: "Job Tracker", href: "/job-tracker" },
      { icon: Database, label: "Resume", href: "/resume" },
    ],
  },
  {
    title: "System",
    items: [
      { icon: Settings, label: "Settings", href: "/dashboard" },
      { icon: UserCircle2, label: "Profile", href: "/profile" },
    ],
  },
];

const stages = ["shortListed", "applied", "interview", "rejected"];
const environmentOptions = ["Production", "Preview", "Development"];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [environment, setEnvironment] = useState("Production");
  useEffect(() => {
    const load = async () => {
      try {
        const authResponse = await fetch("/api/auth/me");
        if (!authResponse.ok) {
          router.push("/login");
          return;
        }

        const authData = await authResponse.json();
        setUser(authData.user);

        const jobsResponse = await fetch("/api/jobs?limit=100");
        const jobsData = await jobsResponse.json();
        setApplications(jobsData.items || []);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const filteredApplications = useMemo(() => {
    return applications.filter((item) => {
      const company = item.company?.name || item.manualCompanyName || "Unknown";
      const location = [item.state?.name, item.country?.name]
        .filter(Boolean)
        .join(", ");
      const matchesQuery = `${company} ${item.role} ${location}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStage = stage === "all" || item.stage === stage;
      return matchesQuery && matchesStage;
    });
  }, [applications, query, stage]);

  const total = applications.length;
  const counts = Object.fromEntries(
    stages.map((item) => [
      item,
      applications.filter((a) => a.stage === item).length,
    ]),
  );
  const interviewRate = total
    ? Math.round((counts.interview / total) * 100)
    : 0;

  const rows = filteredApplications.slice(0, 5);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <div className="dark flex min-h-screen flex-col bg-background text-foreground">
        <DashboardHeaderSkeleton />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebarSkeleton />
          <main className="flex-1 overflow-auto p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-20" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <DashboardNavbar
        user={user}
        onLogout={handleLogout}
        onToggleTheme={() => document.documentElement.classList.toggle("dark")}
      />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor your applications, funnel health, and active search.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={environment} onValueChange={setEnvironment}>
                  <SelectTrigger className="w-[140px] bg-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {environmentOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Last 30 days</span>
                </Button>
                <StageFilterPopover stage={stage} setStage={setStage} />
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <StatsCards
              total={total}
              counts={counts}
              interviewRate={interviewRate}
            />

            <Accordion
              type="multiple"
              defaultValue={["funnel", "snapshot"]}
              className="mt-6 grid gap-6 lg:grid-cols-2"
            >
              <AccordionItem value="funnel" className="rounded-2xl border px-4">
                <AccordionTrigger className="py-4 no-underline hover:no-underline">
                  <div className="text-left">
                    <div className="text-base font-semibold">
                      Application Funnel
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Stage distribution across your job search
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="border-0 shadow-none">
                    <CardContent className="space-y-5 px-2 pb-2 pt-1 sm:px-4">
                      {stages.map((label) => (
                        <div key={label} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="capitalize text-muted-foreground">
                              {label}
                            </span>
                            <span className="text-foreground">
                              {counts[label] || 0}
                            </span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${total ? ((counts[label] || 0) / total) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="snapshot"
                className="rounded-2xl border px-4"
              >
                <AccordionTrigger className="py-4 no-underline hover:no-underline">
                  <div className="text-left">
                    <div className="text-base font-semibold">
                      Stage Snapshot
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Quick view of application status
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {stages.map((label) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-xl border bg-secondary/40 px-4 py-3"
                      >
                        <span className="text-sm capitalize text-muted-foreground">
                          {label}
                        </span>
                        <Badge variant="secondary">{counts[label] || 0}</Badge>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Filtered Applications
                      </CardTitle>
                      <CardDescription>
                        Paginated records for the current search
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search company, role, location"
                          className="w-full pl-9 sm:w-64"
                        />
                      </div>
                      <Select value={stage} onValueChange={setStage}>
                        <SelectTrigger className="w-full sm:w-44">
                          <SelectValue placeholder="All stages" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All stages</SelectItem>
                          {stages.map((label) => (
                            <SelectItem key={label} value={label}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="applications" className="mb-4">
                    <TabsList>
                      <TabsTrigger value="applications">
                        Applications
                      </TabsTrigger>
                      <TabsTrigger value="interviews">Interviews</TabsTrigger>
                      <TabsTrigger value="offers">Offers</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Company</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Stage</TableHead>
                          <TableHead>Applied</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((row) => {
                          const company =
                            row.company?.name ||
                            row.manualCompanyName ||
                            "Unknown";
                          const location = [row.state?.name, row.country?.name]
                            .filter(Boolean)
                            .join(", ");
                          return (
                            <TableRow key={row.id}>
                              <TableCell className="font-medium">
                                {company}
                              </TableCell>
                              <TableCell>{row.role}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className="capitalize"
                                >
                                  {row.stage}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {row.appliedDate
                                  ? new Date(
                                      row.appliedDate,
                                    ).toLocaleDateString()
                                  : "—"}
                              </TableCell>
                              <TableCell>{location || "—"}</TableCell>
                              <TableCell className="max-w-xs truncate">
                                {row.notes || "—"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardSidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`flex flex-col border-r border-border bg-card transition-all duration-200 ${collapsed ? "w-16" : "w-60"}`}
    >
      <div className="flex-1 overflow-auto py-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-6">
            {!collapsed && (
              <h3 className="mb-2 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h3>
            )}
            <nav className="space-y-1 px-2">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    item.active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <span className="flex-1 text-left">{item.label}</span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center border-t border-border py-3 text-muted-foreground hover:text-foreground"
      >
        <ChevronRight
          className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"}`}
        />
      </button>
    </aside>
  );
}

function StageFilterPopover({ stage, setStage }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filter</span>
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <Command>
          <CommandInput placeholder="Filter by stage..." />
          <CommandList>
            <CommandEmpty>No stage found.</CommandEmpty>
            <CommandGroup heading="Stages">
              <CommandItem onSelect={() => setStage("all")}>
                All stages
              </CommandItem>
              {stages.map((label) => (
                <CommandItem key={label} onSelect={() => setStage(label)}>
                  <span className="capitalize">{label}</span>
                  {stage === label && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      Selected
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DashboardHeaderSkeleton() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="hidden h-8 w-56 md:block" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </header>
  );
}

function DashboardSidebarSkeleton() {
  return (
    <aside className="hidden w-60 flex-col border-r border-border bg-background p-4 lg:flex">
      <Skeleton className="mb-6 h-10 w-full" />
      <div className="space-y-6">
        <Skeleton className="h-5 w-24" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </aside>
  );
}

function StatsCards({ total, counts, interviewRate }) {
  const stats = [
    { title: "Total Applications", value: total, icon: Briefcase },
    { title: "Short Listed", value: counts.shortListed || 0, icon: Target },
    { title: "Interviews", value: counts.interview || 0, icon: BarChart3 },
    { title: "Interview Rate", value: `${interviewRate}%`, icon: TrendingUp },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
