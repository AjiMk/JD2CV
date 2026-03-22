'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiBarChart2, FiBriefcase, FiCheckCircle, FiChevronLeft, FiChevronRight, FiFilter, FiPieChart, FiSearch, FiTarget } from 'react-icons/fi'
import UserAvatar from '@/components/UserAvatar'

const sampleApplications = [
  { id: 1, company: 'Google', role: 'Frontend Engineer', stage: 'interview', appliedDate: '2026-03-18', location: 'Remote', salary: '$140k', source: 'LinkedIn', notes: 'Phone screen scheduled' },
  { id: 2, company: 'Amazon', role: 'Software Engineer', stage: 'applied', appliedDate: '2026-03-17', location: 'Bangalore', salary: '$125k', source: 'Company site', notes: 'Resume tailored to JD' },
  { id: 3, company: 'Meta', role: 'Product Engineer', stage: 'short listed', appliedDate: '2026-03-16', location: 'Remote', salary: '$150k', source: 'Referral', notes: 'Recruiter reached out' },
  { id: 4, company: 'Stripe', role: 'Web Engineer', stage: 'rejected', appliedDate: '2026-03-14', location: 'Remote', salary: '$145k', source: 'LinkedIn', notes: 'No response after OA' },
  { id: 5, company: 'Microsoft', role: 'Full Stack Engineer', stage: 'applied', appliedDate: '2026-03-13', location: 'Hyderabad', salary: '$132k', source: 'Indeed', notes: 'Awaiting review' },
  { id: 6, company: 'HubSpot', role: 'UI Engineer', stage: 'short listed', appliedDate: '2026-03-12', location: 'Remote', salary: '$128k', source: 'Company site', notes: 'Portfolio reviewed' },
]

const stageLabels = ['short listed', 'applied', 'interview', 'rejected']

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 3

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) router.push('/login')
    else setUser(JSON.parse(userData))
  }, [router])

  const filtered = useMemo(() => sampleApplications.filter((item) => {
    const matchesQuery = `${item.company} ${item.role} ${item.location}`.toLowerCase().includes(query.toLowerCase())
    const matchesStage = stage === 'all' || item.stage === stage
    return matchesQuery && matchesStage
  }), [query, stage])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const counts = stageLabels.reduce((acc, key) => ({ ...acc, [key]: sampleApplications.filter((a) => a.stage === key).length }), {})
  const total = sampleApplications.length
  const interviewRate = Math.round((counts.interview / total) * 100)

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" /></div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="border-b bg-white/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Welcome back</p>
            <h1 className="text-xl font-bold text-gray-900">{user.name || user.email}</h1>
          </div>
          <div className="flex items-center gap-3">
            <UserAvatar user={user} onLogout={() => { localStorage.removeItem('user'); router.push('/') }} />
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Applications" value={total} icon={FiBriefcase} />
          <StatCard title="Short Listed" value={counts['short listed']} icon={FiCheckCircle} />
          <StatCard title="Interviews" value={counts.interview} icon={FiTarget} />
          <StatCard title="Interview Rate" value={`${interviewRate}%`} icon={FiBarChart2} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Application Funnel</h2>
                <p className="text-sm text-gray-500">Stage distribution across your job search</p>
              </div>
              <FiPieChart className="h-5 w-5 text-primary-600" />
            </div>
            <div className="space-y-4">
              {stageLabels.map((label) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 capitalize">{label}</span>
                    <span className="text-gray-500">{counts[label]}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full" style={{ width: `${total ? (counts[label] / total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Stage Snapshot</h2>
            <div className="space-y-3">
              {stageLabels.map((label) => (
                <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="text-sm font-medium text-gray-700 capitalize">{label}</span>
                  <span className="text-sm font-bold text-gray-900">{counts[label]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Filtered Applications</h2>
              <p className="text-sm text-gray-500">Paginated records for the current search</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} className="pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-64" placeholder="Search company, role, location" />
              </div>
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select value={stage} onChange={(e) => { setStage(e.target.value); setPage(1) }} className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="all">All stages</option>
                  {stageLabels.map((label) => <option key={label} value={label}>{label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-3 pr-4">Company</th>
                  <th className="py-3 pr-4">Role</th>
                  <th className="py-3 pr-4">Stage</th>
                  <th className="py-3 pr-4">Applied</th>
                  <th className="py-3 pr-4">Location</th>
                  <th className="py-3 pr-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="py-4 pr-4 font-medium text-gray-900">{row.company}</td>
                    <td className="py-4 pr-4 text-gray-700">{row.role}</td>
                    <td className="py-4 pr-4"><span className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 capitalize">{row.stage}</span></td>
                    <td className="py-4 pr-4 text-gray-600">{row.appliedDate}</td>
                    <td className="py-4 pr-4 text-gray-600">{row.location}</td>
                    <td className="py-4 pr-4 text-gray-600 max-w-xs">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-5">
            <p className="text-sm text-gray-500">Showing {visibleRows.length} of {filtered.length} filtered results</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border rounded-lg disabled:opacity-40"><FiChevronLeft /></button>
              <span className="text-sm text-gray-600">Page {page} of {pageCount}</span>
              <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount} className="p-2 border rounded-lg disabled:opacity-40"><FiChevronRight /></button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
