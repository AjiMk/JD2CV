'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FiFileText, FiUser, FiBookOpen, FiBriefcase, FiAward, 
  FiMenu, FiX, FiEye, FiMaximize2, FiMinimize2, FiMoon, FiSun 
} from 'react-icons/fi'
import PersonalInfoForm from '@/components/forms/PersonalInfoForm'
import EducationForm from '@/components/forms/EducationForm'
import WorkExperienceForm from '@/components/forms/WorkExperienceForm'
import SkillsForm from '@/components/forms/SkillsForm'
import ProjectsForm from '@/components/forms/ProjectsForm'
import CertificationsForm from '@/components/forms/CertificationsForm'
import JobDescriptionForm from '@/components/forms/JobDescriptionForm'
import UserAvatar from '@/components/UserAvatar'
import ResumePreview from '@/components/ResumePreview'
import useResumeStore from '@/store/resumeStore'

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('personal')
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [previewFullscreen, setPreviewFullscreen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const { personalInfo, education, workExperience, skills, projects, jobDescription } = useResumeStore()

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData))
    }
    
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [router])

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Save preference
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const handleGenerateResume = () => {
    router.push('/resume')
  }

  const isFormComplete = () => {
    return (
      personalInfo.fullName &&
      personalInfo.email &&
      education.length > 0 &&
      workExperience.length > 0 &&
      skills.technical.length > 0
    )
  }

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: FiUser },
    { id: 'education', name: 'Education', icon: FiBookOpen },
    { id: 'experience', name: 'Experience', icon: FiBriefcase },
    { id: 'skills', name: 'Skills', icon: FiAward },
    { id: 'projects', name: 'Projects', icon: FiFileText },
    { id: 'certifications', name: 'Certifications', icon: FiAward },
    { id: 'job', name: 'Job Description', icon: FiFileText },
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Navigation */}
      <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b fixed w-full z-10 shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`lg:hidden p-2 rounded-md ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'}`}
              >
                {sidebarOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
              </button>
              <Link href="/dashboard" className="flex items-center">
                <FiFileText className="h-7 w-7 text-primary-600" />
                <span className={`ml-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>JD2CV</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerateResume}
                disabled={!isFormComplete()}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <FiEye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`lg:hidden flex items-center gap-2 px-3 py-1.5 ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} text-sm rounded-lg transition-colors`}
              >
                {showPreview ? <FiX className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                {darkMode ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
              </button>
              <UserAvatar user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-14 h-screen">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-20 w-60 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r pt-14 lg:pt-0
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          transition-transform duration-300 ease-in-out overflow-y-auto
        `}>
          <nav className="px-3 py-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSidebarOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-sm
                    ${activeTab === tab.id 
                      ? 'bg-primary-50 text-primary-700 font-semibold' 
                      : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              )
            })}
          </nav>

          {/* Progress Indicator */}
          <div className={`px-3 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-2`}>
            <h3 className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 uppercase tracking-wide`}>Progress</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Personal Info</span>
                <span className={personalInfo.fullName ? 'text-green-600' : 'text-gray-400'}>
                  {personalInfo.fullName ? '✓' : '○'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Education</span>
                <span className={education.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                  {education.length > 0 ? '✓' : '○'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Experience</span>
                <span className={workExperience.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                  {workExperience.length > 0 ? '✓' : '○'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Skills</span>
                <span className={skills.technical.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                  {skills.technical.length > 0 ? '✓' : '○'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Projects</span>
                <span className={projects.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                  {projects.length > 0 ? '✓' : '○'}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area with Split View */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Form Section */}
          <main className={`flex-1 p-4 lg:p-6 overflow-y-auto ${previewFullscreen ? 'hidden lg:block' : ''}`}>
            {activeTab === 'personal' && <PersonalInfoForm />}
            {activeTab === 'education' && <EducationForm />}
            {activeTab === 'experience' && <WorkExperienceForm />}
            {activeTab === 'skills' && <SkillsForm />}
            {activeTab === 'projects' && <ProjectsForm />}
            {activeTab === 'certifications' && <CertificationsForm />}
            {activeTab === 'job' && <JobDescriptionForm />}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1].id)
                  }
                }}
                disabled={activeTab === tabs[0].id}
                className={`px-5 py-2 text-sm border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                Previous
              </button>
              
              {activeTab === tabs[tabs.length - 1].id ? (
                <button
                  onClick={handleGenerateResume}
                  disabled={!isFormComplete()}
                  className="px-5 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Generate Resume
                </button>
              ) : (
                <button
                  onClick={() => {
                    const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1].id)
                    }
                  }}
                  className="px-5 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Next
                </button>
              )}
            </div>
          </main>

          {/* Live Preview Panel */}
          {showPreview && (
            <aside className={`
              ${previewFullscreen ? 'w-full' : 'hidden lg:block lg:w-96 xl:w-[450px]'}
              ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border-l flex flex-col
            `}>
              <div className={`p-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border-b flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <FiEye className="h-4 w-4 text-primary-600" />
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Live Preview</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewFullscreen(!previewFullscreen)}
                    className={`p-1.5 ${darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded transition-colors`}
                    title={previewFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {previewFullscreen ? <FiMinimize2 className="h-4 w-4" /> : <FiMaximize2 className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className={`lg:hidden p-1.5 ${darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded transition-colors`}
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="transform scale-75 origin-top w-[133%]">
                  <ResumePreview />
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
