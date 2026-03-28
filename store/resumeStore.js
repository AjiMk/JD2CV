import { create } from "zustand";

const useResumeStore = create((set) => ({
  // Check if we're in the browser before trying to use localStorage
  _hasHydrated: false,
  setHasHydrated: (state) => {
    set({
      _hasHydrated: state,
    });
  },
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    countryId: "",
    location: "",
    photo: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
  },
  education: [],
  workExperience: [],
  skills: {
    technical: [],
    soft: [],
  },
  projects: [],
  certifications: [],
  jobDescription: "",
  generatedResume: null,

  // Actions
  setPersonalInfo: (info) => set({ personalInfo: info }),

  setEducation: (education) => set({ education }),
  addEducation: (edu) =>
    set((state) => ({
      education: [...state.education, edu],
    })),
  updateEducation: (index, edu) =>
    set((state) => ({
      education: state.education.map((item, i) => (i === index ? edu : item)),
    })),
  removeEducation: (index) =>
    set((state) => ({
      education: state.education.filter((_, i) => i !== index),
    })),

  setWorkExperience: (experience) => set({ workExperience: experience }),
  addWorkExperience: (exp) =>
    set((state) => ({
      workExperience: [...state.workExperience, exp],
    })),
  updateWorkExperience: (index, exp) =>
    set((state) => ({
      workExperience: state.workExperience.map((item, i) =>
        i === index ? exp : item,
      ),
    })),
  removeWorkExperience: (index) =>
    set((state) => ({
      workExperience: state.workExperience.filter((_, i) => i !== index),
    })),

  setSkills: (skills) => set({ skills }),
  addSkill: (type, skill) =>
    set((state) => ({
      skills: {
        ...state.skills,
        [type]: [...state.skills[type], skill],
      },
    })),
  removeSkill: (type, index) =>
    set((state) => ({
      skills: {
        ...state.skills,
        [type]: state.skills[type].filter((_, i) => i !== index),
      },
    })),

  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),
  updateProject: (index, project) =>
    set((state) => ({
      projects: state.projects.map((item, i) => (i === index ? project : item)),
    })),
  removeProject: (index) =>
    set((state) => ({
      projects: state.projects.filter((_, i) => i !== index),
    })),

  setCertifications: (certifications) => set({ certifications }),
  addCertification: (cert) =>
    set((state) => ({
      certifications: [...state.certifications, cert],
    })),
  removeCertification: (index) =>
    set((state) => ({
      certifications: state.certifications.filter((_, i) => i !== index),
    })),

  setJobDescription: (jd) => set({ jobDescription: jd }),
  setGeneratedResume: (resume) => set({ generatedResume: resume }),

  clearAll: () =>
    set({
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        countryId: "",
        location: "",
        photo: "",
        linkedin: "",
        github: "",
        portfolio: "",
        summary: "",
      },
      education: [],
      workExperience: [],
      skills: { technical: [], soft: [] },
      projects: [],
      certifications: [],
      jobDescription: "",
      generatedResume: null,
    }),
}));

// Hydrate from localStorage on client side
if (typeof window !== "undefined") {
  const savedState = localStorage.getItem("resume-storage");
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      useResumeStore.setState(parsedState);
    } catch (e) {
      console.error("Failed to parse resume storage:", e);
    }
  }

  // Subscribe to changes and save to localStorage
  useResumeStore.subscribe((state) => {
    const { _hasHydrated, setHasHydrated, ...stateToSave } = state;
    localStorage.setItem("resume-storage", JSON.stringify(stateToSave));
  });
}

export default useResumeStore;
