'use client'

import { useState } from 'react'
import useResumeStore from '@/store/resumeStore'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

export default function CertificationsForm() {
  const { certifications, addCertification, removeCertification } = useResumeStore()
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    date: '',
    credentialId: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (formData.name && formData.issuer) {
      addCertification({
        ...formData,
        id: Date.now(),
      })
      setFormData({
        name: '',
        issuer: '',
        date: '',
        credentialId: '',
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h2>

      {/* Certifications List */}
      {certifications.length > 0 && (
        <div className="space-y-3 mb-6">
          {certifications.map((cert, index) => (
            <div 
              key={cert.id} 
              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-gray-700">{cert.issuer}</p>
                <div className="flex gap-4 text-sm text-gray-600 mt-1">
                  {cert.date && <span>{cert.date}</span>}
                  {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                </div>
              </div>
              <button
                onClick={() => removeCertification(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <FiTrash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Form */}
      <form onSubmit={handleAdd} className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Add Certification</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certification Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="AWS Certified Solutions Architect"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issuing Organization *
            </label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Amazon Web Services"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Date
            </label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Jan 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credential ID
            </label>
            <input
              type="text"
              name="credentialId"
              value={formData.credentialId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="ABC123XYZ"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <FiPlus className="h-5 w-5" />
          Add Certification
        </button>
      </form>
    </div>
  )
}
