"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  FiFileText,
  FiUser,
  FiBookOpen,
  FiBriefcase,
  FiAward,
  FiMenu,
  FiX,
  FiEye,
  FiMaximize2,
  FiMinimize2,
  FiMoon,
  FiSun,
  FiMove,
  FiSave,
} from "react-icons/fi";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import EducationForm from "@/components/forms/EducationForm";
import WorkExperienceForm from "@/components/forms/WorkExperienceForm";
import SkillsForm from "@/components/forms/SkillsForm";
import ProjectsForm from "@/components/forms/ProjectsForm";
import CertificationsForm from "@/components/forms/CertificationsForm";
import UserAvatar from "@/components/UserAvatar";
import ResumePreview from "@/components/ResumePreview";
import useResumeStore from "@/store/resumeStore";

export default function ResumeBuilderPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50);
  const containerRef = useRef(null);
  const draggingRef = useRef(false);
  const {
    personalInfo,
    education,
    workExperience,
    skills,
    projects,
    certifications,
    setPersonalInfo,
    setEducation,
    setWorkExperience,
    setSkills,
    setProjects,
    setCertifications,
  } = useResumeStore();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const authResponse = await fetch("/api/auth/me");
        if (!authResponse.ok) {
          router.push("/login");
          return;
        }

        const authData = await authResponse.json();
        setUser(authData.user);

        const profile = authData.user?.profile;
        if (profile) {
          setPersonalInfo({
            fullName: authData.user?.name || "",
            email: authData.user?.email || "",
            phone: profile.phone || "",
            location: [profile.state?.name, profile.country?.name]
              .filter(Boolean)
              .join(", "),
            linkedin: profile.linkedin || "",
            github: profile.github || "",
            portfolio: profile.portfolio || "",
            summary: profile.summary || "",
          });
        }

        const resumeResponse = await fetch("/api/resume");
        if (resumeResponse.ok) {
          const resumeData = await resumeResponse.json();
          const sections = resumeData.resume?.sections || [];
          const sectionMap = Object.fromEntries(
            sections.map((section) => [section.type, section.content]),
          );

          if (sectionMap.personal) {
            setPersonalInfo({
              fullName:
                sectionMap.personal.fullName || authData.user?.name || "",
              email: sectionMap.personal.email || authData.user?.email || "",
              phone: sectionMap.personal.phone || "",
              location: sectionMap.personal.location || "",
              linkedin: sectionMap.personal.linkedin || "",
              github: sectionMap.personal.github || "",
              portfolio: sectionMap.personal.portfolio || "",
              summary: sectionMap.personal.summary || "",
            });
          }
          if (sectionMap.education) setEducation(sectionMap.education);
          if (sectionMap.experience) setWorkExperience(sectionMap.experience);
          if (sectionMap.skills) setSkills(sectionMap.skills);
          if (sectionMap.projects) setProjects(sectionMap.projects);
          if (sectionMap.certifications)
            setCertifications(sectionMap.certifications);
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    router,
    setPersonalInfo,
    setEducation,
    setWorkExperience,
    setSkills,
    setProjects,
    setCertifications,
  ]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: personalInfo.phone,
          countryId: null,
          stateId: null,
          pincode: null,
          linkedin: personalInfo.linkedin,
          github: personalInfo.github,
          portfolio: personalInfo.portfolio,
          summary: personalInfo.summary,
        }),
      });

      await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: personalInfo.fullName
            ? `${personalInfo.fullName}'s Resume`
            : "Resume",
          status: "draft",
          summary: personalInfo.summary,
          jobTitle: "",
          targetRole: "",
          atsScore: null,
          sections: {
            personal: personalInfo,
            education,
            experience: workExperience,
            skills,
            projects,
            certifications,
          },
        }),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const resumeElement = document.getElementById("resume-preview");
      if (!resumeElement) return;

      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      });

      const imgWidth = 8.5;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      const safeName = (
        personalInfo.fullName ||
        user?.name ||
        "Resume"
      ).replace(/\s+/g, "_");
      pdf.save(`${safeName}_Resume.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const tabs = [
    { id: "personal", name: "Personal Info", icon: FiUser },
    { id: "education", name: "Education", icon: FiBookOpen },
    { id: "experience", name: "Experience", icon: FiBriefcase },
    { id: "skills", name: "Skills", icon: FiAward },
    { id: "projects", name: "Projects", icon: FiFileText },
    { id: "certifications", name: "Certifications", icon: FiAward },
  ];

  const previewScale = useMemo(
    () => Math.max(0.64, Math.min(1.0, splitRatio / 58)),
    [splitRatio],
  );

  useEffect(() => {
    const handleMove = (event) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nextRatio = ((event.clientX - rect.left) / rect.width) * 100;
      setSplitRatio(Math.max(45, Math.min(75, nextRatio)));
    };

    const handleUp = () => {
      draggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-[#151515] text-white" : "bg-[#151515] text-white"}`}
    >
      <nav className="border-b border-white/10 fixed w-full z-10 shadow-sm rounded-b-2xl overflow-hidden bg-[#171717]/90 backdrop-blur">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10"
              >
                {sidebarOpen ? (
                  <FiX className="h-5 w-5" />
                ) : (
                  <FiMenu className="h-5 w-5" />
                )}
              </button>
              <Link href="/dashboard" className="flex items-center">
                <FiFileText className="h-7 w-7 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-white">JD2CV</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white/80 hover:bg-white/10 text-sm rounded-lg transition-colors disabled:opacity-50"
              >
                <FiSave className="h-4 w-4" />
                <span>{saving ? "Saving..." : "Save Draft"}</span>
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white/80 hover:bg-white/10 text-sm rounded-lg transition-colors"
              >
                <FiEye className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-white/5 text-yellow-400 hover:bg-white/10 transition-colors"
                title={darkMode ? "Light mode" : "Dark mode"}
              >
                {darkMode ? (
                  <FiSun className="h-4 w-4" />
                ) : (
                  <FiMoon className="h-4 w-4" />
                )}
              </button>
              <UserAvatar user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="flex h-[calc(100vh-5rem)] gap-2">
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-20 w-48 border-r border-white/10 bg-[#181818] pt-14 lg:pt-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto rounded-2xl`}
          >
            <nav className="px-2 py-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-sm ${activeTab === tab.id ? "bg-white text-black font-semibold" : "text-white/70 hover:bg-white/5"}`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>

            <div
              className={`px-2 py-2 border-t ${darkMode ? "border-gray-700" : "border-gray-200"} mt-2`}
            >
              <h3 className="text-[10px] font-semibold text-white/35 mb-2 uppercase tracking-wide">
                Builder Progress
              </h3>
              <div className="space-y-1.5 text-xs">
                <Row
                  label="Personal Info"
                  done={Boolean(personalInfo.fullName)}
                  darkMode={darkMode}
                />
                <Row
                  label="Education"
                  done={education.length > 0}
                  darkMode={darkMode}
                />
                <Row
                  label="Experience"
                  done={workExperience.length > 0}
                  darkMode={darkMode}
                />
                <Row
                  label="Skills"
                  done={skills.technical.length > 0}
                  darkMode={darkMode}
                />
                <Row
                  label="Projects"
                  done={projects.length > 0}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </aside>

          <div
            ref={containerRef}
            className="flex-1 flex flex-col lg:flex-row overflow-hidden text-xs"
          >
            <main
              className={`flex-1 p-2 lg:p-3 overflow-y-auto text-xs ${previewFullscreen ? "hidden lg:block" : ""}`}
              style={
                !previewFullscreen ? { flexBasis: `${splitRatio}%` } : undefined
              }
            >
              {activeTab === "personal" && <PersonalInfoForm />}
              {activeTab === "education" && <EducationForm />}
              {activeTab === "experience" && <WorkExperienceForm />}
              {activeTab === "skills" && <SkillsForm />}
              {activeTab === "projects" && <ProjectsForm />}
              {activeTab === "certifications" && <CertificationsForm />}
            </main>

            {showPreview && (
              <>
                {!previewFullscreen && (
                  <button
                    type="button"
                    onMouseDown={() => {
                      draggingRef.current = true;
                    }}
                    onTouchStart={() => {
                      draggingRef.current = true;
                    }}
                    className="hidden lg:flex w-2 items-center justify-center cursor-col-resize bg-transparent hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Resize preview pane"
                    title="Drag to resize preview"
                  >
                    <span className="flex h-12 w-1 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                      <FiMove className="h-3 w-3 text-gray-500 dark:text-gray-300" />
                    </span>
                  </button>
                )}
                <aside
                  className={`${previewFullscreen ? "w-full" : "hidden lg:block"} ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"} border-l flex flex-col rounded-2xl overflow-hidden`}
                  style={
                    !previewFullscreen
                      ? { flexBasis: `${100 - splitRatio}%` }
                      : undefined
                  }
                >
                  <div
                    className={`p-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border-b flex items-center justify-between rounded-t-2xl`}
                  >
                    <div className="flex items-center gap-2">
                      <FiEye className="h-4 w-4 text-primary-600" />
                      <h3
                        className={`text-sm font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}
                      >
                        Live Preview
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                      >
                        <FiFileText className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => setPreviewFullscreen(!previewFullscreen)}
                        className={`p-1.5 ${darkMode ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"} rounded transition-colors`}
                        title={
                          previewFullscreen ? "Exit fullscreen" : "Fullscreen"
                        }
                      >
                        {previewFullscreen ? (
                          <FiMinimize2 className="h-4 w-4" />
                        ) : (
                          <FiMaximize2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 flex justify-center items-start">
                    <div
                      className="origin-top bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 p-2"
                      style={{
                        width: `${100 / previewScale}%`,
                        transform: `scale(${Math.max(0.6, previewScale - 0.12)})`,
                      }}
                    >
                      <ResumePreview />
                    </div>
                  </div>
                </aside>
              </>
            )}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function Row({ label, done, darkMode }) {
  return (
    <div className="flex items-center justify-between">
      <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
        {label}
      </span>
      <span className={done ? "text-green-600" : "text-gray-400"}>
        {done ? "✓" : "◦"}
      </span>
    </div>
  );
}
