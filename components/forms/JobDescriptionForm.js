"use client";

import useResumeStore from "@/store/resumeStore";

export default function JobDescriptionForm() {
  const { jobDescription, setJobDescription } = useResumeStore();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>

      <div>
        <label
          htmlFor="jobDescription"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Paste the job description you&apos;re applying for *
        </label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows="12"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Paste the complete job description here. The AI will analyze it to optimize your resume for ATS compatibility and relevance..."
        />
        <p className="text-sm text-gray-600 mt-2">
          Pro tip: Include the full job description including requirements,
          responsibilities, and preferred qualifications for best results.
        </p>
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Why provide a job description?
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Helps tailor your resume to match the specific role</li>
          <li>Improves ATS (Applicant Tracking System) compatibility</li>
          <li>Highlights relevant skills and experience</li>
          <li>Uses keywords from the job posting</li>
        </ul>
      </div>
    </div>
  );
}
