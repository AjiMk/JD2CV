"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import EducationForm from "@/components/forms/EducationForm";
import WorkExperienceForm from "@/components/forms/WorkExperienceForm";
import SkillsForm from "@/components/forms/SkillsForm";
import ProjectsForm from "@/components/forms/ProjectsForm";
import CertificationsForm from "@/components/forms/CertificationsForm";
import UserAvatar from "@/components/UserAvatar";
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
  const [darkMode, setDarkMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
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
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stepIndex]);

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
          setPhotoUrl(profile.photoUrl || "");
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
    if (personalInfo.countryId && !states.length) {
      const loadStates = async () => {
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
    }
  }, [personalInfo.countryId, states.length]);

  useEffect(() => {
    if (
      !personalInfo.countryId &&
      (personalInfo.stateId || personalInfo.pincode)
    ) {
      setPersonalInfo((current) => ({
        ...current,
        stateId: "",
        pincode: "",
      }));
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

  const handlePhotoEditorImageLoad = () => {
    setPhotoEditorPosition({ x: 0, y: 0 });
  };

  const handlePhotoEditorMouseDown = (event) => {
    event.preventDefault();
    setPhotoEditorDragging(true);
  };

  const handlePhotoEditorMouseMove = (event) => {
    if (!photoEditorDragging || !photoEditorBoxRef.current) return;
    const rect = photoEditorBoxRef.current.getBoundingClientRect();
    setPhotoEditorPosition((current) => ({
      x: current.x + event.movementX,
      y: current.y + event.movementY,
    }));
  };

  const handlePhotoEditorMouseUp = () => {
    setPhotoEditorDragging(false);
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

  const handlePhotoEditorConfirm = async () => {
    const editedFile = await createEditedPhotoFile();
    if (!editedFile) return;

    if (photoEditorSrc) URL.revokeObjectURL(photoEditorSrc);
    setPhotoPreview(URL.createObjectURL(editedFile));
    setPhotoUrl("");
    setPhotoEditorOpen(false);
    setPhotoEditorFile(editedFile);

    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === "string" ? reader.result : "";
      setPersonalInfo({
        ...personalInfo,
        photo: value,
      });
    };
    reader.readAsDataURL(editedFile);
  };

  const closePhotoEditor = () => {
    if (photoEditorSrc) URL.revokeObjectURL(photoEditorSrc);
    setPhotoEditorOpen(false);
    setPhotoEditorSrc("");
    setPhotoEditorFile(null);
    setPhotoEditorZoom(1);
    setPhotoEditorPosition({ x: 0, y: 0 });
  };

  const uploadProfilePhoto = async () => {
    const file = photoEditorFile || photoInputRef.current?.files?.[0];
    if (!file) {
      return {
        storagePath: photoPath || "",
        thumbnailPath: photoThumbnailPath || "",
      };
    }

    const formData = new FormData();
    formData.append("photo", file);

    const response = await fetch("/api/profile/photo", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Unable to upload photo");
    }

    const data = await response.json();
    setPhotoPath(data.storagePath || "");
    setPhotoThumbnailPath(data.thumbnailPath || "");
    return {
      storagePath: data.storagePath || "",
      thumbnailPath: data.thumbnailPath || "",
    };
  };

  const refreshProfilePhoto = async () => {
    if (refreshingPhoto) return;
    setRefreshingPhoto(true);
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!response.ok) return;

      const data = await response.json();
      const photo =
        data.user?.profile?.photoThumbnailUrl ||
        data.user?.profile?.photoUrl ||
        "";
      const photoStoragePath = data.user?.profile?.photoPath || "";
      const photoStorageThumbnail =
        data.user?.profile?.photoThumbnailPath ||
        data.user?.profile?.photoThumbnailUrl ||
        "";
      if (photo) {
        setPhotoPreview(photo);
        setPhotoUrl(photo);
      }
      if (photoStoragePath) {
        setPhotoPath(photoStoragePath);
      }
      if (photoStorageThumbnail) {
        setPhotoThumbnailPath(photoStorageThumbnail);
      }
    } finally {
      setRefreshingPhoto(false);
    }
  };

  const refreshHeaderUser = async () => {
    const response = await fetch("/api/auth/me", { cache: "no-store" });
    if (!response.ok) return;

    const data = await response.json();
    setUser(data.user);
  };

  const triggerPhotoUpload = () => {
    photoInputRef.current?.click();
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

    if (!personalInfo.fullName?.trim()) {
      nextErrors.fullName = "Full name is required.";
    } else if (!namePattern.test(personalInfo.fullName.trim())) {
      nextErrors.fullName =
        "Use letters, spaces, apostrophes, hyphens, and periods only.";
    }

    if (!personalInfo.email?.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(personalInfo.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!personalInfo.phone?.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (!selectedCountry) {
      nextErrors.country = "Select a country first.";
    } else if (personalInfo.phone.trim().length < 7) {
      nextErrors.phone = `Enter a valid phone number for ${selectedCountry.name}.`;
    }

    if (!selectedCountry) {
      nextErrors.country = "Select a country first.";
    }

    if (!personalInfo.stateId) {
      nextErrors.stateId = "State / province is required.";
    } else if (!selectedState) {
      nextErrors.stateId = "Select a valid state / province.";
    }

    if (selectedCountry?.code === "IN" && !personalInfo.pincode?.trim()) {
      nextErrors.pincode = "Pincode is required for India.";
    } else if (
      personalInfo.pincode &&
      !/^[A-Za-z0-9\s-]{3,12}$/.test(personalInfo.pincode.trim())
    ) {
      nextErrors.pincode = "Enter a valid pincode.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setSaving(true);
    try {
      const uploadedPhoto = await uploadProfilePhoto();
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: personalInfo.fullName,
          phone: personalInfo.phone,
          photoUrl: uploadedPhoto.storagePath || photoPath || null,
          photoThumbnailUrl:
            uploadedPhoto.thumbnailPath || photoThumbnailPath || null,
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

      await refreshHeaderUser();
      await refreshProfilePhoto();
      setPhotoEditorFile(null);
      setMaxUnlockedStep(1);
      setStepIndex(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    setStepIndex((value) => {
      const nextIndex = Math.min(value + 1, steps.length - 1);
      setMaxUnlockedStep((current) => Math.max(current, nextIndex));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return nextIndex;
    });
  };
  const handleBack = () => {
    setStepIndex((value) => Math.max(value - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const progress = ((stepIndex + 1) / steps.length) * 100;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur sticky top-0 z-20 border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <FiFileText className="h-7 w-7 text-primary-600 group-hover:scale-105 transition-transform" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-600 transition-colors">
                User profile
              </p>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                JD2CV
              </h1>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Profile update progress
              </p>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Step {stepIndex + 1} of {steps.length}: {steps[stepIndex].title}
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}%
            </p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-primary-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (index <= maxUnlockedStep) {
                    setStepIndex(index);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                disabled={index > maxUnlockedStep}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${index === stepIndex ? "bg-primary-600 text-white" : index < stepIndex ? "bg-primary-50 text-primary-700 dark:bg-gray-800 dark:text-primary-300" : index <= maxUnlockedStep ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" : "cursor-not-allowed bg-gray-100 text-gray-400 opacity-50 dark:bg-gray-800 dark:text-gray-600"}`}
              >
                {step.title}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {stepIndex === 0 && (
            <>
              <form onSubmit={handleSaveProfile}>
                <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Personal Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Save this first to unlock the next profile step.
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <button
                      type="button"
                      onClick={triggerPhotoUpload}
                      className="group relative h-24 w-24 overflow-hidden rounded-full border border-gray-200 bg-gray-50 text-left transition-transform hover:scale-[1.02] dark:border-gray-800 dark:bg-gray-800"
                    >
                      {photoPreview ? (
                        <Image
                          src={photoPreview}
                          alt="Profile preview"
                          fill
                          sizes="96px"
                          className="object-cover"
                          onError={refreshProfilePhoto}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <FiUpload className="h-8 w-8" />
                        </div>
                      )}
                      <span className="absolute inset-0 flex items-end justify-center bg-black/0 px-2 pb-2 text-[10px] font-medium text-white opacity-0 transition-colors group-hover:bg-black/20 group-hover:opacity-100">
                        Click to upload
                      </span>
                    </button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/jpg,image/png"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    {photoError ? (
                      <p className="max-w-48 text-right text-xs text-red-600 dark:text-red-400">
                        {photoError}
                      </p>
                    ) : (
                      <p className="max-w-48 text-right text-xs text-gray-500 dark:text-gray-400">
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

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    <FiEdit3 className="h-4 w-4" />
                    {saving ? "Saving..." : "Save and continue"}
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </>
          )}

          {stepIndex === 1 && (
            <>
              <EducationForm />
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Next
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {stepIndex === 2 && (
            <>
              <WorkExperienceForm />
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Next
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {stepIndex === 3 && (
            <>
              <SkillsForm />
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Next
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {stepIndex === 4 && (
            <>
              <ProjectsForm />
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Next
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {stepIndex === 5 && (
            <>
              <CertificationsForm />
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <Link
                  href="/resume-builder"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Finish in Resume Builder
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </section>
      </main>

      {photoEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Adjust photo
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Drag the image and zoom before saving.
                </p>
              </div>
              <button
                type="button"
                onClick={closePhotoEditor}
                className="rounded-lg px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Close
              </button>
            </div>

            <div
              ref={photoEditorBoxRef}
              onMouseMove={handlePhotoEditorMouseMove}
              onMouseUp={handlePhotoEditorMouseUp}
              onMouseLeave={handlePhotoEditorMouseUp}
              className="mt-4 flex h-80 items-center justify-center overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800"
            >
              {photoEditorSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={photoEditorImageRef}
                  src={photoEditorSrc}
                  alt="Selected"
                  onLoad={handlePhotoEditorImageLoad}
                  onMouseDown={handlePhotoEditorMouseDown}
                  draggable={false}
                  className="select-none object-cover"
                  style={{
                    width: "240px",
                    height: "240px",
                    transform: `translate(${photoEditorPosition.x}px, ${photoEditorPosition.y}px) scale(${photoEditorZoom})`,
                    cursor: photoEditorDragging ? "grabbing" : "grab",
                  }}
                />
              ) : null}
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Zoom
              </label>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.01"
                value={photoEditorZoom}
                onChange={(event) =>
                  setPhotoEditorZoom(Number(event.target.value))
                }
                className="w-full"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closePhotoEditor}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePhotoEditorConfirm}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Use photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
