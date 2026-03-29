"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  Search,
  Sparkles,
} from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function JobsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unreadNotifications = 3;

  useEffect(() => {
    const load = async () => {
      try {
        const authResponse = await fetch("/api/auth/me");
        if (!authResponse.ok) return router.push("/login");
        const authData = await authResponse.json();
        setUser(authData.user);

        const jobsResponse = await fetch("/api/jobs?limit=100");
        const jobsData = await jobsResponse.json();
        setJobs(buildRecommendedJobs(jobsData.items || []));
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const handleSort = (key) => {
    setSortDirection((current) =>
      sortKey === key ? (current === "asc" ? "desc" : "asc") : "asc",
    );
    setSortKey(key);
  };

  const filteredJobs = useMemo(() => {
    const term = search.toLowerCase();
    return jobs
      .filter((job) => {
        const searchable = [
          job.id,
          job.title,
          job.organization,
          job.tags.join(" "),
          job.missingSkills.join(" "),
          job.postedAt,
        ]
          .join(" ")
          .toLowerCase();
        return searchable.includes(term);
      })
      .sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;
        const left = getSortableValue(a, sortKey);
        const right = getSortableValue(b, sortKey);
        if (left < right) return -1 * direction;
        if (left > right) return 1 * direction;
        return 0;
      })
      .slice(0, 5);
  }, [jobs, search, sortKey, sortDirection]);

  if (loading || !user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center justify-between gap-2 px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbPage>Jobs</BreadcrumbPage>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu
                open={notificationOpen}
                onOpenChange={setNotificationOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full border border-border bg-card"
                    type="button"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                    <span className="absolute -right-1 -top-1 rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-medium text-destructive-foreground">
                      {unreadNotifications}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuItem className="flex-col items-start gap-1">
                    <div className="font-medium">New match found</div>
                    <div className="text-xs text-muted-foreground">
                      Senior Frontend Engineer at Nova Labs
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex-col items-start gap-1">
                    <div className="font-medium">Resume generated</div>
                    <div className="text-xs text-muted-foreground">
                      For Full Stack Engineer
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 rounded-full border border-border bg-card px-2"
                    type="button"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {user?.name?.[0] || user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/resume-builder")}
                  >
                    Resume Builder
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/job-tracker")}>
                    Job Tracker
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-4">
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle>Recommended Jobs</CardTitle>
              <CardDescription>
                Search and review matching opportunities
              </CardDescription>
              <div className="relative max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search jobs..."
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="px-4">
              <div className="overflow-hidden rounded-xl border border-border">
                <Table className="table-auto">
                  <TableHeader>
                    <TableRow>
                      {[
                        ["id", "ID", "w-16"],
                        ["title", "Job Title", "w-[190px]"],
                        ["organization", "Organization Name", "w-[170px]"],
                        ["match", "Match", "w-24"],
                        ["missingSkills", "Missing Skills", "w-[220px]"],
                        ["tags", "Tags", "w-[170px]"],
                        ["postedAt", "Job Posted At", "w-[130px]"],
                      ].map(([key, label, width]) => (
                        <TableHead
                          key={key}
                          className={`${width} cursor-pointer px-3 py-3`}
                          onClick={() => handleSort(key)}
                        >
                          <span className="inline-flex items-center gap-1">
                            {label}
                            <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
                          </span>
                        </TableHead>
                      ))}
                      <TableHead className="w-12 px-2 py-2" />
                      <TableHead className="w-12 px-2 py-2" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="px-3 py-3 text-xs">
                          {job.id}
                        </TableCell>
                        <TableCell className="px-3 py-3">
                          <div className="space-y-1">
                            <div className="font-medium">{job.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {job.roleType}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-3">
                          <div className="space-y-1">
                            <div>{job.organization}</div>
                            <div className="text-xs text-muted-foreground">
                              {job.statusText}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-3 text-sm font-medium">
                          {job.match}%
                        </TableCell>
                        <TableCell className="px-3 py-3">
                          <div className="flex flex-wrap gap-1">
                            {job.missingSkills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="px-2 py-0 text-[10px]"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-3">
                          <div className="flex flex-wrap gap-1">
                            {job.tags.map((tag) => (
                              <Badge
                                key={tag}
                                className="px-2 py-0 text-[10px]"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-3 text-xs text-muted-foreground">
                          {job.postedAt}
                        </TableCell>
                        <TableCell className="px-3 py-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Apply"
                            aria-label="Apply"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="px-3 py-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
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
              <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Previous page"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="secondary" className="h-8 w-8 px-0 text-xs">
                  1
                </Button>
                <Button variant="ghost" className="h-8 w-8 px-0 text-xs">
                  2
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Next page"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function getSortableValue(job, key) {
  if (key === "match") return Number(job.match) || 0;
  if (key === "postedAt") return new Date(job.postedAt).getTime() || 0;
  return `${job[key] ?? ""}`.toLowerCase();
}

function buildRecommendedJobs(items) {
  const fallback = [
    {
      id: "J-1001",
      title: "Senior Frontend Engineer",
      organization: "Nova Labs",
      match: 96,
      missingSkills: ["Next.js", "Accessibility"],
      tags: ["Remote", "Visa"],
      postedAt: "2026-03-26",
      roleType: "Open role",
      statusText: "Hiring now",
    },
    {
      id: "J-1002",
      title: "Full Stack Engineer",
      organization: "Northstar AI",
      match: 91,
      missingSkills: ["AWS", "GraphQL"],
      tags: ["Hybrid", "Urgent"],
      postedAt: "2026-03-24",
      roleType: "Open role",
      statusText: "Active search",
    },
    {
      id: "J-1003",
      title: "Platform Engineer",
      organization: "Vertex Cloud",
      match: 88,
      missingSkills: ["Kubernetes", "Terraform"],
      tags: ["Remote"],
      postedAt: "2026-03-22",
      roleType: "Open role",
      statusText: "Hiring now",
    },
    {
      id: "J-1004",
      title: "Product Engineer",
      organization: "Orbit Systems",
      match: 84,
      missingSkills: ["TypeScript", "System Design"],
      tags: ["Onsite", "Visa"],
      postedAt: "2026-03-20",
      roleType: "Open role",
      statusText: "Active search",
    },
    {
      id: "J-1005",
      title: "Backend Engineer",
      organization: "Pulse Commerce",
      match: 82,
      missingSkills: ["PostgreSQL", "Redis"],
      tags: ["Remote", "Contract"],
      postedAt: "2026-03-18",
      roleType: "Open role",
      statusText: "Hiring now",
    },
  ];

  return items.length
    ? items.slice(0, 5).map((item, index) => ({
        id: item.id || `J-${1001 + index}`,
        title: item.role || fallback[index]?.title || "Recommended Job",
        organization:
          item.company?.name ||
          item.manualCompanyName ||
          fallback[index]?.organization ||
          "Unknown",
        match: Math.min(99, 80 + index * 3),
        missingSkills: fallback[index]?.missingSkills || ["Communication"],
        tags: fallback[index]?.tags || ["Remote"],
        postedAt:
          item.appliedDate?.slice(0, 10) ||
          fallback[index]?.postedAt ||
          "2026-03-01",
        roleType: fallback[index]?.roleType || "Open role",
        statusText: fallback[index]?.statusText || "Hiring now",
      }))
    : fallback;
}
