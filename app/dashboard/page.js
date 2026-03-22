"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiBarChart2,
  FiBriefcase,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiPieChart,
  FiSearch,
  FiTarget,
} from "react-icons/fi";
import UserAvatar from "@/components/UserAvatar";

const stageLabels = ["shortListed", "applied", "interview", "rejected"];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 6;

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

  const visibleApplications = useMemo(() => {
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

  const pageCount = Math.max(
    1,
    Math.ceil(visibleApplications.length / pageSize),
  );
  const rows = visibleApplications.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const counts = stageLabels.reduce(
    (acc, key) => ({
      ...acc,
      [key]: applications.filter((a) => a.stage === key).length,
    }),
    {},
  );

  const total = applications.length;
  const interviewRate = total
    ? Math.round((counts.interview / total) * 100)
    : 0;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur sticky top-0 z-10 border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back
            </p>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {user.name || user.email}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <UserAvatar user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Applications"
            value={total}
            icon={FiBriefcase}
          />
          <StatCard
            title="Short Listed"
            value={counts.shortListed || 0}
            icon={FiCheckCircle}
          />
          <StatCard
            title="Interviews"
            value={counts.interview || 0}
            icon={FiTarget}
          />
          <StatCard
            title="Interview Rate"
            value={`${interviewRate}%`}
            icon={FiBarChart2}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Application Funnel
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Stage distribution across your job search
                </p>
              </div>
              <FiPieChart className="h-5 w-5 text-primary-600" />
            </div>
            <div className="space-y-4">
              {stageLabels.map((label) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {label}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {counts[label] || 0}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full"
                      style={{
                        width: `${total ? ((counts[label] || 0) / total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Stage Snapshot
            </h2>
            <div className="space-y-3">
              {stageLabels.map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {label}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {counts[label] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Filtered Applications
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Paginated records for the current search
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-full sm:w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  placeholder="Search company, role, location"
                />
              </div>
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={stage}
                  onChange={(e) => {
                    setStage(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All stages</option>
                  {stageLabels.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  <th className="py-3 pr-4">Company</th>
                  <th className="py-3 pr-4">Role</th>
                  <th className="py-3 pr-4">Stage</th>
                  <th className="py-3 pr-4">Applied</th>
                  <th className="py-3 pr-4">Location</th>
                  <th className="py-3 pr-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const company =
                    row.company?.name || row.manualCompanyName || "Unknown";
                  const location = [row.state?.name, row.country?.name]
                    .filter(Boolean)
                    .join(", ");
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <td className="py-4 pr-4 font-medium text-gray-900 dark:text-gray-100">
                        {company}
                      </td>
                      <td className="py-4 pr-4 text-gray-700 dark:text-gray-300">
                        {row.role}
                      </td>
                      <td className="py-4 pr-4">
                        <span className="px-2.5 py-1 rounded-full bg-primary-50 dark:bg-gray-800 text-primary-700 dark:text-primary-300 capitalize">
                          {row.stage}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-gray-600 dark:text-gray-400">
                        {row.appliedDate
                          ? new Date(row.appliedDate).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-4 pr-4 text-gray-600 dark:text-gray-400">
                        {location || "—"}
                      </td>
                      <td className="py-4 pr-4 text-gray-600 dark:text-gray-400 max-w-xs">
                        {row.notes || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {rows.length} of {visibleApplications.length} filtered
              results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border rounded-lg disabled:opacity-40 border-gray-200 dark:border-gray-700"
              >
                <FiChevronLeft />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Page {page} of {pageCount}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className="p-2 border rounded-lg disabled:opacity-40 border-gray-200 dark:border-gray-700"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </h3>
        </div>
        <div className="p-3 rounded-xl bg-primary-50 dark:bg-gray-800 text-primary-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
