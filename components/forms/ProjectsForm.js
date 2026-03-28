"use client";

import { useState } from "react";
import useResumeStore from "@/store/resumeStore";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiX,
  FiExternalLink,
} from "react-icons/fi";

export default function ProjectsForm() {
  const { projects, addProject, updateProject, removeProject } =
    useResumeStore();
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: "",
    link: "",
    highlights: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = () => {
    if (formData.name && formData.description) {
      addProject({
        ...formData,
        id: Date.now(),
      });
      resetForm();
    }
  };

  const handleUpdate = (index) => {
    updateProject(index, formData);
    setEditing(null);
    resetForm();
  };

  const handleEdit = (index, project) => {
    setEditing(index);
    setFormData(project);
  };

  const handleCancel = () => {
    setEditing(null);
    resetForm();
  };

  const inputClassName =
    "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500";

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      technologies: "",
      link: "",
      highlights: "",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>

      {/* Projects List */}
      {projects.length > 0 && (
        <div className="space-y-4 mb-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <FiExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-gray-700 mt-1">{project.description}</p>
                  {project.technologies && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Technologies:</span>{" "}
                      {project.technologies}
                    </p>
                  )}
                  {project.highlights && (
                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                      {project.highlights}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(index, project)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => removeProject(index)}
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
          {editing !== null ? "Edit Project" : "Add Project"}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClassName}
              placeholder="E-commerce Platform"
              minLength={2}
              maxLength={120}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className={inputClassName}
              placeholder="A full-stack e-commerce application with payment integration..."
              minLength={10}
              maxLength={500}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technologies Used
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              className={inputClassName}
              placeholder="React, Node.js, MongoDB, AWS"
              maxLength={120}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Link (GitHub/Live Demo)
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className={inputClassName}
              placeholder="https://github.com/username/project"
              maxLength={200}
              pattern="^https?:\/\/.*$"
              title="Enter a valid project URL."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Highlights & Achievements
            </label>
            <textarea
              name="highlights"
              value={formData.highlights}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="• Implemented secure payment processing with Stripe&#10;• Achieved 99.9% uptime with AWS infrastructure&#10;• Reduced page load time by 40% through optimization"
            />
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
              Add Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
