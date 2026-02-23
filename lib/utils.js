// Format date for resume display
export const formatDate = (dateString) => {
  if (!dateString) return ''
  
  // If already formatted (e.g., "Jan 2020"), return as is
  if (/^[A-Za-z]{3}\s\d{4}$/.test(dateString)) {
    return dateString
  }
  
  // If it's a date object or ISO string, format it
  const date = new Date(dateString)
  if (!isNaN(date.getTime())) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }
  
  return dateString
}

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (basic)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

// Validate URL
export const isValidUrl = (url) => {
  if (!url) return true // Optional field
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Calculate completeness percentage
export const calculateCompleteness = (resumeData) => {
  const checks = [
    resumeData.personalInfo?.fullName,
    resumeData.personalInfo?.email,
    resumeData.personalInfo?.phone,
    resumeData.education?.length > 0,
    resumeData.workExperience?.length > 0,
    resumeData.skills?.technical?.length > 0,
    resumeData.personalInfo?.summary,
  ]
  
  const completed = checks.filter(Boolean).length
  return Math.round((completed / checks.length) * 100)
}

// Extract keywords from job description
export const extractKeywords = (jobDescription) => {
  if (!jobDescription) return []
  
  // Common technical keywords to look for
  const techKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue',
    'typescript', 'aws', 'azure', 'docker', 'kubernetes', 'git', 'sql',
    'mongodb', 'postgresql', 'api', 'rest', 'graphql', 'agile', 'scrum',
    'ci/cd', 'devops', 'machine learning', 'ai', 'data science'
  ]
  
  const text = jobDescription.toLowerCase()
  return techKeywords.filter(keyword => text.includes(keyword))
}

// Format bullet points
export const formatBulletPoints = (text) => {
  if (!text) return []
  
  return text
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      // Ensure each line starts with a bullet point
      const trimmed = line.trim()
      if (!trimmed.startsWith('•') && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
        return `• ${trimmed}`
      }
      return trimmed.replace(/^[-*]\s*/, '• ')
    })
}

// Generate filename for resume
export const generateResumeFilename = (name, company = '') => {
  const cleanName = name.replace(/\s+/g, '_')
  const cleanCompany = company.replace(/\s+/g, '_')
  const date = new Date().toISOString().split('T')[0]
  
  if (cleanCompany) {
    return `${cleanName}_Resume_${cleanCompany}_${date}.pdf`
  }
  return `${cleanName}_Resume_${date}.pdf`
}

// Truncate text to specific length
export const truncate = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}
