'use client'

import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "What is an ATS-friendly resume?",
      answer: "An ATS (Applicant Tracking System) friendly resume is formatted in a way that automated systems can easily read and parse your information. This includes using standard fonts, clear section headings, and avoiding images or complex formatting."
    },
    {
      question: "How does the job description optimization work?",
      answer: "When you provide a job description, our system analyzes the keywords and requirements, then helps you tailor your resume to match those specific needs. This increases your chances of passing ATS screening and getting noticed by recruiters."
    },
    {
      question: "Can I create multiple resumes?",
      answer: "Yes! You can create and save multiple versions of your resume, each tailored to different job applications. This allows you to customize your resume for each position you apply to."
    },
    {
      question: "What is the FAANG-path format?",
      answer: "The FAANG-path format is a clean, professional resume style commonly used by candidates applying to top tech companies like Facebook, Amazon, Apple, Netflix, and Google. It emphasizes quantifiable achievements and uses a clear, easy-to-scan layout."
    },
    {
      question: "How does the AI editing feature work?",
      answer: "Our AI analyzes your resume content and provides intelligent suggestions to improve your professional summary, highlight achievements, add relevant keywords, and optimize your content for ATS systems."
    },
    {
      question: "Can I download my resume as PDF?",
      answer: "Yes! You can download your resume as a high-quality PDF file that's ready to submit with your job applications. The PDF maintains the professional formatting and is optimized for both digital and print use."
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 pr-4">
                {faq.question}
              </span>
              {openIndex === index ? (
                <FiChevronUp className="h-5 w-5 text-primary-600 flex-shrink-0" />
              ) : (
                <FiChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-4 pb-4">
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
