"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  CircleSlash,
  ArrowDownUp,
  Gauge,
  RotateCcw,
  Bell,
  Loader2,
  Search,
  Send,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const stages = ["shortListed", "applied", "interview", "rejected"];

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [tab, setTab] = useState("applications");
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const unreadNotifications = 3;
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [jobSearch, setJobSearch] = useState("");
  const [jobSort, setJobSort] = useState("id");
  const [pieDateFilter, setPieDateFilter] = useState("30d");

  useEffect(() => {
    const load = async () => {
      try {
        const authResponse = await fetch("/api/auth/me");
        if (!authResponse.ok) return router.push("/login");
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

  const counts = useMemo(
    () =>
      Object.fromEntries(
        stages.map((stageKey) => [
          stageKey,
          applications.filter((a) => a.stage === stageKey).length,
        ]),
      ),
    [applications],
  );

  const filtered = useMemo(
    () =>
      applications.filter((item) => {
        const company =
          item.company?.name || item.manualCompanyName || "Unknown";
        const location = [item.state?.name, item.country?.name]
          .filter(Boolean)
          .join(", ");
        const text = `${company} ${item.role} ${location}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          (stage === "all" || item.stage === stage)
        );
      }),
    [applications, query, stage],
  );

  const total = applications.length;
  const interviewRate = total
    ? Math.round((counts.interview / total) * 100)
    : 0;
  const avgAtsScore = total
    ? Math.round(
        applications.reduce((sum, item) => sum + getAtsScore(item), 0) / total,
      )
    : 0;
  const newMatches24h = applications.filter(
    (item) =>
      item.appliedDate &&
      Date.now() - new Date(item.appliedDate).getTime() < 86400000,
  ).length;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const breadcrumbPage = getBreadcrumbLabel(pathname);

  if (loading || !user) {
    return (
      <div className="dark flex min-h-screen flex-col bg-background text-foreground">
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
          <Skeleton className="h-9 w-28" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden w-60 border-r border-border bg-background p-4 lg:block">
            <Skeleton className="h-10 w-full" />
          </aside>
          <main className="flex-1 overflow-auto p-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Shortlisted",
      value: counts.shortListed || 0,
      icon: Target,
      growth: "+8.1%",
    },
    {
      title: "Interviews",
      value: counts.interview || 0,
      icon: BarChart3,
      growth: "+6.7%",
    },
    {
      title: "Interview Rate",
      value: `${interviewRate}%`,
      icon: TrendingUp,
      growth: "+4.9%",
    },
    {
      title: "New Matches (24h)",
      value: newMatches24h,
      icon: Sparkles,
      growth: "+14.8%",
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbPage}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <DropdownMenu
              open={notificationOpen}
              onOpenChange={setNotificationOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full border border-border bg-card hover:bg-secondary"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                  {unreadNotifications > 0 ? (
                    <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                      {unreadNotifications}
                    </span>
                  ) : null}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="z-50 w-80"
              >
                <DropdownMenuItem className="cursor-default font-medium focus:bg-transparent">
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-2">
                  <span className="mb-1 h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium text-foreground">
                    New match found
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Senior Frontend Engineer • 10m ago
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-2">
                  <span className="mb-1 h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium text-foreground">
                    Resume ATS score improved
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ATS score increased to 82%
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-2 opacity-80">
                  <span className="mb-1 h-2 w-2 rounded-full bg-muted-foreground/60" />
                  <span className="font-medium text-foreground">
                    Follow-up reminder
                  </span>
                  <span className="text-xs text-muted-foreground">
                    2 follow-ups are due today
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 transition-colors hover:bg-secondary"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      {user?.name?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="z-50 w-56"
              >
                <DropdownMenuItem onSelect={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => router.push("/resume-builder")}
                >
                  Resume Builder
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/job-tracker")}>
                  Job Tracker
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Monitor applications, ATS signals, and automation status.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="rounded-xl">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 px-3 pb-1 pt-3">
                  <div>
                    <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className="mt-1 text-lg font-semibold">
                      {stat.value}
                    </div>
                  </div>
                  <div className="rounded-full border border-border bg-secondary p-1.5 text-muted-foreground">
                    <stat.icon className="h-3 w-3" />
                  </div>
                </CardHeader>
                <CardContent className="px-3 pb-3 pt-0">
                  <div className="text-xs font-medium text-emerald-500">
                    {stat.growth}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    Growth vs last period
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-12">
              <div className="xl:col-span-4">
                <ApplicationStagePie
                  applications={applications}
                  dateFilter={pieDateFilter}
                  onDateFilterChange={setPieDateFilter}
                />
              </div>
              <div className="xl:col-span-4">
                <SkillGapAnalysis />
              </div>
              <div className="xl:col-span-4">
                <AutomationStatus
                  enabled={automationEnabled}
                  onToggle={() => setAutomationEnabled((v) => !v)}
                />
              </div>
            </div>

            <RecommendedJobs
              jobs={buildRecommendedJobs(applications)}
              search={jobSearch}
              onSearch={setJobSearch}
              sortKey={jobSort}
              onSortChange={setJobSort}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function RecommendedJobs({
  jobs,
  search,
  onSearch,
  sortKey,
  sortDirection,
  onSortChange,
}) {
  const filteredJobs = jobs
    .filter((job) => {
      const haystack = [
        job.id,
        job.title,
        job.organizationName,
        job.postedAt,
        job.roleType,
        job.statusText,
        ...(job.tags || []),
        ...(job.missingSkills || []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortKey === "matchScore") {
        return (a.matchScore - b.matchScore) * direction;
      }

      const aValue = `${a[sortKey] || ""}`.toLowerCase();
      const bValue = `${b[sortKey] || ""}`.toLowerCase();
      return aValue.localeCompare(bValue) * direction;
    })
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle>Recommended Jobs</CardTitle>
            <CardDescription>
              High-fit roles from your recent search signal
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search jobs"
                className="w-full pl-9 sm:w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full rounded-lg border border-border">
          <Table className="w-full table-auto">
            <TableHeader>
              <TableRow>
                <TableHead className="px-2 py-2">ID</TableHead>
                <TableHead className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() => onSortChange("title")}
                    className="flex items-center gap-1"
                  >
                    Job Title
                    {sortKey === "title" ? (
                      <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : null}
                  </button>
                </TableHead>
                <TableHead className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() => onSortChange("organizationName")}
                    className="flex items-center gap-1"
                  >
                    Organization Name
                    {sortKey === "organizationName" ? (
                      <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : null}
                  </button>
                </TableHead>
                <TableHead className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() => onSortChange("matchScore")}
                    className="flex items-center gap-1"
                  >
                    Match
                    {sortKey === "matchScore" ? (
                      <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : null}
                  </button>
                </TableHead>
                <TableHead className="px-2 py-2">Missing Skills</TableHead>
                <TableHead className="px-2 py-2">Tags</TableHead>
                <TableHead className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() => onSortChange("postedAt")}
                    className="flex items-center gap-1"
                  >
                    Job Posted At
                    {sortKey === "postedAt" ? (
                      <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : null}
                  </button>
                </TableHead>
                <TableHead className="px-2 py-2" />
                <TableHead className="px-2 py-2" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="px-2 py-2 text-xs font-medium">
                    {job.id}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-sm">
                    <div className="font-medium text-foreground">
                      {job.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {job.roleType}
                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-sm">
                    <div className="font-medium text-foreground">
                      {job.organizationName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {job.statusText}
                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <Badge variant="secondary">{job.matchScore}%</Badge>
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <div className="flex flex-wrap gap-1">
                      {job.missingSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="border-border bg-background px-1.5 py-0.5 text-[10px]"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <div className="flex flex-wrap gap-1">
                      {job.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-border bg-background px-1.5 py-0.5 text-[10px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-sm text-muted-foreground">
                    {job.postedAt}
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      title="Apply"
                      aria-label="Apply"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <Button
                      size="icon"
                      className="h-9 w-9"
                      title="Generate Resume"
                      aria-label="Generate Resume"
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing up to 5 of {jobs.length} jobs
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              aria-label="Previous page"
              title="Previous page"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              aria-label="Page 1"
              title="Page 1"
            >
              <span className="text-xs font-medium">1</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              aria-label="Page 2"
              title="Page 2"
            >
              <span className="text-xs font-medium">2</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              aria-label="Next page"
              title="Next page"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationStagePie({ applications, dateFilter, onDateFilterChange }) {
  const filteredApplications = applications.filter((item) => {
    if (dateFilter === "all") return true;
    if (!item.appliedDate) return false;

    const appliedAt = new Date(item.appliedDate).getTime();
    const cutoff =
      dateFilter === "7d"
        ? Date.now() - 7 * 24 * 60 * 60 * 1000
        : dateFilter === "30d"
          ? Date.now() - 30 * 24 * 60 * 60 * 1000
          : Date.now() - 90 * 24 * 60 * 60 * 1000;

    return appliedAt >= cutoff;
  });

  const counts = {
    applied: filteredApplications.filter((item) => item.stage === "applied")
      .length,
    rejected: filteredApplications.filter((item) => item.stage === "rejected")
      .length,
    shortlisted: filteredApplications.filter(
      (item) => item.stage === "shortListed",
    ).length,
    interviewed: filteredApplications.filter(
      (item) => item.stage === "interview",
    ).length,
  };

  const fallbackCounts = {
    applied: 12,
    rejected: 6,
    shortlisted: 8,
    interviewed: 5,
  };

  const total =
    Object.values(counts).reduce((sum, value) => sum + value, 0) || 1;
  const segments = [
    {
      key: "applied",
      label: "Applied",
      value: counts.applied || fallbackCounts.applied,
      color: "#3b82f6",
    },
    {
      key: "rejected",
      label: "Rejected",
      value: counts.rejected || fallbackCounts.rejected,
      color: "#ef4444",
    },
    {
      key: "shortlisted",
      label: "Shortlisted",
      value: counts.shortlisted || fallbackCounts.shortlisted,
      color: "#f59e0b",
    },
    {
      key: "interviewed",
      label: "Interviewed",
      value: counts.interviewed || fallbackCounts.interviewed,
      color: "#22c55e",
    },
  ];

  const pieTotal =
    segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const gradient = segments.length
    ? `conic-gradient(${segments
        .map((segment, index) => {
          const start =
            (segments
              .slice(0, index)
              .reduce((sum, current) => sum + current.value, 0) /
              pieTotal) *
            100;
          const end =
            (segments
              .slice(0, index + 1)
              .reduce((sum, current) => sum + current.value, 0) /
              pieTotal) *
            100;
          return `${segment.color} ${start}% ${end}%`;
        })
        .join(", ")})`
    : "conic-gradient(#e5e7eb 0% 100%)";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Job Tracker</CardTitle>
            <CardDescription>
              Overview of job stage distribution
            </CardDescription>
          </div>
          <Select value={dateFilter} onValueChange={onDateFilterChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-border bg-secondary/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Total jobs
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {pieTotal}
                </p>
              </div>
              <Select value={dateFilter} onValueChange={onDateFilterChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-6 flex items-center justify-center">
              <div
                className="relative flex h-40 w-40 items-center justify-center rounded-full border border-border bg-card shadow-sm"
                style={{ backgroundImage: gradient }}
              >
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-border bg-background">
                  <span className="text-2xl font-semibold leading-none">
                    {pieTotal}
                  </span>
                  <span className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                    Jobs
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {segments.map((segment) => (
              <div
                key={segment.key}
                className="rounded-xl border border-border bg-background p-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {segment.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((segment.value / pieTotal) * 100)}% of total
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {segment.value}
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(segment.value / pieTotal) * 100}%`,
                      backgroundColor: segment.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillGapAnalysis() {
  const skills = [
    { name: "System Design", demand: 18, match: 62, priority: "High" },
    { name: "TypeScript", demand: 24, match: 68, priority: "High" },
    { name: "SQL", demand: 15, match: 74, priority: "Medium" },
    { name: "AWS", demand: 12, match: 58, priority: "High" },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Gap Analysis</CardTitle>
        <CardDescription>
          Priority skills to close based on demand frequency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="space-y-1.5 rounded-lg border border-border bg-secondary/15 px-3 py-2"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium leading-none">
                  {skill.name}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {skill.demand} jobs mention this
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-border bg-background px-2 py-0 text-[10px]"
              >
                {skill.priority}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Match</span>
                <span>{skill.match}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div
                  className="h-1.5 rounded-full bg-primary"
                  style={{ width: `${skill.match}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AutomationStatus({ enabled, onToggle }) {
  const logs = [
    "2 matches auto-applied today",
    "1 resume generation completed",
    "0 failed automations in last 24h",
  ];
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Automation Status</CardTitle>
            <CardDescription>
              Current automation mode and log stream
            </CardDescription>
          </div>
          <Button
            variant={enabled ? "default" : "outline"}
            onClick={onToggle}
            className="gap-2"
          >
            {enabled ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <CircleSlash className="h-4 w-4" />
            )}
            {enabled ? "Enabled" : "Disabled"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-border bg-secondary/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Automation</span>
            <span
              className={`text-sm font-medium ${enabled ? "text-emerald-500" : "text-rose-500"}`}
            >
              {enabled ? "ON" : "OFF"}
            </span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Apply and resume-generation workflows will run automatically.
          </div>
        </div>
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground"
            >
              <Loader2 className="h-3.5 w-3.5" />
              {log}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getAtsScore(item) {
  if (typeof item.atsScore === "number") return item.atsScore;
  if (`${item.role || ""}`.toLowerCase().includes("senior")) return 82;
  if (`${item.role || ""}`.toLowerCase().includes("engineer")) return 76;
  return item.stage === "interview" ? 80 : 68;
}

function buildRecommendedJobs(applications) {
  const tagSets = [
    ["Visa", "Remote"],
    ["Hybrid", "Frontend"],
    ["Backend", "Priority"],
    ["AI", "Remote"],
    ["Cloud", "Visa"],
    ["Mobile", "Hybrid"],
    ["Data", "Priority"],
    ["Security", "Remote"],
    ["Platform", "Visa"],
    ["Full-stack", "Hybrid"],
  ];
  const skillSets = [
    ["System design", "TypeScript"],
    ["React", "Next.js", "Testing"],
    ["Node.js", "PostgreSQL"],
    ["Python", "ML"],
    ["AWS", "Docker"],
    ["Kotlin", "Swift"],
    ["SQL", "Analytics"],
    ["OAuth", "Security"],
    ["Microservices", "Kubernetes"],
    ["GraphQL", "Tailwind"],
  ];
  const source = [...applications.slice(0, 10)];

  while (source.length < 10) {
    source.push({
      role: `Open Role ${source.length + 1}`,
      company: {
        name: [
          "Nova Labs",
          "Vertex AI",
          "Atlas Systems",
          "BluePeak",
          "Summit Cloud",
        ][source.length % 5],
      },
      stage:
        source.length % 3 === 0
          ? "applied"
          : source.length % 3 === 1
            ? "shortListed"
            : "interview",
      notes: "High-fit role based on your current search signal.",
      appliedDate: new Date(
        Date.now() - source.length * 86400000,
      ).toISOString(),
    });
  }

  return source.map((item, index) => ({
    id: `RJ-${String(index + 1).padStart(3, "0")}`,
    title: item.role || "Open Role",
    description:
      item.notes || "High-fit role based on your current search signal.",
    organizationName: item.company?.name || item.manualCompanyName || "Unknown",
    matchScore: Math.max(68, 92 - index * 2),
    tags: tagSets[index % tagSets.length],
    missingSkills: skillSets[index % skillSets.length],
    roleType:
      item.stage === "interview"
        ? "Interview stage"
        : item.stage === "shortListed"
          ? "Shortlisted"
          : "Open role",
    statusText:
      item.stage === "interview"
        ? "Interviewing now"
        : item.stage === "shortListed"
          ? "Ready to apply"
          : "Active role",
    postedAt: item.appliedDate
      ? new Date(item.appliedDate).toLocaleDateString()
      : "Today",
  }));
}

function buildTrendData(applications) {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return labels.map((label, index) => ({
    label,
    count:
      applications.filter((_, i) => i % 7 === index).length || (index % 3) + 1,
  }));
}

function getBreadcrumbLabel(pathname) {
  const map = {
    "/dashboard": "Dashboard",
    "/job-tracker": "Job Tracker",
    "/resume": "Resume",
    "/resume-builder": "Resume Builder",
    "/profile": "Profile",
    "/login": "Login",
    "/register": "Register",
  };

  return map[pathname] || "Dashboard";
}
