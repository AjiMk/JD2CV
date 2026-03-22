'use client'

import { useRef } from 'react'
import useResumeStore from '@/store/resumeStore'

export default function ResumePreview() {
  const resumeRef = useRef(null)
  const { personalInfo, education, workExperience, skills, projects } = useResumeStore()

  const fullName = personalInfo.fullName || 'CHIPPY SEBASTIAN'
  const phone = personalInfo.phone || '+44 7901 525358'
  const location = personalInfo.location || 'Edinburgh, UK'
  const email = personalInfo.email || 'chippysabu511@gmail.com'

  const technicalSkillGroups = [
    { label: 'IT Support', items: ['Incident handling', 'troubleshooting', 'first-line support concepts', 'issue prioritisation'] },
    { label: 'Technologies', items: skills.technical.length > 0 ? skills.technical : ['JavaScript', 'React', 'HTML', 'CSS', 'REST APIs'] },
    { label: 'Systems Knowledge', items: ['Application workflows', 'API integrations', 'debugging and error handling'] },
    { label: 'Tools', items: ['Git', 'VS Code', 'basic CI/CD awareness'] },
    { label: 'Data & Analysis', items: ['Python (basic)', 'data interpretation', 'problem-solving'] },
    { label: 'Practices', items: ['Agile', 'documentation', 'process improvement', 'SLA awareness'] },
  ]

  const defaultExperience = [
    {
      position: 'UI Developer',
      company: 'Phases India Technology Solutions Pvt Ltd',
      startDate: '2021',
      endDate: '2023',
      current: false,
      achievements: [
        'Supported the development and maintenance of web applications, identifying and resolving technical issues to ensure smooth functionality',
        'Investigated and debugged application issues related to API integration and frontend behaviour, improving system reliability',
        'Collaborated with backend teams and QA to diagnose issues and deliver timely resolutions',
        'Contributed to maintaining documentation and improving development processes for better efficiency',
        'Worked in Agile environments, responding to changing requirements and resolving defects within sprint cycles',
      ].join('\n'),
    },
    {
      position: 'Supervisor',
      company: 'Holiday Inn, UK',
      startDate: '2025',
      endDate: 'Present',
      current: true,
      achievements: [
        'Managed day-to-day operations and handled customer issues, ensuring timely resolution in a fast-paced environment',
        'Acted as a first point of contact for problem resolution, demonstrating strong troubleshooting and decision-making skills',
        'Coordinated with multiple teams to resolve operational issues and maintain service quality',
        'Maintained clear communication with stakeholders and ensured adherence to processes and service standards',
      ].join('\n'),
    },
  ]

  const defaultProjects = [
    {
      name: 'Simple Blog System',
      description: 'Developed a full-stack application using PHP and PostgreSQL, handling authentication and data management',
      highlights: 'Identified and resolved system bugs, improving stability and user experience',
    },
    {
      name: 'Energy Consumption Prediction – MSc Dissertation',
      description: 'Built predictive models using Python, analysing data and identifying patterns to improve decision-making',
      highlights: 'Strengthened analytical and problem-solving skills through data-driven approaches',
    },
  ]

  const defaultEducation = [
    {
      degree: 'MSc Computing',
      institution: 'Edinburgh Napier University',
      endDate: '2025',
      achievements: 'Relevant Areas: Software Engineering, Machine Learning, Distributed Systems',
    },
    {
      degree: 'BSc Information Technology',
      institution: 'Sienna College of Professional Studies',
      endDate: '2020',
      achievements: '',
    },
  ]

  const additionalStrengths = [
    'Strong communication and customer service skills',
    'Ability to troubleshoot and resolve issues efficiently under pressure',
    'Detail-oriented with a focus on process and documentation',
    'Eager to learn and adapt to new technologies and support environments',
  ]

  const contactLine = `${phone}   ${location}`
  const emailLine = `${email}   LinkedIn`

  return (
    <div
      ref={resumeRef}
      id="resume-preview"
      className="bg-white max-w-[8.5in] mx-auto p-10 shadow-lg text-[13px] leading-[1.35]"
      style={{ minHeight: '11in' }}
    >
      <header className="pb-3 mb-4 text-center border-b border-gray-300">
        <h1 className="text-2xl font-bold text-gray-900 tracking-wide">{fullName}</h1>
        <div className="mt-2 space-y-1 text-[13px] text-gray-700">
          <div>{contactLine}</div>
          <div>{emailLine}</div>
        </div>
      </header>

      <Section title="PROFESSIONAL SUMMARY">
        <p className="text-[13px] text-gray-800">
          {personalInfo.summary ||
            'Technology-focused professional with experience in application development and strong problem-solving abilities, seeking to transition into a Service Desk Analyst role. Skilled in troubleshooting, supporting users, and ensuring smooth system operations.'}
        </p>
      </Section>

      <Section title="TECHNICAL SKILLS">
        <div className="space-y-1.5 text-[13px] text-gray-800">
          {technicalSkillGroups.map((group) => (
            <div key={group.label} className="flex gap-2">
              <span className="min-w-32 font-semibold text-gray-900">{group.label}:</span>
              <span>{group.items.join(', ')}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="PROFESSIONAL EXPERIENCE">
        <div className="space-y-3">
          {(workExperience.length > 0 ? workExperience : defaultExperience).map((exp) => (
            <div key={`${exp.company}-${exp.position}`} className="text-[13px] text-gray-800">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <span className="font-semibold text-gray-900">{exp.position}</span>{' '}
                  <span>{exp.company}</span>
                </div>
                <span className="whitespace-nowrap text-gray-700">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.achievements && (
                <ul className="mt-1.5 list-disc space-y-1 pl-5">
                  {exp.achievements.split('\n').map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="PROJECTS">
        <div className="space-y-3">
          {(projects.length > 0 ? projects : defaultProjects).map((project) => (
            <div key={project.name} className="text-[13px] text-gray-800">
              <div className="font-semibold text-gray-900">{project.name}</div>
              <div>{project.description}</div>
              {project.highlights && (
                <ul className="mt-1.5 list-disc space-y-1 pl-5">
                  {project.highlights.split('\n').map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="EDUCATION">
        <div className="space-y-3 text-[13px] text-gray-800">
          {(education.length > 0 ? education : defaultEducation).map((edu) => (
            <div key={`${edu.institution}-${edu.degree}`}>
              <div className="flex items-baseline justify-between gap-4">
                <div className="font-semibold text-gray-900">
                  {edu.degree} {edu.field ? `in ${edu.field}` : ''} {edu.institution}
                </div>
                <span className="whitespace-nowrap text-gray-700">{edu.endDate || edu.startDate}</span>
              </div>
              {edu.achievements && <div className="mt-1">{edu.achievements}</div>}
            </div>
          ))}
        </div>
      </Section>

      <Section title="ADDITIONAL STRENGTHS">
        <ul className="list-disc space-y-1.5 pl-5 text-[13px] text-gray-800">
          {additionalStrengths.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mb-4">
      <h2 className="mb-2 border-b border-gray-400 pb-1 text-[13px] font-bold uppercase tracking-wide text-gray-900">
        {title}
      </h2>
      {children}
    </section>
  )
}
