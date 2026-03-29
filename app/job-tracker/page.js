"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiGrid,
  FiLoader,
  FiMapPin,
  FiMenu,
  FiPlus,
  FiSearch,
  FiSettings,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import UserAvatar from "@/components/UserAvatar";

const stages = [
  {
    key: "applied",
    label: "To Do",
    color: "border-sky-500/40 bg-sky-500/10 text-sky-200",
    icon: FiClock,
  },
  {
    key: "shortListed",
    label: "In Progress",
    color: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    icon: FiLoader,
  },
  {
    key: "interview",
    label: "In Review",
    color: "border-violet-500/40 bg-violet-500/10 text-violet-200",
    icon: FiCheckCircle,
  },
  {
    key: "rejected",
    label: "Done",
    color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    icon: FiXCircle,
  },
];

const sidebarItems = [
  { label: "Home", icon: FiGrid, href: "/dashboard" },
  { label: "Tasks", icon: FiBriefcase, href: "/job-tracker", active: true },
  { label: "Profile", icon: FiUser, href: "/profile" },
  { label: "Settings", icon: FiSettings, href: "/dashboard" },
];

const dummyJob = {
  id: "dummy-job-1",
  role: "Senior Frontend Engineer",
  manualCompanyName: "Aurora Labs",
  stage: "shortListed",
  country: { name: "India" },
  state: { name: "Karnataka" },
  appliedDate: new Date().toISOString(),
  salary: "18 LPA",
  source: "LinkedIn",
  notes:
    "UI system redesign, board interactions, and performance work for a product suite.",
};

export default function JobTrackerPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [draggedJobId, setDraggedJobId] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) {
          router.push("/login");
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/jobs?limit=100", {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to load jobs");
        }

        const data = await response.json();
        const apiJobs = Array.isArray(data.items) ? data.items : [];
        setJobs(apiJobs.length > 0 ? apiJobs : [dummyJob]);
      } catch (err) {
        setError(err.message || "Unable to load jobs.");
        setJobs([dummyJob]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const visibleJobs = useMemo(() => {
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
    const groups = stages.reduce((acc, stage) => {
      acc[stage.key] = [];
      return acc;
    }, {});

    visibleJobs.forEach((job) => {
      const stageKey = stages.some((stage) => stage.key === job.stage)
        ? job.stage
        : "applied";
      groups[stageKey].push(job);
    });

    return groups;
  }, [visibleJobs]);

  const totals = useMemo(
    () =>
      stages.reduce(
        (acc, stage) => {
          acc[stage.key] = groupedJobs[stage.key]?.length || 0;
          acc.total += acc[stage.key];
          return acc;
        },
        { total: 0 },
      ),
    [groupedJobs],
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

  const handleDragStart = (event, jobId) => {
    setDraggedJobId(jobId);
    const node = event.currentTarget;
    const clone = node.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";
    clone.style.width = `${node.getBoundingClientRect().width}px`;
    document.body.appendChild(clone);
    event.dataTransfer.setDragImage(clone, 40, 20);
    event.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      document.body.removeChild(clone);
    }, 0);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#151515]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-white/80" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151515] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#181818] px-4 py-5 lg:flex lg:flex-col">
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
              <FiBriefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">JD2CV</p>
              <p className="text-xs text-white/50">Job board</p>
            </div>
          </div>

          <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              Search
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
              <FiSearch className="h-4 w-4 text-white/40" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>
          </div>

          <nav className="flex-1 space-y-6 text-sm">
            <div>
              <p className="mb-2 px-3 text-[11px] uppercase tracking-[0.2em] text-white/35">
                Essentials
              </p>
              <div className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                        item.active
                          ? "bg-white text-black shadow-sm"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <p className="mb-2 px-3 text-[11px] uppercase tracking-[0.2em] text-white/35">
                Projects
              </p>
              <div className="space-y-2">
                {[
                  "Atlas CRM Revamp",
                  "Nimbus Dashboard",
                  "Orion API Gateway",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-white/70 hover:bg-white/5"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="truncate text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-hidden">
          <header className="border-b border-white/10 bg-[#171717]/90 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
              <div className="flex items-center gap-3">
                <button className="lg:hidden rounded-lg border border-white/10 bg-white/5 p-2 text-white/70">
                  <FiMenu className="h-4 w-4" />
                </button>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 hover:text-white"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </div>

              <div className="flex flex-1 items-center justify-end gap-3">
                <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 md:flex">
                  <FiSearch className="h-4 w-4 text-white/40" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                  />
                </div>

                <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                  <FiFilter className="h-4 w-4" />
                  <span className="hidden sm:inline">Status: All</span>
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                  <FiGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Board</span>
                </button>
                <UserAvatar user={user} onLogout={handleLogout} />
              </div>
            </div>
          </header>

          <div className="border-b border-white/10 px-4 py-6 lg:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-white/45">Tasks</p>
                <h1 className="text-4xl font-light tracking-tight text-white">
                  Job Board
                </h1>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90"
              >
                <FiPlus className="h-4 w-4" />
                Add job
              </Link>
            </div>
          </div>

          {error ? (
            <div className="mx-4 mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 lg:mx-6">
              {error}
            </div>
          ) : null}

          <div className="px-4 py-5 lg:px-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stages.map((stage) => (
                <div
                  key={stage.key}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    {stage.label}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-3xl font-semibold text-white">
                      {totals[stage.key] || 0}
                    </p>
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] ${stage.color}`}
                    >
                      Board
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <section className="overflow-x-auto px-4 pb-8 lg:px-6">
            <div className="min-w-[1280px]">
              <div className="grid grid-cols-4 gap-4">
                {stages.map((stage) => {
                  const StageIcon = stage.icon;
                  const items = groupedJobs[stage.key] || [];

                  return (
                    <div
                      key={stage.key}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (draggedJobId) {
                          moveJobToStage(draggedJobId, stage.key);
                        }
                        setDraggedJobId("");
                      }}
                      className="flex min-h-[72vh] flex-col rounded-3xl border border-white/10 bg-[#1b1b1b] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${stage.color}`}
                          >
                            <StageIcon className="h-4 w-4" />
                          </span>
                          <div>
                            <h2 className="text-sm font-semibold text-white">
                              {stage.label}
                            </h2>
                            <p className="text-xs text-white/35">
                              {items.length} cards
                            </p>
                          </div>
                        </div>
                        <button className="rounded-lg bg-white/5 p-2 text-white/50 hover:bg-white/10">
                          <FiPlus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex flex-1 flex-col gap-3">
                        {items.length === 0 ? (
                          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-10 text-center">
                            <p className="text-sm text-white/35">
                              Drop applications here
                            </p>
                          </div>
                        ) : (
                          items.map((job) => (
                            <article
                              key={job.id}
                              draggable
                              onDragStart={(event) =>
                                handleDragStart(event, job.id)
                              }
                              onDragEnd={() => setDraggedJobId("")}
                              className="cursor-move rounded-2xl border border-white/10 bg-[#202020] p-4 shadow-lg transition-transform hover:-translate-y-0.5 hover:border-white/20"
                              style={{
                                transform:
                                  draggedJobId === job.id
                                    ? "scale(1.01)"
                                    : "scale(1)",
                              }}
                            >
                              <div className="mb-3 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-200">
                                      High
                                    </span>
                                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/70">
                                      {job.source || "Source"}
                                    </span>
                                  </div>
                                  <h3 className="mt-3 truncate text-base font-semibold text-white">
                                    {job.role}
                                  </h3>
                                  <p className="mt-1 truncate text-xs text-white/45">
                                    {job.manualCompanyName ||
                                      job.company?.name ||
                                      "Company not set"}
                                  </p>
                                </div>
                                <button className="rounded-lg bg-white/5 p-2 text-white/45 hover:bg-white/10">
                                  <FiMenu className="h-4 w-4" />
                                </button>
                              </div>

                              <p className="text-sm leading-6 text-white/65">
                                {job.notes ||
                                  "Track this application, attach notes, and move it across stages."}
                              </p>

                              <div className="mt-4 flex flex-wrap gap-2">
                                {job.country?.name ? (
                                  <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/70">
                                    {job.country.name}
                                    {job.state?.name
                                      ? `, ${job.state.name}`
                                      : ""}
                                  </span>
                                ) : null}
                                {job.salary ? (
                                  <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/70">
                                    {job.salary}
                                  </span>
                                ) : null}
                              </div>

                              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-white/45">
                                <span>
                                  {job.appliedDate
                                    ? new Date(
                                        job.appliedDate,
                                      ).toLocaleDateString()
                                    : "No date"}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <FiMapPin className="h-3.5 w-3.5" />
                                  {job.state?.name || "Remote"}
                                </span>
                              </div>
                            </article>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
