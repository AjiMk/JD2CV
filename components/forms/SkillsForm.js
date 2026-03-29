"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import useResumeStore from "@/store/resumeStore";
import { FiPlus, FiX } from "react-icons/fi";

export default function SkillsForm() {
  const { skills, setSkills } = useResumeStore();
  const [technicalSkill, setTechnicalSkill] = useState("");
  const [softSkill, setSoftSkill] = useState("");
  const [skillCatalog, setSkillCatalog] = useState([]);
  const [saveState, setSaveState] = useState("");
  const [saveError, setSaveError] = useState("");
  const inputClassName =
    "flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await fetch("/api/skills", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        setSkillCatalog(data.skills || []);

        const userSkills = Array.isArray(data.userSkills)
          ? data.userSkills
          : [];
        const nextSkills = {
          technical: userSkills
            .filter((item) => item.category === "technical")
            .map((item) => item.skill?.name || item.skillName || "")
            .filter(Boolean),
          soft: userSkills
            .filter((item) => item.category === "soft")
            .map((item) => item.skill?.name || item.skillName || "")
            .filter(Boolean),
        };

        setSkills(nextSkills);
      } catch {
        // Keep local store if fetch fails.
      }
    };

    loadSkills();
  }, [setSkills]);

  const suggestions = useMemo(() => {
    return {
      technical: skillCatalog.filter((skill) => skill.category === "technical"),
      soft: skillCatalog.filter((skill) => skill.category === "soft"),
    };
  }, [skillCatalog]);

  const syncSkills = async (nextSkills) => {
    const response = await fetch("/api/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(nextSkills),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Unable to save skills");
    }
  };

  const handleAddSkill = async (type, value) => {
    const skill = value.trim();
    if (!skill) return;

    const nextSkills = {
      ...skills,
      [type]: skills[type].includes(skill)
        ? skills[type]
        : [...skills[type], skill],
    };

    setSaveState("Saving skills...");
    setSaveError("");
    setSkills(nextSkills);
    await syncSkills(nextSkills);
    setSaveState("Skills saved.");
  };

  const handleRemoveSkill = async (type, index) => {
    const nextSkills = {
      ...skills,
      [type]: skills[type].filter((_, i) => i !== index),
    };

    setSaveState("Saving skills...");
    setSaveError("");
    setSkills(nextSkills);
    await syncSkills(nextSkills);
    setSaveState("Skills saved.");
  };

  const handleAddTechnical = async (e) => {
    e.preventDefault();
    try {
      await handleAddSkill("technical", technicalSkill);
      setTechnicalSkill("");
    } catch (error) {
      setSaveError(error.message || "Unable to save skills");
    }
  };

  const handleAddSoft = async (e) => {
    e.preventDefault();
    try {
      await handleAddSkill("soft", softSkill);
      setSoftSkill("");
    } catch (error) {
      setSaveError(error.message || "Unable to save skills");
    }
  };

  const handleSuggestionClick = async (type, skillName) => {
    try {
      await handleAddSkill(type, skillName);
    } catch (error) {
      setSaveError(error.message || "Unable to save skills");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-6">Skills</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-foreground mb-3">
            Technical Skills
          </h3>

          <div className="mb-4 flex min-h-[60px] flex-wrap gap-2 rounded-lg border border-border p-3">
            {skills.technical.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No technical skills added yet
              </p>
            ) : (
              skills.technical.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  {skill}
                  <Button
                    type="button"
                    onClick={() => handleRemoveSkill("technical", index)}
                    className="hover:text-foreground"
                  >
                    <FiX className="h-4 w-4" />
                  </Button>
                </span>
              ))
            )}
          </div>

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
            <Button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              <FiPlus className="h-5 w-5" />
              Add
            </Button>
          </form>

          <p className="mt-2 text-xs text-muted-foreground">
            Add programming languages, frameworks, tools, and technologies
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Soft Skills</h3>

          <div className="mb-4 flex min-h-[60px] flex-wrap gap-2 rounded-lg border border-border p-3">
            {skills.soft.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No soft skills added yet
              </p>
            ) : (
              skills.soft.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  {skill}
                  <Button
                    type="button"
                    onClick={() => handleRemoveSkill("soft", index)}
                    className="hover:text-foreground"
                  >
                    <FiX className="h-4 w-4" />
                  </Button>
                </span>
              ))
            )}
          </div>

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
            <Button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              <FiPlus className="h-5 w-5" />
              Add
            </Button>
          </form>

          <p className="mt-2 text-xs text-muted-foreground">
            Add interpersonal and professional skills
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <h3 className="font-semibold text-foreground mb-3">
          Suggested Technical Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {suggestions.technical.map((skill) => (
            <Button
              key={skill.id}
              type="button"
              onClick={() => handleSuggestionClick("technical", skill.name)}
              className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              + {skill.name}
            </Button>
          ))}
        </div>

        <h3 className="font-semibold text-foreground mb-3 mt-4">
          Suggested Soft Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {suggestions.soft.map((skill) => (
            <Button
              key={skill.id}
              type="button"
              onClick={() => handleSuggestionClick("soft", skill.name)}
              className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              + {skill.name}
            </Button>
          ))}
        </div>
      </div>

      {(saveState || saveError) && (
        <p
          className={`mt-4 text-sm ${saveError ? "text-red-600" : "text-green-600"}`}
        >
          {saveError || saveState}
        </p>
      )}
    </div>
  );
}
