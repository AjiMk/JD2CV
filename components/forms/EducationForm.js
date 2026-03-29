"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useResumeStore from "@/store/resumeStore";
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";

const degreeOptions = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "MBA",
  "PhD",
  "Diploma",
  "Certificate",
  "Professional Certification",
  "Other",
];

const fieldOptions = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
  "Data Science",
  "Artificial Intelligence",
  "Business Administration",
  "Finance",
  "Marketing",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Biotechnology",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Other",
];

export default function EducationForm() {
  const { education, addEducation, updateEducation, removeEducation } =
    useResumeStore();
  const [editing, setEditing] = useState(null);
  const [syncState, setSyncState] = useState("");
  const [syncError, setSyncError] = useState("");
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    customDegree: "",
    field: "",
    customField: "",
    startDate: "",
    endDate: "",
    gpa: "",
    location: "",
    achievements: "",
  });

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    try {
      const response = await fetch("/api/education", { cache: "no-store" });
      if (!response.ok) return;

      const data = await response.json();
      if (Array.isArray(data.education)) {
        const mappedEducation = data.education.map((entry) => ({
          ...entry,
          id: entry.id,
        }));
        useResumeStore.setState({ education: mappedEducation });
      }
    } catch {
      // Keep local state if fetch fails.
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === "degree" && value !== "Other" ? { customDegree: "" } : {}),
      ...(name === "field" && value !== "Other" ? { customField: "" } : {}),
    });
  };

  const inputClassName =
    "w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  const syncEducation = async (nextEducation) => {
    const response = await fetch("/api/education", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ education: nextEducation }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Unable to save education");
    }
  };

  const handleAdd = async () => {
    const degreeValue =
      formData.degree === "Other"
        ? formData.customDegree.trim()
        : formData.degree;
    const fieldValue =
      formData.field === "Other" ? formData.customField.trim() : formData.field;

    if (formData.institution && degreeValue && fieldValue) {
      setSyncState("Saving education...");
      setSyncError("");
      const nextEducation = [
        ...education,
        {
          ...formData,
          degree: degreeValue,
          field: fieldValue,
          id: Date.now(),
        },
      ];
      addEducation({
        ...formData,
        degree: degreeValue,
        field: fieldValue,
        id: Date.now(),
      });
      await syncEducation(nextEducation);
      await loadEducation();
      resetForm();
      setSyncState("Education saved.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editing !== null) {
        await handleUpdate(editing);
        return;
      }

      await handleAdd();
    } catch (error) {
      setSyncState("");
      setSyncError(error.message || "Unable to save education");
    }
  };

  const handleUpdate = async (index) => {
    setSyncState("Saving education...");
    setSyncError("");
    const degreeValue =
      formData.degree === "Other"
        ? formData.customDegree.trim()
        : formData.degree;
    const fieldValue =
      formData.field === "Other" ? formData.customField.trim() : formData.field;
    const nextEducation = education.map((item, i) =>
      i === index
        ? {
            ...formData,
            degree: degreeValue,
            field: fieldValue,
            id: item.id,
          }
        : item,
    );
    updateEducation(index, {
      ...formData,
      degree: degreeValue,
      field: fieldValue,
    });
    await syncEducation(nextEducation);
    await loadEducation();
    setEditing(null);
    resetForm();
    setSyncState("Education saved.");
  };

  const handleEdit = (index, edu) => {
    setEditing(index);
    setFormData({
      ...edu,
      customDegree: degreeOptions.includes(edu.degree) ? "" : edu.degree,
      customField: fieldOptions.includes(edu.field) ? "" : edu.field,
      degree: degreeOptions.includes(edu.degree) ? edu.degree : "Other",
      field: fieldOptions.includes(edu.field) ? edu.field : "Other",
    });
  };

  const handleCancel = () => {
    setEditing(null);
    resetForm();
  };

  const handleRemove = async (index) => {
    const nextEducation = education.filter((_, i) => i !== index);
    setSyncState("Saving education...");
    setSyncError("");
    removeEducation(index);
    await syncEducation(nextEducation);
    await loadEducation();
    setSyncState("Education saved.");
  };

  const resetForm = () => {
    setFormData({
      institution: "",
      degree: "",
      customDegree: "",
      field: "",
      customField: "",
      startDate: "",
      endDate: "",
      gpa: "",
      location: "",
      achievements: "",
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-6">Education</h2>

      {/* Education List */}
      {education.length > 0 && (
        <div className="space-y-4 mb-6">
          {education.map((edu, index) => (
            <div key={edu.id} className="rounded-lg border border-border p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-muted-foreground">{edu.institution}</p>
                  <p className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate} | {edu.location}
                    {edu.gpa && ` | GPA: ${edu.gpa}`}
                  </p>
                  {edu.achievements && (
                    <p className="text-sm text-gray-600 mt-2">
                      {edu.achievements}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    type="button"
                    onClick={() => handleEdit(index, edu)}
                    className="rounded-lg p-2 text-foreground hover:bg-secondary/80"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border-2 border-dashed border-input bg-background p-6"
      >
        <h3 className="font-semibold text-foreground mb-4">
          {editing !== null ? "Edit Education" : "Add Education"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Institution *
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className={inputClassName}
              placeholder="University Name"
              minLength={2}
              maxLength={120}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Degree *
            </label>
            <Select
              value={formData.degree}
              onValueChange={(value) =>
                handleChange({ target: { name: "degree", value } })
              }
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Select degree" />
              </SelectTrigger>
              <SelectContent>
                {degreeOptions.map((degree) => (
                  <SelectItem key={degree} value={degree}>
                    {degree}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.degree === "Other" && (
              <input
                type="text"
                name="customDegree"
                value={formData.customDegree}
                onChange={handleChange}
                className={`${inputClassName} mt-3`}
                placeholder="Enter degree"
                maxLength={120}
                required
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Field of Study *
            </label>
            <Select
              value={formData.field}
              onValueChange={(value) =>
                handleChange({ target: { name: "field", value } })
              }
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {fieldOptions.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.field === "Other" && (
              <input
                type="text"
                name="customField"
                value={formData.customField}
                onChange={handleChange}
                className={`${inputClassName} mt-3`}
                placeholder="Enter field of study"
                maxLength={120}
                required
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              GPA
            </label>
            <input
              type="text"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              className={inputClassName}
              placeholder="3.8/4.0"
              inputMode="decimal"
              maxLength={10}
              pattern="^[0-9](\.[0-9]{1,2})?(/[0-9](\.[0-9]{1,2})?)?$"
              title="Enter GPA like 3.8 or 3.8/4.0."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Achievements / Relevant Coursework
            </label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              rows="3"
              className={inputClassName}
              placeholder="Dean's List, Honors, relevant coursework, etc."
              maxLength={500}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          {editing !== null ? (
            <>
              <Button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
              >
                <FiCheck className="h-5 w-5" />
                Update
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
              >
                <FiX className="h-5 w-5" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                <FiCheck className="h-5 w-5" />
                Save
              </Button>
              <Button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 border border-input text-muted-foreground rounded-lg hover:bg-secondary/80"
              >
                <FiPlus className="h-5 w-5" />
                Add Education
              </Button>
            </>
          )}
        </div>

        {(syncState || syncError) && (
          <p
            className={`mt-4 text-sm ${syncError ? "text-red-600" : "text-green-600"}`}
          >
            {syncError || syncState}
          </p>
        )}
      </form>
    </div>
  );
}
