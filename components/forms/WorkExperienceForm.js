"use client";

import { useEffect, useState } from "react";
import useResumeStore from "@/store/resumeStore";
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";

const positionOptions = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Data Engineer",
  "Data Analyst",
  "Data Scientist",
  "QA Engineer",
  "QA Analyst",
  "Systems Administrator",
  "Network Engineer",
  "Database Administrator",
  "UI/UX Designer",
  "Product Manager",
  "Project Manager",
  "IT Support Specialist",
  "Technical Support Engineer",
  "Cybersecurity Analyst",
  "Solutions Architect",
  "Technical Lead",
  "Engineering Manager",
  "Other",
];

export default function WorkExperienceForm() {
  const {
    workExperience,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
  } = useResumeStore();
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState("");
  const [saveState, setSaveState] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    customPosition: "",
    countryId: "",
    stateId: "",
    pincode: "",
    startDate: "",
    endDate: "",
    current: false,
    achievements: "",
  });

  const inputClassName =
    "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500";

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await fetch("/api/countries");
        if (!response.ok) return;
        const data = await response.json();
        setCountries(data.countries || []);
      } catch {
        setCountries([]);
      }
    };

    loadCountries();
  }, []);

  const loadWorkExperience = async () => {
    try {
      const response = await fetch("/api/work-experience", {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data.workExperience)) {
        useResumeStore.setState({ workExperience: data.workExperience });
      }
    } catch {
      // Keep local state if fetch fails.
    }
  };

  useEffect(() => {
    const loadStates = async () => {
      if (!formData.countryId) {
        setStates([]);
        return;
      }

      try {
        const response = await fetch(
          `/api/states?countryId=${formData.countryId}`,
        );
        if (!response.ok) return;
        const data = await response.json();
        setStates(data.states || []);
      } catch {
        setStates([]);
      }
    };

    loadStates();
  }, [formData.countryId]);

  useEffect(() => {
    loadWorkExperience();
  }, []);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const next = {
      ...formData,
      [e.target.name]: value,
    };

    if (e.target.name === "position" && value !== "Other") {
      next.customPosition = "";
    }

    if (e.target.name === "countryId") {
      next.stateId = "";
      next.pincode = "";
    }

    setFormData(next);
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      customPosition: "",
      countryId: "",
      stateId: "",
      pincode: "",
      startDate: "",
      endDate: "",
      current: false,
      achievements: "",
    });
  };

  const validateForm = () => {
    const errors = [];
    const selectedCountry = countries.find(
      (country) => country.id === formData.countryId,
    );

    if (!formData.company.trim()) {
      errors.push("Company is required.");
    } else if (formData.company.trim().length < 2) {
      errors.push("Company must be at least 2 characters.");
    }

    if (!formData.position.trim()) {
      errors.push("Position / title is required.");
    }

    if (formData.position === "Other" && !formData.customPosition.trim()) {
      errors.push("Custom position is required when you select Other.");
    }

    if (!formData.countryId) {
      errors.push("Country is required.");
    }

    if (!formData.stateId) {
      errors.push("State / province is required.");
    }

    if (selectedCountry?.code === "IN" && !formData.pincode.trim()) {
      errors.push("Pincode is required for India.");
    }

    if (!formData.startDate.trim()) {
      errors.push("Start date is required.");
    }

    if (!formData.current && !formData.endDate.trim()) {
      errors.push(
        "End date is required when you are not currently working here.",
      );
    }

    if (!formData.achievements.trim()) {
      errors.push("Achievements and responsibilities are required.");
    } else if (formData.achievements.trim().length < 10) {
      errors.push(
        "Add a few more details for achievements and responsibilities.",
      );
    }

    return errors;
  };

  const normalizePosition = () =>
    formData.position === "Other"
      ? formData.customPosition.trim()
      : formData.position;

  const handleAdd = () => {
    const nextItem = {
      ...formData,
      position: normalizePosition(),
      id: Date.now(),
    };
    const nextWorkExperience = [...workExperience, nextItem];
    addWorkExperience(nextItem);
    syncWorkExperience(nextWorkExperience)
      .then(() => loadWorkExperience())
      .then(() => {
        setSaveState("Experience saved.");
        resetForm();
      })
      .catch((error) => {
        setFormError(error.message || "Unable to save experience");
      });
  };

  const handleUpdate = (index) => {
    const nextItem = {
      ...formData,
      position: normalizePosition(),
      id: workExperience[index]?.id || Date.now(),
    };
    const nextWorkExperience = workExperience.map((item, i) =>
      i === index ? nextItem : item,
    );
    updateWorkExperience(index, nextItem);
    syncWorkExperience(nextWorkExperience)
      .then(() => loadWorkExperience())
      .then(() => {
        setEditing(null);
        setSaveState("Experience saved.");
        resetForm();
      })
      .catch((error) => {
        setFormError(error.message || "Unable to save experience");
      });
  };

  const handleEdit = (index, exp) => {
    setEditing(index);
    setFormData({
      ...exp,
      position: positionOptions.includes(exp.position) ? exp.position : "Other",
      customPosition: positionOptions.includes(exp.position)
        ? ""
        : exp.position,
    });
    setFormError("");
    setSaveState("");
  };

  const handleCancel = () => {
    setEditing(null);
    resetForm();
    setFormError("");
    setSaveState("");
  };

  const handleRemove = (index) => {
    const nextWorkExperience = workExperience.filter((_, i) => i !== index);
    removeWorkExperience(index);
    syncWorkExperience(nextWorkExperience)
      .then(() => loadWorkExperience())
      .then(() => {
        setSaveState("Experience removed.");
      })
      .catch((error) => {
        setFormError(error.message || "Unable to remove experience");
      });
  };

  const syncWorkExperience = async (nextWorkExperience) => {
    const response = await fetch("/api/work-experience", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ workExperience: nextWorkExperience }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Unable to save experience");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");
    setSaveState("");

    const errors = validateForm();
    if (errors.length > 0) {
      setFormError(errors.join(" "));
      return;
    }

    if (editing !== null) {
      handleUpdate(editing);
      return;
    }

    handleAdd();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h2>

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
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                  <p className="text-sm text-gray-600">
                    {[
                      exp.state?.name || exp.stateName,
                      exp.country?.name || exp.countryName,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    {exp.pincode ? ` | ${exp.pincode}` : ""}
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
                    type="button"
                    onClick={() => handleEdit(index, exp)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
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

      <form
        onSubmit={handleSubmit}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6"
      >
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
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={inputClassName}
              required
            >
              <option value="">Select position</option>
              {positionOptions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
            {formData.position === "Other" && (
              <input
                type="text"
                name="customPosition"
                value={formData.customPosition}
                onChange={handleChange}
                className={`${inputClassName} mt-3`}
                placeholder="Enter your position"
                maxLength={120}
                required
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              name="countryId"
              value={formData.countryId}
              onChange={handleChange}
              className={inputClassName}
              required
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State / Province *
            </label>
            <select
              name="stateId"
              value={formData.stateId}
              onChange={handleChange}
              className={inputClassName}
              disabled={!formData.countryId}
              required
            >
              <option value="">Select state</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode / Postal Code
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className={inputClassName}
              placeholder="600001"
              maxLength={12}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={inputClassName}
              required
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
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={inputClassName}
                required={!formData.current}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="• Led development of feature X resulting in 30% efficiency improvement"
              required
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
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FiCheck className="h-5 w-5" />
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <FiX className="h-5 w-5" />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <FiCheck className="h-5 w-5" />
                Save
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <FiPlus className="h-5 w-5" />
                Add Experience
              </button>
            </>
          )}
        </div>

        {(formError || saveState) && (
          <p
            className={`mt-4 text-sm ${formError ? "text-red-600" : "text-green-600"}`}
          >
            {formError || saveState}
          </p>
        )}
      </form>
    </div>
  );
}
