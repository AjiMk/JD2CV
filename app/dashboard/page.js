"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  CircleSlash,
  Database,
  Filter,
  Gauge,
  LayoutDashboard,
  Loader2,
  MapPin,
  MoreHorizontal,
  RefreshCw,
  Search,
  Send,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  UserCircle2,
  Users,
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        href: "/dashboard",
        active: true,
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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [tab, setTab] = useState("applications");
  const [environment, setEnvironment] = useState("Production");
  const [automationEnabled, setAutomationEnabled] = useState(true);

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
      title: "Total Applications",
      value: total,
      icon: Briefcase,
      trend: "+12%",
    },
    {
      title: "Shortlisted",
      value: counts.shortListed || 0,
      icon: Target,
      trend: "Pipeline health",
    },
    {
      title: "Interviews",
      value: counts.interview || 0,
      icon: BarChart3,
      trend: `${interviewRate}% rate`,
    },
    {
      title: "Interview Rate",
      value: `${interviewRate}%`,
      icon: TrendingUp,
      trend: "wk over wk",
    },
    {
      title: "Avg ATS Score",
      value: `${avgAtsScore}%`,
      icon: Gauge,
      trend: "Target 75+",
    },
    {
      title: "New Matches (24h)",
      value: newMatches24h,
      icon: Sparkles,
      trend: "Fresh leads",
    },
  ];

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <DashboardNavbar
        user={user}
        onLogout={handleLogout}
        onToggleTheme={() => document.documentElement.classList.toggle("dark")}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`flex flex-col border-r border-border bg-card transition-all ${collapsed ? "w-16" : "w-60"}`}
        >
          <div className="flex-1 overflow-auto py-4">
            {sidebarSections.map((section) => (
              <div key={section.title} className="mb-6">
                {!collapsed && (
                  <h3 className="mb-2 px-4 text-xs uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </h3>
                )}
                <nav className="space-y-1 px-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${item.active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
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

        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Monitor applications, ATS signals, and automation status.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={environment} onValueChange={setEnvironment}>
                  <SelectTrigger className="w-[145px] bg-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Production", "Preview", "Development"].map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <FilterPopover stage={stage} setStage={setStage} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Export</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-sm text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className="mt-2 text-2xl font-semibold">
                        {stat.value}
                      </div>
                    </div>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Badge
                      variant="outline"
                      className="border-border bg-secondary text-xs"
                    >
                      {stat.trend}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-12">
              <div className="xl:col-span-7">
                <RecommendedJobs jobs={buildRecommendedJobs(applications)} />
              </div>
              <div className="xl:col-span-5">
                <NextActions actions={buildNextActions(applications)} />
              </div>

              <div className="xl:col-span-6">
                <ApplicationPipeline counts={counts} total={total} />
              </div>
              <div className="xl:col-span-6">
                <ApplicationTrend data={buildTrendData(applications)} />
              </div>

              <div className="xl:col-span-4">
                <AtsInsights score={avgAtsScore} />
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

              <div className="xl:col-span-12">
                <RecentActivity />
              </div>
            </div>

            <FilteredApplications
              query={query}
              setQuery={setQuery}
              stage={stage}
              setStage={setStage}
              tab={tab}
              setTab={setTab}
              rows={filtered.slice(0, 8)}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function RecommendedJobs({ jobs }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Jobs</CardTitle>
        <CardDescription>
          High-fit roles from your recent search signal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobs.map((job) => (
          <div
            key={`${job.title}-${job.company}`}
            className="rounded-xl border border-border bg-secondary/30 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{job.title}</h3>
                  <Badge variant="secondary">{job.matchScore}% match</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {job.company} • {job.location}
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-border bg-background text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Missing skills: {job.missingSkills.join(", ")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  Apply
                </Button>
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Resume
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function NextActions({ actions }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Actions</CardTitle>
        <CardDescription>
          Priority tasks that need attention today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <div
            key={action.label}
            className="flex items-start justify-between gap-3 rounded-xl border border-border bg-secondary/30 p-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <action.icon className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{action.label}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
            </div>
            <Button variant="outline">{action.action}</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ApplicationPipeline({ counts, total }) {
  const pipeline = [
    { label: "Shortlisted", value: counts.shortListed || 0 },
    { label: "Applied", value: counts.applied || 0 },
    { label: "Interview", value: counts.interview || 0 },
    { label: "Rejected", value: counts.rejected || 0 },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Pipeline</CardTitle>
        <CardDescription>
          Stage distribution across your current funnel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pipeline.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${total ? (item.value / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ApplicationTrend({ data }) {
  const max = Math.max(...data.map((item) => item.count), 1);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Trend</CardTitle>
        <CardDescription>
          Applications per day over the last week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-end gap-3 rounded-xl border border-border bg-secondary/20 px-4 py-4">
          {data.map((item) => (
            <div
              key={item.label}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-32 w-full items-end justify-center">
                <div
                  className="w-full max-w-10 rounded-t-md bg-primary"
                  style={{ height: `${(item.count / max) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AtsInsights({ score }) {
  const keywords = ["Kubernetes", "TypeScript", "CI/CD"];
  const suggestions = [
    "Add ATS-focused keywords near your headline and summary.",
    "Mirror the role description in your skills and experience bullets.",
    "Keep one tailored resume variant per role family.",
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>ATS Insights</CardTitle>
        <CardDescription>
          Score, missing keywords, and suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4">
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              backgroundImage: `conic-gradient(currentColor ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
            }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-lg font-semibold">
              {score}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-semibold">{score}%</div>
            <p className="text-sm text-muted-foreground">
              Average ATS score across your current pipeline
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <Badge
              key={keyword}
              variant="outline"
              className="border-border bg-background text-xs"
            >
              {keyword}
            </Badge>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <h4 className="mb-3 text-sm font-medium">Resume suggestions</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {suggestions.map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
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
      <CardContent className="space-y-4">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="space-y-2 rounded-xl border border-border bg-secondary/20 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{skill.name}</div>
                <div className="text-xs text-muted-foreground">
                  {skill.demand} jobs mention this
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-border bg-background text-xs"
              >
                {skill.priority}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Match</span>
                <span>{skill.match}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
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

function RecentActivity() {
  const feed = [
    {
      title: "Application submitted",
      description: "A new application was created from the dashboard flow.",
      tag: "Application",
      timestamp: "10m ago",
    },
    {
      title: "Resume generated",
      description: "A resume variant was generated for a high-match role.",
      tag: "Resume",
      timestamp: "1h ago",
    },
    {
      title: "Match found",
      description:
        "A role with visa sponsorship and strong ATS fit was detected.",
      tag: "Match",
      timestamp: "3h ago",
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest applications, resumes, and matches
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {feed.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-border bg-secondary/20 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">
                  {item.description}
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-border bg-background text-xs"
              >
                {item.tag}
              </Badge>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {item.timestamp}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function FilteredApplications({
  query,
  setQuery,
  stage,
  setStage,
  tab,
  setTab,
  rows,
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Filtered Applications</CardTitle>
            <CardDescription>
              Applications, interviews, and offers in a tabbed table
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
                {stages.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
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
                  row.company?.name || row.manualCompanyName || "Unknown";
                const location = [row.state?.name, row.country?.name]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{company}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {row.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {row.appliedDate
                        ? new Date(row.appliedDate).toLocaleDateString()
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
  );
}

function FilterPopover({ stage, setStage }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
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
              {stages.map((item) => (
                <CommandItem key={item} onSelect={() => setStage(item)}>
                  <span className="capitalize">{item}</span>
                  {stage === item && (
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

function getAtsScore(item) {
  if (typeof item.atsScore === "number") return item.atsScore;
  if (`${item.role || ""}`.toLowerCase().includes("senior")) return 82;
  if (`${item.role || ""}`.toLowerCase().includes("engineer")) return 76;
  return item.stage === "interview" ? 80 : 68;
}

function buildRecommendedJobs(applications) {
  const source = applications.slice(0, 4);
  if (!source.length)
    return [
      {
        title: "Senior Product Engineer",
        company: "Nova Labs",
        location: "Remote",
        matchScore: 86,
        tags: ["Visa", "Remote"],
        missingSkills: ["System design", "TypeScript"],
      },
    ];
  return source.map((item, index) => ({
    title: item.role || "Open Role",
    company: item.company?.name || item.manualCompanyName || "Unknown",
    location:
      [item.state?.name, item.country?.name].filter(Boolean).join(", ") ||
      "Remote",
    matchScore: Math.max(68, 92 - index * 4),
    tags: [
      index % 2 === 0 ? "Visa" : "Remote",
      item.stage === "interview" ? "Priority" : "Match",
    ],
    missingSkills: ["TypeScript", "System design", "ATS keywords"].slice(
      0,
      2 + (index % 2),
    ),
  }));
}

function buildNextActions(applications) {
  const pending = applications.filter(
    (item) => item.stage === "applied",
  ).length;
  const lowAts = applications.filter((item) => getAtsScore(item) < 60).length;
  const followUps = applications.filter((item) =>
    `${item.role || ""}`.toLowerCase().includes("senior"),
  ).length;
  return [
    {
      icon: Send,
      label: "Pending applications",
      description: `${pending} applications still need follow-up or submission`,
      action: "Review",
    },
    {
      icon: AlertCircle,
      label: "Low ATS resumes",
      description: `${lowAts} resumes are below the ATS threshold`,
      action: "Improve",
    },
    {
      icon: RefreshCw,
      label: "Follow-ups needed",
      description: `${followUps} applications need follow-up messages`,
      action: "Send",
    },
  ];
}

function buildTrendData(applications) {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return labels.map((label, index) => ({
    label,
    count:
      applications.filter((_, i) => i % 7 === index).length || (index % 3) + 1,
  }));
}
