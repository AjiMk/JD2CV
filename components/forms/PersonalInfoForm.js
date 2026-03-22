'use client'

import { useState } from 'react'
import useResumeStore from '@/store/resumeStore'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

export default function PersonalInfoForm() {
  const { personalInfo, setPersonalInfo } = useResumeStore()

  const handleChange = (e) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={personalInfo.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={personalInfo.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={personalInfo.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={personalInfo.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="New York, NY"
            required
          />
        </div>

        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={personalInfo.linkedin}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Profile
          </label>
          <input
            type="url"
            id="github"
            name="github"
            value={personalInfo.github}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="https://github.com/johndoe"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-2">
            Portfolio Website
          </label>
          <input
            type="url"
            id="portfolio"
            name="portfolio"
            value={personalInfo.portfolio}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="https://johndoe.com"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
            Professional Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={personalInfo.summary}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Brief professional summary highlighting your key achievements and goals..."
          />
        </div>
      </div>
    </div>
  )
}
