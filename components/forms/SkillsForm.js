"use client";

import { useState } from "react";
import useResumeStore from "@/store/resumeStore";
import { FiPlus, FiX } from "react-icons/fi";

export default function SkillsForm() {
  const { skills, addSkill, removeSkill } = useResumeStore();
  const [technicalSkill, setTechnicalSkill] = useState("");
  const [softSkill, setSoftSkill] = useState("");
  const inputClassName =
    "flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500";

  const handleAddTechnical = (e) => {
    e.preventDefault();
    if (technicalSkill.trim()) {
      addSkill("technical", technicalSkill.trim());
      setTechnicalSkill("");
    }
  };

  const handleAddSoft = (e) => {
    e.preventDefault();
    if (softSkill.trim()) {
      addSkill("soft", softSkill.trim());
      setSoftSkill("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technical Skills */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Technical Skills</h3>

          {/* Display Technical Skills */}
          <div className="flex flex-wrap gap-2 mb-4 min-h-[60px] p-3 border border-gray-200 rounded-lg">
            {skills.technical.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No technical skills added yet
              </p>
            ) : (
              skills.technical.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill("technical", index)}
                    className="hover:text-blue-900"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add Technical Skill */}
          <form onSubmit={handleAddTechnical} className="flex gap-2">
            <input
              type="text"
              value={technicalSkill}
              onChange={(e) => setTechnicalSkill(e.target.value)}
              className={inputClassName}
              placeholder="e.g., JavaScript, Python, React"
              minLength={2}
              maxLength={60}
              pattern="^[A-Za-z0-9][A-Za-z0-9\s.+#/ -]*$"
              title="Use a short skill name with letters, numbers, and common symbols only."
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="h-5 w-5" />
              Add
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-2">
            Add programming languages, frameworks, tools, and technologies
          </p>
        </div>

        {/* Soft Skills */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Soft Skills</h3>

          {/* Display Soft Skills */}
          <div className="flex flex-wrap gap-2 mb-4 min-h-[60px] p-3 border border-gray-200 rounded-lg">
            {skills.soft.length === 0 ? (
              <p className="text-gray-400 text-sm">No soft skills added yet</p>
            ) : (
              skills.soft.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill("soft", index)}
                    className="hover:text-green-900"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add Soft Skill */}
          <form onSubmit={handleAddSoft} className="flex gap-2">
            <input
              type="text"
              value={softSkill}
              onChange={(e) => setSoftSkill(e.target.value)}
              className={inputClassName}
              placeholder="e.g., Leadership, Communication"
              minLength={2}
              maxLength={60}
              pattern="^[A-Za-z][A-Za-z\s&-]*$"
              title="Use letters, spaces, ampersands, and hyphens only."
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="h-5 w-5" />
              Add
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-2">
            Add interpersonal and professional skills
          </p>
        </div>
      </div>

      {/* Suggested Skills */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">
          Suggested Technical Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "JavaScript",
            "Python",
            "Java",
            "React",
            "Node.js",
            "TypeScript",
            "AWS",
            "Docker",
            "Git",
            "SQL",
            "MongoDB",
            "REST APIs",
            "GraphQL",
            "Next.js",
            "TailwindCSS",
            "CI/CD",
            "Agile",
            "Kubernetes",
          ].map((skill) => (
            <button
              key={skill}
              onClick={() => {
                if (!skills.technical.includes(skill)) {
                  addSkill("technical", skill);
                }
              }}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              + {skill}
            </button>
          ))}
        </div>

        <h3 className="font-semibold text-gray-900 mb-3 mt-4">
          Suggested Soft Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Leadership",
            "Communication",
            "Team Collaboration",
            "Problem Solving",
            "Critical Thinking",
            "Time Management",
            "Adaptability",
            "Creativity",
            "Project Management",
            "Mentoring",
          ].map((skill) => (
            <button
              key={skill}
              onClick={() => {
                if (!skills.soft.includes(skill)) {
                  addSkill("soft", skill);
                }
              }}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
