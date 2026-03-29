"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  BookOpen,
  Briefcase,
  Eye,
  FileText,
  Maximize2,
  Minimize2,
  Moon,
  Save,
  Sparkles,
  Sun,
  User,
} from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import EducationForm from "@/components/forms/EducationForm";
import WorkExperienceForm from "@/components/forms/WorkExperienceForm";
import SkillsForm from "@/components/forms/SkillsForm";
import ProjectsForm from "@/components/forms/ProjectsForm";
import CertificationsForm from "@/components/forms/CertificationsForm";
import ResumePreview from "@/components/ResumePreview";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useResumeStore from "@/store/resumeStore";

export default function ResumeBuilderPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [darkMode, setDarkMode] = useState(true);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
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
    else setDarkMode(true);
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
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

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
    pdf.save(`${(personalInfo.fullName || "Resume").replace(/\s+/g, "_")}.pdf`);
  };

  if (loading || !user) return null;

  const tabs = [
    {
      id: "personal",
      label: "Personal",
      icon: User,
      component: <PersonalInfoForm />,
    },
    {
      id: "education",
      label: "Education",
      icon: BookOpen,
      component: <EducationForm />,
    },
    {
      id: "experience",
      label: "Experience",
      icon: Briefcase,
      component: <WorkExperienceForm />,
    },
    {
      id: "skills",
      label: "Skills",
      icon: FileText,
      component: <SkillsForm />,
    },
    {
      id: "projects",
      label: "Projects",
      icon: FileText,
      component: <ProjectsForm />,
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: FileText,
      component: <CertificationsForm />,
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center justify-between gap-2 px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="text-sm font-medium">Resume Builder</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDarkMode((v) => !v)}
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSaveDraft}
                disabled={saving}
                aria-label="Save draft"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={handleDownloadPDF}
                aria-label="Download resume"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>Build your resume</CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 md:grid-cols-6">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <div className="space-y-4">
                {tabs.find((tab) => tab.id === activeTab)?.component}
              </div>
              <div className={previewFullscreen ? "xl:col-span-2" : ""}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-medium">Live Preview</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPreviewFullscreen((v) => !v)}
                    aria-label="Toggle fullscreen"
                  >
                    {previewFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <ResumePreview />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
