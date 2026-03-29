"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiEdit3,
  FiFileText,
  FiMoon,
  FiSun,
  FiUpload,
} from "react-icons/fi";

import CertificationsForm from "@/components/forms/CertificationsForm";
import EducationForm from "@/components/forms/EducationForm";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import ProjectsForm from "@/components/forms/ProjectsForm";
import SkillsForm from "@/components/forms/SkillsForm";
import WorkExperienceForm from "@/components/forms/WorkExperienceForm";
import DashboardNavbar from "@/components/DashboardNavbar";
import Button from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useResumeStore from "@/store/resumeStore";

const steps = [
  { id: "personal", title: "Personal Info" },
  { id: "education", title: "Education" },
  { id: "experience", title: "Experience" },
  { id: "skills", title: "Skills" },
  { id: "projects", title: "Projects" },
  { id: "certifications", title: "Certifications" },
];

const allowedPhotoMimeTypes = new Set(["image/jpeg", "image/jpg", "image/png"]);

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoPath, setPhotoPath] = useState("");
  const [photoThumbnailPath, setPhotoThumbnailPath] = useState("");
  const [refreshingPhoto, setRefreshingPhoto] = useState(false);
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [photoEditorSrc, setPhotoEditorSrc] = useState("");
  const [photoEditorFile, setPhotoEditorFile] = useState(null);
  const [photoEditorZoom, setPhotoEditorZoom] = useState(1);
  const [photoEditorPosition, setPhotoEditorPosition] = useState({
    x: 0,
    y: 0,
  });
  const [photoEditorDragging, setPhotoEditorDragging] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});
  const [photoError, setPhotoError] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const { personalInfo, setPersonalInfo } = useResumeStore();
  const photoInputRef = useRef(null);
  const photoEditorImageRef = useRef(null);
  const photoEditorBoxRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          router.push("/login");
          return;
        }

        const data = await response.json();
        setUser(data.user);

        const profile = data.user?.profile;
        if (profile) {
          const nextPhoto = profile.photo || "";
          const storedPhotoPath = profile.photoPath || profile.photoUrl || "";
          const storedThumbnailPath =
            profile.photoThumbnailPath || profile.photoThumbnailUrl || "";
          setPersonalInfo({
            fullName: data.user?.name || "",
            email: data.user?.email || "",
            phone: profile.phone || "",
            countryId: profile.countryId || profile.country?.id || "",
            stateId: profile.stateId || profile.state?.id || "",
            pincode: profile.pincode || "",
            location: [profile.state?.name, profile.country?.name]
              .filter(Boolean)
              .join(", "),
            photo: profile.photoUrl || "",
            linkedin: profile.linkedin || "",
            github: profile.github || "",
            portfolio: profile.portfolio || "",
            summary: profile.summary || "",
          });
          setPhotoPreview(
            profile.photoThumbnailUrl || profile.photoUrl || nextPhoto,
          );
          setPhotoPath(storedPhotoPath);
          setPhotoThumbnailPath(storedThumbnailPath);
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [router, setPersonalInfo]);

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

  useEffect(() => {
    const loadStates = async () => {
      if (!personalInfo.countryId) {
        setStates([]);
        return;
      }
      try {
        const response = await fetch(
          `/api/states?countryId=${personalInfo.countryId}`,
        );
        if (!response.ok) return;
        const data = await response.json();
        setStates(data.states || []);
      } catch {
        setStates([]);
      }
    };
    loadStates();
  }, [personalInfo.countryId]);

  useEffect(() => {
    if (
      !personalInfo.countryId &&
      (personalInfo.stateId || personalInfo.pincode)
    ) {
      setPersonalInfo((current) => ({ ...current, stateId: "", pincode: "" }));
    }
  }, [
    personalInfo.countryId,
    personalInfo.stateId,
    personalInfo.pincode,
    setPersonalInfo,
  ]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const isAllowedType =
      allowedPhotoMimeTypes.has(file.type) ||
      /\.(jpe?g|png)$/i.test(file.name || "");
    if (!isAllowedType) {
      setPhotoError("Only JPG and PNG images are allowed.");
      event.target.value = "";
      return;
    }
    setPhotoError("");
    if (photoEditorSrc) URL.revokeObjectURL(photoEditorSrc);
    setPhotoEditorFile(file);
    setPhotoEditorSrc(URL.createObjectURL(file));
    setPhotoEditorZoom(1);
    setPhotoEditorPosition({ x: 0, y: 0 });
    setPhotoEditorOpen(true);
    event.target.value = "";
  };

  const createEditedPhotoFile = async () => {
    if (!photoEditorFile || !photoEditorImageRef.current)
      return photoEditorFile;
    const image = photoEditorImageRef.current;
    const outputSize = 512;
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");

    const baseScale = Math.max(
      outputSize / image.naturalWidth,
      outputSize / image.naturalHeight,
    );
    const scale = baseScale * photoEditorZoom;
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const offsetX = (photoEditorPosition.x * outputSize) / 240;
    const offsetY = (photoEditorPosition.y * outputSize) / 240;
    const x = (outputSize - drawWidth) / 2 + offsetX;
    const y = (outputSize - drawHeight) / 2 + offsetY;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outputSize, outputSize);
    ctx.drawImage(image, x, y, drawWidth, drawHeight);

    const mimeType =
      photoEditorFile.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, mimeType, 0.92),
    );
    if (!blob) return photoEditorFile;
    const extension = mimeType === "image/png" ? "png" : "jpg";
    return new File([blob], `profile-photo.${extension}`, { type: mimeType });
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const namePattern = /^[A-Za-z][A-Za-z\s.'-]*$/;
    const selectedCountry = countries.find(
      (country) => country.id === personalInfo.countryId,
    );
    const selectedState = states.find(
      (state) => state.id === personalInfo.stateId,
    );

    if (!personalInfo.fullName?.trim())
      nextErrors.fullName = "Full name is required.";
    else if (!namePattern.test(personalInfo.fullName.trim()))
      nextErrors.fullName =
        "Use letters, spaces, apostrophes, hyphens, and periods only.";
    if (!personalInfo.email?.trim()) nextErrors.email = "Email is required.";
    else if (!emailPattern.test(personalInfo.email.trim()))
      nextErrors.email = "Enter a valid email address.";
    if (!personalInfo.phone?.trim())
      nextErrors.phone = "Phone number is required.";
    else if (!selectedCountry) nextErrors.country = "Select a country first.";
    else if (personalInfo.phone.trim().length < 7)
      nextErrors.phone = `Enter a valid phone number for ${selectedCountry.name}.`;
    if (!selectedCountry) nextErrors.country = "Select a country first.";
    if (!personalInfo.stateId)
      nextErrors.stateId = "State / province is required.";
    else if (!selectedState)
      nextErrors.stateId = "Select a valid state / province.";
    if (selectedCountry?.code === "IN" && !personalInfo.pincode?.trim())
      nextErrors.pincode = "Pincode is required for India.";
    else if (
      personalInfo.pincode &&
      !/^[A-Za-z0-9\s-]{3,12}$/.test(personalInfo.pincode.trim())
    )
      nextErrors.pincode = "Enter a valid pincode.";

    if (Object.keys(nextErrors).length > 0) return setFieldErrors(nextErrors);
    setFieldErrors({});
    setSaving(true);
    try {
      const editedFile = await createEditedPhotoFile();
      if (editedFile) {
        const formData = new FormData();
        formData.append("photo", editedFile);
        const response = await fetch("/api/profile/photo", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          setPhotoPath(data.storagePath || "");
          setPhotoThumbnailPath(data.thumbnailPath || "");
        }
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: personalInfo.fullName,
          phone: personalInfo.phone,
          photoUrl: photoPath || null,
          photoThumbnailUrl: photoThumbnailPath || null,
          countryId: personalInfo.countryId || null,
          stateId: personalInfo.stateId || null,
          pincode: personalInfo.pincode || null,
          linkedin: personalInfo.linkedin,
          github: personalInfo.github,
          portfolio: personalInfo.portfolio,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Unable to save profile");
      }
      setMaxUnlockedStep(1);
      setStepIndex(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNavbar
        user={user}
        onLogout={handleLogout}
        onToggleTheme={() => setDarkMode((v) => !v)}
      />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardHeader className="space-y-2">
            <CardTitle>Profile update progress</CardTitle>
            <CardDescription>
              Step {stepIndex + 1} of {steps.length}: {steps[stepIndex].title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() =>
                    index <= maxUnlockedStep && setStepIndex(index)
                  }
                  disabled={index > maxUnlockedStep}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    index === stepIndex
                      ? "bg-primary text-primary-foreground"
                      : index <= maxUnlockedStep
                        ? "bg-secondary text-secondary-foreground"
                        : "cursor-not-allowed bg-muted text-muted-foreground opacity-50"
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {stepIndex === 0 && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Personal Information
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Save this first to unlock the next profile step.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="group relative h-24 w-24 overflow-hidden rounded-full border border-border bg-muted text-left transition-transform hover:scale-[1.02]"
                    >
                      {photoPreview ? (
                        <Image
                          src={photoPreview}
                          alt="Profile preview"
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <FiUpload className="h-8 w-8" />
                        </div>
                      )}
                    </button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/jpg,image/png"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    {photoError ? (
                      <p className="max-w-48 text-right text-xs text-destructive">
                        {photoError}
                      </p>
                    ) : (
                      <p className="max-w-48 text-right text-xs text-muted-foreground">
                        JPG or PNG only
                      </p>
                    )}
                  </div>
                </div>

                <PersonalInfoForm
                  showSummary={false}
                  errors={fieldErrors}
                  countries={countries}
                  states={states}
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving} className="gap-2">
                    <FiEdit3 className="h-4 w-4" />
                    {saving ? "Saving..." : "Next"}
                    <FiArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}

            {stepIndex === 1 && (
              <StepBlock
                title="Education"
                onBack={() => setStepIndex(0)}
                onNext={() => setStepIndex(2)}
              >
                <EducationForm />
              </StepBlock>
            )}
            {stepIndex === 2 && (
              <StepBlock
                title="Experience"
                onBack={() => setStepIndex(1)}
                onNext={() => setStepIndex(3)}
              >
                <WorkExperienceForm />
              </StepBlock>
            )}
            {stepIndex === 3 && (
              <StepBlock
                title="Skills"
                onBack={() => setStepIndex(2)}
                onNext={() => setStepIndex(4)}
              >
                <SkillsForm />
              </StepBlock>
            )}
            {stepIndex === 4 && (
              <StepBlock
                title="Projects"
                onBack={() => setStepIndex(3)}
                onNext={() => setStepIndex(5)}
              >
                <ProjectsForm />
              </StepBlock>
            )}
            {stepIndex === 5 && (
              <div className="space-y-6">
                <CertificationsForm />
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStepIndex(4)}
                    className="gap-2"
                  >
                    <FiArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    className="gap-2"
                    onClick={() => router.push("/resume-builder")}
                  >
                    Finish in Resume Builder
                    <FiArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function StepBlock({ title, onBack, onNext, children }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      {children}
      <Separator />
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <FiArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} className="gap-2">
          Next
          <FiArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
