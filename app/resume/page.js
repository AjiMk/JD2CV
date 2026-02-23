'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { 
  FiDownload, FiEdit3, FiArrowLeft, FiFileText, FiZap, FiSave, FiX 
} from 'react-icons/fi'
import ResumePreview from '@/components/ResumePreview'
import UserAvatar from '@/components/UserAvatar'
import useResumeStore from '@/store/resumeStore'

export default function ResumePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [user, setUser] = useState(null)
  const { personalInfo, setPersonalInfo } = useResumeStore()

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('resume-store')
    router.push('/')
  }

  const handleDownloadPDF = async () => {
    setLoading(true)
    try {
      const resumeElement = document.getElementById('resume-preview')
      
      // Capture the resume as canvas
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      // Convert to PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter',
      })

      const imgWidth = 8.5
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      
      // Download the PDF
      const fileName = `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAIEdit = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter your editing request')
      return
    }

    setAiLoading(true)
    
    // Simulate AI processing (replace with actual API call)
    setTimeout(() => {
      // Mock AI suggestion
      const suggestions = {
        'improve summary': `Results-driven software engineer with 5+ years of experience building scalable web applications. Proven track record of delivering high-impact features used by millions of users. Expert in React, Node.js, and cloud technologies with a focus on performance optimization and user experience.`,
        'make it more professional': `Accomplished ${personalInfo.fullName} brings extensive expertise in full-stack development, with demonstrated success in architecting and implementing enterprise-level solutions. Recognized for technical leadership and ability to drive complex projects to successful completion.`,
        'add keywords': `Software Engineer | Full-Stack Developer | React | Node.js | AWS | Python | JavaScript | TypeScript | CI/CD | Agile | Microservices | REST APIs | Database Design | Team Leadership`,
      }

      const matchedKey = Object.keys(suggestions).find(key => 
        aiPrompt.toLowerCase().includes(key)
      )

      setAiSuggestion(matchedKey ? suggestions[matchedKey] : 
        `Based on your request, here's an improved version of your summary that emphasizes quantifiable achievements and uses industry-standard keywords for better ATS compatibility.`
      )
      setAiLoading(false)
    }, 2000)
  }

  const handleApplySuggestion = () => {
    setPersonalInfo({
      ...personalInfo,
      summary: aiSuggestion,
    })
    setShowAIModal(false)
    setAiPrompt('')
    setAiSuggestion('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm">
                <FiArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAIModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
              >
                <FiZap className="h-4 w-4" />
                <span className="hidden sm:inline">AI Edit</span>
              </button>
              
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
              >
                <FiEdit3 className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Link>

              <button
                onClick={handleDownloadPDF}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <FiDownload className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {loading ? 'Generating...' : 'Download'}
                </span>
              </button>
              
              <UserAvatar user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Resume Preview</h1>
          <p className="text-gray-600">
            Review your resume and download it as PDF. You can edit details or use AI to improve your content.
          </p>
        </div>

        <ResumePreview />

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">ATS Optimization Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ Use standard section headings (Experience, Education, Skills)</li>
            <li>✓ Include relevant keywords from the job description</li>
            <li>✓ Use simple, clean formatting without tables or graphics</li>
            <li>✓ Quantify achievements with numbers and percentages</li>
            <li>✓ Use active verbs (Led, Developed, Implemented, Achieved)</li>
          </ul>
        </div>
      </main>

      {/* AI Edit Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FiZap className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">AI-Powered Editing</h2>
              </div>
              <button
                onClick={() => {
                  setShowAIModal(false)
                  setAiPrompt('')
                  setAiSuggestion('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to improve?
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Make my summary more impactful, add keywords from the job description, improve my work experience bullets..."
                />
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAIEdit}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiZap className="h-5 w-5" />
                  {aiLoading ? 'Generating...' : 'Generate AI Suggestion'}
                </button>
              </div>

              {/* Quick Suggestions */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Improve summary',
                    'Make it more professional',
                    'Add keywords',
                    'Quantify achievements',
                    'Optimize for ATS'
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setAiPrompt(suggestion)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Suggestion */}
              {aiSuggestion && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">AI Suggestion:</h3>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <p className="text-gray-800 whitespace-pre-line">{aiSuggestion}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleApplySuggestion}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FiSave className="h-5 w-5" />
                      Apply Suggestion
                    </button>
                    <button
                      onClick={() => setAiSuggestion('')}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
