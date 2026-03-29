"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Loader2,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  XCircle,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const stages = [
  { key: "applied", label: "Applied", icon: Clock3 },
  { key: "shortListed", label: "Shortlisted", icon: Loader2 },
  { key: "interview", label: "Interview", icon: CheckCircle2 },
  { key: "rejected", label: "Rejected", icon: XCircle },
];

const dummyJobs = [
  {
    id: "job-1",
    role: "Senior Frontend Engineer",
    manualCompanyName: "Aurora Labs",
    stage: "shortListed",
    country: { name: "India" },
    state: { name: "Karnataka" },
    appliedDate: new Date().toISOString(),
    salary: "18 LPA",
    source: "LinkedIn",
    notes: "UI system redesign, board interactions, and performance work.",
  },
  {
    id: "job-2",
    role: "Full Stack Engineer",
    manualCompanyName: "Northstar AI",
    stage: "applied",
    country: { name: "India" },
    state: { name: "Maharashtra" },
    appliedDate: new Date().toISOString(),
    salary: "22 LPA",
    source: "Wellfound",
    notes: "API integrations and resume personalization workflow.",
  },
  {
    id: "job-3",
    role: "Platform Engineer",
    manualCompanyName: "Vertex Cloud",
    stage: "interview",
    country: { name: "Singapore" },
    state: { name: "Remote" },
    appliedDate: new Date().toISOString(),
    salary: "28 LPA",
    source: "Referrals",
    notes: "Infra platform, automations, and deployment tooling.",
  },
  {
    id: "job-4",
    role: "Product Engineer",
    manualCompanyName: "Orbit Systems",
    stage: "rejected",
    country: { name: "India" },
    state: { name: "Tamil Nadu" },
    appliedDate: new Date().toISOString(),
    salary: "20 LPA",
    source: "Company site",
    notes: "Product UI ownership with design-system collaboration.",
  },
];

export default function JobTrackerPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [draggedJobId, setDraggedJobId] = useState("");
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState("");
  const [previewJob, setPreviewJob] = useState(null);
  const [newJob, setNewJob] = useState({
    role: "",
    company: "",
    stage: "applied",
    source: "",
    location: "",
    salary: "",
    notes: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const authResponse = await fetch("/api/auth/me", { cache: "no-store" });
        if (!authResponse.ok) return router.push("/login");
        const authData = await authResponse.json();
        setUser(authData.user);

        const response = await fetch("/api/jobs?limit=100", {
          cache: "no-store",
          credentials: "include",
        });
        const data = await response.json();
        setJobs(
          Array.isArray(data.items) && data.items.length
            ? data.items
            : dummyJobs,
        );
      } catch {
        setJobs(dummyJobs);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const filteredJobs = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return jobs;

    return jobs.filter((job) => {
      const haystack = [
        job.role,
        job.manualCompanyName,
        job.company?.name,
        job.source,
        job.country?.name,
        job.state?.name,
        job.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [jobs, query]);

  const groupedJobs = useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage.key] = filteredJobs.filter((job) =>
        job.stage === stage.key ? true : stage.key === "applied" && !job.stage,
      );
      return acc;
    }, {});
  }, [filteredJobs]);

  const totals = useMemo(
    () =>
      stages.reduce(
        (acc, stage) => {
          acc[stage.key] = groupedJobs[stage.key]?.length || 0;
          return acc;
        },
        { total: filteredJobs.length },
      ),
    [filteredJobs.length, groupedJobs],
  );

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const moveJobToStage = (jobId, nextStage) => {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === jobId ? { ...job, stage: nextStage } : job,
      ),
    );
  };

  const openAddJob = () => {
    setEditingJobId("");
    setNewJob({
      role: "",
      company: "",
      stage: "applied",
      source: "",
      location: "",
      salary: "",
      notes: "",
    });
    setAddJobOpen(true);
  };

  const openEditJob = (job) => {
    setEditingJobId(job.id);
    setNewJob({
      role: job.role || "",
      company: job.manualCompanyName || job.company?.name || "",
      stage: job.stage || "applied",
      source: job.source || "",
      location: job.country?.name || job.state?.name || "",
      salary: job.salary || "",
      notes: job.notes || "",
    });
    setAddJobOpen(true);
  };

  const openPreviewJob = (job) => {
    setPreviewJob(job);
  };

  const handleDrop = (event, nextStage) => {
    event.preventDefault();
    const jobId = event.dataTransfer.getData("text/plain") || draggedJobId;
    if (jobId) {
      moveJobToStage(jobId, nextStage);
    }
    setDraggedJobId("");
  };

  const handleDragStart = (event, jobId) => {
    setDraggedJobId(jobId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", jobId);
  };

  const handleDragEnd = () => {
    setDraggedJobId("");
  };

  const handleAddJob = (event) => {
    event.preventDefault();
    setJobs((currentJobs) => {
      const nextJob = {
        id: editingJobId || `job-${currentJobs.length + 1}`,
        role: newJob.role,
        manualCompanyName: newJob.company,
        stage: newJob.stage,
        country: { name: newJob.location || "Remote" },
        state: { name: "Remote" },
        appliedDate: new Date().toISOString(),
        salary: newJob.salary,
        source: newJob.source || "Manual",
        notes: newJob.notes,
      };

      if (editingJobId) {
        return currentJobs.map((job) =>
          job.id === editingJobId ? nextJob : job,
        );
      }

      return [nextJob, ...currentJobs];
    });
    setAddJobOpen(false);
    setEditingJobId("");
    setNewJob({
      role: "",
      company: "",
      stage: "applied",
      source: "",
      location: "",
      salary: "",
      notes: "",
    });
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading job tracker
        </div>
      </div>
    );
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
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">
                      Build Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbPage>Job Tracker</BreadcrumbPage>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <Button variant="outline" className="gap-2" onClick={openAddJob}>
              <Plus className="h-4 w-4" />
              Add job
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4">
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Job Tracker</CardTitle>
                  <CardDescription>
                    Organize applications across stages with a compact board
                  </CardDescription>
                </div>
                <div className="relative w-full max-w-sm">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search jobs..."
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <Card key={stage.key}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {stage.label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {totals[stage.key] || 0}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-4 xl:grid-cols-4">
            {stages.map((stage) => {
              const StageIcon = stage.icon;
              const items = groupedJobs[stage.key] || [];

              return (
                <Card
                  key={stage.key}
                  className="min-h-[480px]"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, stage.key)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                          <StageIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {stage.label}
                          </CardTitle>
                          <CardDescription>{items.length} jobs</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.length ? (
                      items.map((job) => (
                        <article
                          key={job.id}
                          draggable
                          onDragStart={(event) =>
                            handleDragStart(event, job.id)
                          }
                          onDragEnd={handleDragEnd}
                          className={`rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-secondary/30 ${
                            draggedJobId === job.id
                              ? "cursor-grabbing opacity-80"
                              : "cursor-grab"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {job.source || "Source"}
                                </Badge>
                                <Badge className="text-[10px]">
                                  {job.stage || "applied"}
                                </Badge>
                              </div>
                              <h3 className="mt-3 truncate text-sm font-semibold">
                                {job.role}
                              </h3>
                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                {job.manualCompanyName ||
                                  job.company?.name ||
                                  "Company not set"}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openPreviewJob(job)}
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </div>

                          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                            {job.notes ||
                              "Track this application and move it across stages."}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {job.country?.name ? (
                              <Badge variant="outline" className="text-[10px]">
                                <MapPin className="mr-1 h-3 w-3" />
                                {job.country.name}
                                {job.state?.name ? `, ${job.state.name}` : ""}
                              </Badge>
                            ) : null}
                            {job.salary ? (
                              <Badge variant="outline" className="text-[10px]">
                                {job.salary}
                              </Badge>
                            ) : null}
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                            <span className="text-[11px] text-muted-foreground">
                              {job.appliedDate
                                ? new Date(job.appliedDate).toLocaleDateString()
                                : "No date"}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
                        Drop applications here
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Dialog open={addJobOpen} onOpenChange={setAddJobOpen}>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {editingJobId ? "Edit job" : "Add job"}
                </DialogTitle>
                <DialogDescription>
                  {editingJobId
                    ? "Update the selected job card details."
                    : "Create a new job card and place it into the tracker."}
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleAddJob}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job title</label>
                    <Input
                      value={newJob.role}
                      onChange={(event) =>
                        setNewJob((current) => ({
                          ...current,
                          role: event.target.value,
                        }))
                      }
                      placeholder="Senior Frontend Engineer"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <Input
                      value={newJob.company}
                      onChange={(event) =>
                        setNewJob((current) => ({
                          ...current,
                          company: event.target.value,
                        }))
                      }
                      placeholder="Aurora Labs"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stage</label>
                    <select
                      value={newJob.stage}
                      onChange={(event) =>
                        setNewJob((current) => ({
                          ...current,
                          stage: event.target.value,
                        }))
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {stages.map((stage) => (
                        <option key={stage.key} value={stage.key}>
                          {stage.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Source</label>
                    <Input
                      value={newJob.source}
                      onChange={(event) =>
                        setNewJob((current) => ({
                          ...current,
                          source: event.target.value,
                        }))
                      }
                      placeholder="LinkedIn"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={newJob.location}
                      onChange={(event) =>
                        setNewJob((current) => ({
                          ...current,
                          location: event.target.value,
                        }))
                      }
                      placeholder="Bangalore"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salary</label>
                    <Input
                      value={newJob.salary}
                      onChange={(event) =>
                        setNewJob((current) => ({
                          ...current,
                          salary: event.target.value,
                        }))
                      }
                      placeholder="18 LPA"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    value={newJob.notes}
                    onChange={(event) =>
                      setNewJob((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                    placeholder="Add short notes"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddJobOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingJobId ? "Update job" : "Save job"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={Boolean(previewJob)}
            onOpenChange={() => setPreviewJob(null)}
          >
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>
                  {previewJob?.role || "Job application"}
                </DialogTitle>
                <DialogDescription>
                  Read-only application details
                </DialogDescription>
              </DialogHeader>
              {previewJob ? (
                <ScrollArea className="max-h-[65vh] pr-3">
                  <div className="space-y-4 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{previewJob.id}</Badge>
                      <Badge>{previewJob.stage || "applied"}</Badge>
                      <Badge variant="outline">
                        {previewJob.source || "Source"}
                      </Badge>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Job title" value={previewJob.role} />
                      <Field
                        label="Organization"
                        value={
                          previewJob.manualCompanyName ||
                          previewJob.company?.name
                        }
                      />
                      <Field
                        label="Location"
                        value={`${previewJob.country?.name || "Remote"}${
                          previewJob.state?.name
                            ? `, ${previewJob.state.name}`
                            : ""
                        }`}
                      />
                      <Field
                        label="Salary"
                        value={previewJob.salary || "N/A"}
                      />
                      <Field
                        label="Applied at"
                        value={
                          previewJob.appliedDate
                            ? new Date(
                                previewJob.appliedDate,
                              ).toLocaleDateString()
                            : "No date"
                        }
                      />
                      <Field
                        label="Stage"
                        value={previewJob.stage || "applied"}
                      />
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/20 p-3">
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="mt-1 text-sm text-foreground">
                        {previewJob.notes || "No notes available."}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/20 p-3">
                      <p className="text-xs text-muted-foreground">
                        Full record
                      </p>
                      <pre className="mt-2 max-h-48 whitespace-pre-wrap break-words text-[11px] text-muted-foreground">
                        {JSON.stringify(previewJob, null, 2)}
                      </pre>
                    </div>
                  </div>
                </ScrollArea>
              ) : null}
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value || "N/A"}</p>
    </div>
  );
}
