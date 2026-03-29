"use client";

import useResumeStore from "@/store/resumeStore";

export default function JobDescriptionForm() {
  const { jobDescription, setJobDescription } = useResumeStore();
  const inputClassName =
    "w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Job Description
      </h2>

      <div>
        <label
          htmlFor="jobDescription"
          className="block text-sm font-medium text-muted-foreground mb-2"
        >
          Paste the job description you&apos;re applying for *
        </label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows="12"
          className={inputClassName}
          placeholder="Paste the complete job description here. The AI will analyze it to optimize your resume for ATS compatibility and relevance..."
          minLength={50}
          maxLength={5000}
          required
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Pro tip: Include the full job description including requirements,
          responsibilities, and preferred qualifications for best results.
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-secondary/20 p-4">
        <h3 className="mb-2 font-semibold text-foreground">
          Why provide a job description?
        </h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Helps tailor your resume to match the specific role</li>
          <li>Improves ATS (Applicant Tracking System) compatibility</li>
          <li>Highlights relevant skills and experience</li>
          <li>Uses keywords from the job posting</li>
        </ul>
      </div>
    </div>
  );
}
