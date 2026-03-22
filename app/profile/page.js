'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiEdit3, FiFileText, FiMoon, FiSun, FiUser, FiCheckCircle, FiCompass } from 'react-icons/fi'
import PersonalInfoForm from '@/components/forms/PersonalInfoForm'
import UserAvatar from '@/components/UserAvatar'
import useResumeStore from '@/store/resumeStore'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const { personalInfo, education, workExperience, skills, projects } = useResumeStore()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))

    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode))
  }, [router])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const profileCompletion = useMemo(() => {
    const checks = [
      personalInfo.fullName,
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      education.length > 0,
      workExperience.length > 0,
      skills.technical.length > 0,
      projects.length > 0,
    ]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
  }, [personalInfo, education, workExperience, skills, projects])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" /></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur sticky top-0 z-20 border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <FiFileText className="h-7 w-7 text-primary-600 group-hover:scale-105 transition-transform" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-600 transition-colors">User profile</p>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">JD2CV</h1>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
            </button>
            <UserAvatar user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Profile Completion" value={`${profileCompletion}%`} icon={FiCheckCircle} />
          <StatCard title="Resume Sections" value={4} subtitle="Education, work, skills, projects" icon={FiCompass} />
          <StatCard title="Profile Focus" value="Personal Details" subtitle="Keep this section clean and complete" icon={FiUser} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Personal Information</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">This is the profile area used across the application.</p>
              </div>
              <Link href="/resume-builder" className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700">
                <FiEdit3 className="h-5 w-5" />
                Resume Builder
              </Link>
            </div>
            <PersonalInfoForm />
          </div>

          <aside className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">Profile Summary</h3>
              <div className="space-y-3 text-sm">
                <Row label="Name" value={personalInfo.fullName || 'Not set'} />
                <Row label="Email" value={personalInfo.email || 'Not set'} />
                <Row label="Phone" value={personalInfo.phone || 'Not set'} />
                <Row label="Location" value={personalInfo.location || 'Not set'} />
                <Row label="LinkedIn" value={personalInfo.linkedin || 'Not set'} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">What belongs here</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Personal details only</li>
                <li>• Contact links and location</li>
                <li>• Information used to personalize resumes</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
          {subtitle ? <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p> : null}
        </div>
        <div className="p-3 rounded-xl bg-primary-50 dark:bg-gray-800 text-primary-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-right text-gray-900 dark:text-gray-100 font-medium break-all">{value}</span>
    </div>
  )
}
