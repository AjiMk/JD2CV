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
    "w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

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
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Work Experience
      </h2>

      {workExperience.length > 0 && (
        <div className="space-y-4 mb-6">
          {workExperience.map((exp, index) => (
            <div key={exp.id} className="rounded-lg border border-border p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {exp.position}
                  </h3>
                  <p className="text-muted-foreground">{exp.company}</p>
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
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {exp.achievements}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    type="button"
                    onClick={() => handleEdit(index, exp)}
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

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border-2 border-dashed border-input bg-background p-6"
      >
        <h3 className="font-semibold text-foreground mb-4">
          {editing !== null ? "Edit Experience" : "Add Work Experience"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
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
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Position / Title *
            </label>
            <Select
              value={formData.position}
              onValueChange={(value) =>
                handleChange({ target: { name: "position", value } })
              }
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {positionOptions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Country *
            </label>
            <Select
              value={formData.countryId}
              onValueChange={(value) =>
                handleChange({ target: { name: "countryId", value } })
              }
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              State / Province *
            </label>
            <Select
              value={formData.stateId}
              onValueChange={(value) =>
                handleChange({ target: { name: "stateId", value } })
              }
              disabled={!formData.countryId}
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
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
            <label className="block text-sm font-medium text-muted-foreground mb-2">
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
              className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
            />
            <label
              htmlFor="current"
              className="text-sm font-medium text-muted-foreground"
            >
              I currently work here
            </label>
          </div>

          {!formData.current && (
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
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
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Key Achievements & Responsibilities *
            </label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              rows="6"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="• Led development of feature X resulting in 30% efficiency improvement"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Use bullet points (•) to list your achievements. Focus on
              quantifiable results and impact.
            </p>
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
                Save
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
                Add Experience
              </Button>
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
