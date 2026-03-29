"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import useResumeStore from "@/store/resumeStore";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiX,
  FiExternalLink,
} from "react-icons/fi";

const blankForm = {
  name: "",
  description: "",
  technologies: [],
  link: "",
  highlights: "",
};

export default function ProjectsForm() {
  const { projects, setProjects } = useResumeStore();
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(blankForm);
  const [skillCatalog, setSkillCatalog] = useState([]);
  const [formError, setFormError] = useState("");
  const [saveState, setSaveState] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsResponse, skillsResponse] = await Promise.all([
          fetch("/api/projects", { cache: "no-store", credentials: "include" }),
          fetch("/api/skills", { cache: "no-store", credentials: "include" }),
        ]);

        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json();
          setSkillCatalog(skillsData.skills || []);
        }

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          const loadedProjects = Array.isArray(projectsData.projects)
            ? projectsData.projects
            : [];
          setProjects(loadedProjects);
        }
      } catch {
        setSkillCatalog([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setProjects]);

  const techSuggestions = useMemo(
    () =>
      skillCatalog
        .filter((skill) => !skill.category || skill.category === "technical")
        .sort((a, b) => a.name.localeCompare(b.name)),
    [skillCatalog],
  );

  const inputClassName =
    "w-full rounded-lg border border-input px-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push("Project name is required.");
    } else if (formData.name.trim().length < 2) {
      errors.push("Project name must be at least 2 characters.");
    }

    if (!formData.description.trim()) {
      errors.push("Description is required.");
    } else if (formData.description.trim().length < 10) {
      errors.push("Description should be at least 10 characters.");
    }

    if (formData.link.trim() && !/^https?:\/\/.+/i.test(formData.link.trim())) {
      errors.push("Project link must be a valid URL.");
    }

    if (formData.technologies.length === 0) {
      errors.push("Select at least one technology.");
    }

    return errors;
  };

  const resetForm = () => {
    setFormData(blankForm);
    setEditing(null);
  };

  const persistProjects = async (nextProjects, successMessage) => {
    setProjects(nextProjects);

    const response = await fetch("/api/projects", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projects: nextProjects,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Unable to save projects.");
    }

    const data = await response.json();
    setProjects(data.projects || []);
    setSaveState(successMessage);
  };

  const handleAddProject = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setFormError(errors.join(" "));
      return;
    }

    const nextProject = {
      id:
        editing !== null
          ? projects[editing]?.id || Date.now().toString()
          : Date.now().toString(),
      ...formData,
    };

    const nextProjects =
      editing !== null
        ? projects.map((item, index) =>
            index === editing ? nextProject : item,
          )
        : [...projects, nextProject];

    await persistProjects(nextProjects, "Project saved.");
    resetForm();
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setFormError(errors.join(" "));
      return;
    }

    const nextProject = {
      id:
        editing !== null
          ? projects[editing]?.id || Date.now().toString()
          : Date.now().toString(),
      ...formData,
    };

    const nextProjects =
      editing !== null
        ? projects.map((item, index) =>
            index === editing ? nextProject : item,
          )
        : [...projects, nextProject];

    await persistProjects(nextProjects, "Project saved.");
    setEditing(editing !== null ? editing : null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setSaveState("");

    try {
      const submitAction =
        event.nativeEvent?.submitter?.dataset?.action || "save";

      if (submitAction === "add") {
        await handleAddProject();
        return;
      }

      await handleSave();
    } catch (error) {
      setFormError(error.message || "Unable to save projects.");
    }
  };

  const handleEdit = (index, project) => {
    setEditing(index);
    setFormData({
      name: project.name || "",
      description: project.description || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies
        : typeof project.technologies === "string"
          ? project.technologies
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
      link: project.link || "",
      highlights: project.highlights || "",
    });
    setFormError("");
    setSaveState("");
  };

  const handleRemove = async (index) => {
    const nextProjects = projects.filter(
      (_, currentIndex) => currentIndex !== index,
    );

    try {
      await persistProjects(nextProjects, "Project removed.");
      if (editing === index) {
        resetForm();
      }
    } catch (error) {
      setFormError(error.message || "Unable to remove project.");
    }
  };

  const toggleTechnology = (technology) => {
    setFormData((current) => {
      const exists = current.technologies.includes(technology);
      return {
        ...current,
        technologies: exists
          ? current.technologies.filter((item) => item !== technology)
          : [...current.technologies, technology],
      };
    });
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-foreground">Projects</h2>
        <p className="text-sm text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-foreground">Projects</h2>

      {projects.length > 0 && (
        <div className="mb-6 space-y-4">
          {projects.map((project, index) => (
            <div
              key={project.id || `${project.name}-${index}`}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {project.name}
                    </h3>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <FiExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="mt-1 text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                  {Array.isArray(project.technologies) &&
                    project.technologies.length > 0 && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Technologies:</span>{" "}
                        {project.technologies.join(", ")}
                      </p>
                    )}
                  {project.highlights && (
                    <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                      {project.highlights}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => handleEdit(index, project)}
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
        <h3 className="mb-4 font-semibold text-foreground">
          {editing !== null ? "Edit Project" : "Add Project"}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              Project Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClassName}
              placeholder="E-commerce Platform"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="2"
              className={inputClassName}
              placeholder="A full-stack e-commerce application with payment integration..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              Project Link (GitHub/Live Demo)
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              className={inputClassName}
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              Key Highlights & Achievements
            </label>
            <textarea
              name="highlights"
              value={formData.highlights}
              onChange={(e) =>
                setFormData({ ...formData, highlights: e.target.value })
              }
              rows="3"
              className={inputClassName}
              placeholder="Implemented secure payment processing with Stripe"
            />
          </div>
        </div>

        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-foreground">
            Available Technologies
          </h4>
          <div className="flex flex-wrap gap-2">
            {techSuggestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No technologies found in the skills table.
              </p>
            ) : (
              techSuggestions.map((skill) => {
                const selected = formData.technologies.includes(skill.name);

                return (
                  <Button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleTechnology(skill.name)}
                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                      selected
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {selected ? "✓ " : "+ "}
                    {skill.name}
                  </Button>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            type="submit"
            data-action="save"
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 font-medium text-secondary-foreground hover:bg-secondary/80"
          >
            <FiCheck className="h-5 w-5" />
            Save
          </Button>
          <Button
            type="submit"
            data-action="add"
            className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2 font-medium text-muted-foreground hover:bg-secondary/80"
          >
            <FiPlus className="h-5 w-5" />
            Add Project
          </Button>
          {editing !== null && (
            <Button
              type="button"
              onClick={() => {
                resetForm();
                setFormError("");
                setSaveState("");
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              <FiX className="h-5 w-5" />
              Cancel
            </Button>
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
