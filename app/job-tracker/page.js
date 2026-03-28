"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPlus,
  FiXCircle,
  FiLoader,
} from "react-icons/fi";
import UserAvatar from "@/components/UserAvatar";

const stages = [
  {
    key: "applied",
    label: "Applied",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: FiClock,
  },
  {
    key: "shortListed",
    label: "Shortlisted",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    icon: FiLoader,
  },
  {
    key: "interview",
    label: "Interview",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: FiCheckCircle,
  },
  {
    key: "rejected",
    label: "Rejected",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    icon: FiXCircle,
  },
];

const dummyJob = {
  id: "dummy-job-1",
  role: "Senior Frontend Engineer",
  manualCompanyName: "Aurora Labs",
  stage: "interview",
  country: { name: "India" },
  state: { name: "Karnataka" },
  appliedDate: new Date().toISOString(),
  salary: "18 LPA",
  source: "LinkedIn",
  notes:
    "Final interview scheduled. Focused on React performance, design systems, and dashboard architecture.",
};

export default function JobTrackerPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [draggedJobId, setDraggedJobId] = useState("");

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
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const groupedJobs = useMemo(() => {
    const groups = stages.reduce((acc, stage) => {
      acc[stage.key] = [];
      return acc;
    }, {});

    jobs.forEach((job) => {
      const stageKey = stages.some((stage) => stage.key === job.stage)
        ? job.stage
        : "applied";
      groups[stageKey].push(job);
    });

    return groups;
  }, [jobs]);

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
        job.id === jobId
          ? {
              ...job,
              stage: nextStage,
            }
          : job,
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-200"
            >
              <FiArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Job tracker
              </p>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                JD2CV
              </h1>
            </div>
          </div>

          <UserAvatar user={user} onLogout={handleLogout} />
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Job board
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track applications across stages in a kanban-style board.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100"
            >
              <FiPlus className="h-4 w-4" />
              Add a job
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-xl bg-primary-50 p-4 dark:bg-primary-950/30">
              <p className="text-xs uppercase tracking-wide text-primary-700 dark:text-primary-300">
                Total
              </p>
              <p className="mt-2 text-3xl font-bold text-primary-900 dark:text-primary-100">
                {totals.total}
              </p>
            </div>
            {stages.map((stage) => (
              <div
                key={stage.key}
                className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
              >
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {stage.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {totals[stage.key] || 0}
                </p>
              </div>
            ))}
          </div>
        </section>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="min-w-[1200px] p-4">
            <div className="grid grid-cols-4 gap-4">
              {stages.map((stage) => {
                const StageIcon = stage.icon;
                const items = groupedJobs[stage.key] || [];

                return (
                  <div
                    key={stage.key}
                    className="flex min-h-[70vh] flex-col rounded-2xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-950/40"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      if (draggedJobId) {
                        moveJobToStage(draggedJobId, stage.key);
                      }
                      setDraggedJobId("");
                    }}
                  >
                    <div
                      className={`mb-4 flex items-center justify-between rounded-xl border px-3 py-2 ${stage.color}`}
                    >
                      <div className="flex items-center gap-2">
                        <StageIcon className="h-4 w-4" />
                        <h3 className="text-sm font-semibold">{stage.label}</h3>
                      </div>
                      <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {items.length}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col gap-3">
                      {items.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center dark:border-gray-700 dark:bg-gray-900">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No applications in this stage.
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
                            className="cursor-move rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                            style={{
                              transform:
                                draggedJobId === job.id
                                  ? "scale(1.02)"
                                  : "scale(1)",
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  {job.role}
                                </h4>
                                <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                                  {job.manualCompanyName ||
                                    job.company?.name ||
                                    "Company not set"}
                                </p>
                              </div>
                              <span
                                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${stage.color}`}
                              >
                                {stage.label}
                              </span>
                            </div>

                            <div className="mt-3 space-y-2 text-xs text-gray-500 dark:text-gray-400">
                              {job.country?.name ? (
                                <p className="inline-flex items-center gap-1">
                                  <FiMapPin className="h-3.5 w-3.5" />
                                  {job.country.name}
                                  {job.state?.name ? `, ${job.state.name}` : ""}
                                </p>
                              ) : null}
                              {job.appliedDate ? (
                                <p>
                                  Applied{" "}
                                  {new Date(
                                    job.appliedDate,
                                  ).toLocaleDateString()}
                                </p>
                              ) : null}
                              {job.salary ? <p>Salary: {job.salary}</p> : null}
                              {job.source ? <p>Source: {job.source}</p> : null}
                            </div>

                            {job.notes ? (
                              <p className="mt-3 line-clamp-4 text-xs leading-5 text-gray-600 dark:text-gray-300">
                                {job.notes}
                              </p>
                            ) : null}
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
  );
}
