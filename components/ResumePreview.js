'use client'

import { useEffect, useRef } from 'react'
import useResumeStore from '@/store/resumeStore'

export default function ResumePreview() {
  const resumeRef = useRef(null)
  const { personalInfo, education, workExperience, skills, projects, certifications, jobDescription } = useResumeStore()

  return (
    <div 
      ref={resumeRef}
      id="resume-preview"
      className="bg-white max-w-[8.5in] mx-auto p-12 shadow-lg"
      style={{ minHeight: '11in' }}
    >
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-4 mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700 mt-1">
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          )}
          {personalInfo.github && personalInfo.linkedin && <span>•</span>}
          {personalInfo.github && (
            <a href={personalInfo.github} className="text-blue-600 hover:underline">
              GitHub
            </a>
          )}
          {personalInfo.portfolio && (personalInfo.linkedin || personalInfo.github) && <span>•</span>}
          {personalInfo.portfolio && (
            <a href={personalInfo.portfolio} className="text-blue-600 hover:underline">
              Portfolio
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-400">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-800 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Skills */}
      {(skills.technical.length > 0 || skills.soft.length > 0) && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-400">
            Skills
          </h2>
          {skills.technical.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold text-sm text-gray-900">Technical: </span>
              <span className="text-sm text-gray-800">
                {skills.technical.join(', ')}
              </span>
            </div>
          )}
          {skills.soft.length > 0 && (
            <div>
              <span className="font-semibold text-sm text-gray-900">Soft Skills: </span>
              <span className="text-sm text-gray-800">
                {skills.soft.join(', ')}
              </span>
            </div>
          )}
        </section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-400">
            Professional Experience
          </h2>
          {workExperience.map((exp, index) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-700">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <p className="text-sm text-gray-800 italic">{exp.company}</p>
                <span className="text-sm text-gray-700">{exp.location}</span>
              </div>
              {exp.achievements && (
                <div className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                  {exp.achievements.split('\n').map((line, i) => line.trim() && (
                    <div key={i} className="mb-1">{line}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-400">
            Education
          </h2>
          {education.map((edu, index) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm text-gray-900">
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-sm text-gray-700">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <p className="text-sm text-gray-800 italic">{edu.institution}</p>
                <span className="text-sm text-gray-700">{edu.location}</span>
              </div>
              {edu.gpa && (
                <p className="text-sm text-gray-800">GPA: {edu.gpa}</p>
              )}
              {edu.achievements && (
                <p className="text-sm text-gray-800 mt-1">{edu.achievements}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-400">
            Projects
          </h2>
          {projects.map((project, index) => (
            <div key={project.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm text-gray-900">{project.name}</h3>
                {project.link && (
                  <span className="text-sm text-blue-600">{project.link}</span>
                )}
              </div>
              {project.technologies && (
                <p className="text-sm text-gray-700 italic">{project.technologies}</p>
              )}
              <p className="text-sm text-gray-800 mt-1">{project.description}</p>
              {project.highlights && (
                <div className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                  {project.highlights.split('\n').map((line, i) => line.trim() && (
                    <div key={i} className="mb-1">{line}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-400">
            Certifications
          </h2>
          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-sm text-gray-900">{cert.name}</span>
                  <span className="text-sm text-gray-700"> - {cert.issuer}</span>
                </div>
                <span className="text-sm text-gray-700">
                  {cert.date}
                  {cert.credentialId && ` | ID: ${cert.credentialId}`}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
