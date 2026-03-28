"use client";

import { useState } from "react";
import useResumeStore from "@/store/resumeStore";
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";

export default function WorkExperienceForm() {
  const {
    workExperience,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
  } = useResumeStore();
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    achievements: "",
  });

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleAdd = () => {
    if (formData.company && formData.position) {
      addWorkExperience({
        ...formData,
        id: Date.now(),
      });
      resetForm();
    }
  };

  const handleUpdate = (index) => {
    updateWorkExperience(index, formData);
    setEditing(null);
    resetForm();
  };

  const handleEdit = (index, exp) => {
    setEditing(index);
    setFormData(exp);
  };

  const handleCancel = () => {
    setEditing(null);
    resetForm();
  };

  const inputClassName =
    "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500";

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      achievements: "",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h2>

      {/* Experience List */}
      {workExperience.length > 0 && (
        <div className="space-y-4 mb-6">
          {workExperience.map((exp, index) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {exp.position}
                  </h3>
                  <p className="text-gray-700">{exp.company}</p>
                  <p className="text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate} |{" "}
                    {exp.location}
                  </p>
                  {exp.achievements && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {exp.achievements}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(index, exp)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => removeWorkExperience(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          {editing !== null ? "Edit Experience" : "Add Work Experience"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Company Name"
              minLength={2}
              maxLength={120}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position / Title *
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Software Engineer"
              minLength={2}
              maxLength={120}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClassName}
              placeholder="City, State"
              maxLength={80}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="text"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Jan 2022"
              maxLength={30}
              pattern="^[A-Za-z0-9\s,./-]+$"
              title="Use a short date format such as Jan 2022."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="current"
              name="current"
              checked={formData.current}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="current"
              className="text-sm font-medium text-gray-700"
            >
              I currently work here
            </label>
          </div>

          {!formData.current && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="text"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Dec 2023"
                maxLength={30}
                pattern="^[A-Za-z0-9\s,./-]+$"
                title="Use a short date format such as Dec 2023."
              />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Achievements & Responsibilities *
            </label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="• Led development of feature X resulting in 30% efficiency improvement&#10;• Collaborated with cross-functional teams of 10+ members&#10;• Implemented CI/CD pipeline reducing deployment time by 50%"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use bullet points (•) to list your achievements. Focus on
              quantifiable results and impact.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          {editing !== null ? (
            <>
              <button
                onClick={() => handleUpdate(editing)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FiCheck className="h-5 w-5" />
                Update
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <FiX className="h-5 w-5" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="h-5 w-5" />
              Add Experience
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
