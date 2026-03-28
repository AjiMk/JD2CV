"use client";

import { useEffect, useState } from "react";
import useResumeStore from "@/store/resumeStore";
import { FiPlus, FiTrash2, FiCheck, FiX } from "react-icons/fi";

const blankForm = {
  name: "",
  issuer: "",
  date: "",
  credentialId: "",
};

export default function CertificationsForm() {
  const { certifications, setCertifications } = useResumeStore();
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(blankForm);
  const [formError, setFormError] = useState("");
  const [saveState, setSaveState] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitMode, setSubmitMode] = useState("save");

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        const response = await fetch("/api/certifications", {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) return;

        const data = await response.json();
        setCertifications(
          Array.isArray(data.certifications) ? data.certifications : [],
        );
      } catch {
        setCertifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadCertifications();
  }, [setCertifications]);

  const inputClassName =
    "w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500";

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push("Certification name is required.");
    } else if (formData.name.trim().length < 2) {
      errors.push("Certification name must be at least 2 characters.");
    }

    if (!formData.issuer.trim()) {
      errors.push("Issuing organization is required.");
    } else if (formData.issuer.trim().length < 2) {
      errors.push("Issuing organization must be at least 2 characters.");
    }

    return errors;
  };

  const resetForm = () => {
    setFormData(blankForm);
    setEditing(null);
  };

  const persistCertifications = async (nextCertifications, successMessage) => {
    setCertifications(nextCertifications);

    const response = await fetch("/api/certifications", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        certifications: nextCertifications,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Unable to save certifications.");
    }

    const data = await response.json();
    setCertifications(data.certifications || []);
    setSaveState(successMessage);
  };

  const buildCertification = () => ({
    id:
      editing !== null
        ? certifications[editing]?.id || Date.now().toString()
        : Date.now().toString(),
    name: formData.name.trim(),
    issuer: formData.issuer.trim(),
    date: formData.date.trim(),
    credentialId: formData.credentialId.trim(),
  });

  const handleSave = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setFormError(errors.join(" "));
      return;
    }

    const nextCertification = buildCertification();
    const nextCertifications =
      editing !== null
        ? certifications.map((item, index) =>
            index === editing ? nextCertification : item,
          )
        : [...certifications, nextCertification];

    await persistCertifications(nextCertifications, "Certification saved.");
    if (editing === null) {
      resetForm();
    }
  };

  const handleAdd = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setFormError(errors.join(" "));
      return;
    }

    const nextCertification = buildCertification();
    const nextCertifications =
      editing !== null
        ? certifications.map((item, index) =>
            index === editing ? nextCertification : item,
          )
        : [...certifications, nextCertification];

    await persistCertifications(nextCertifications, "Certification saved.");
    resetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setSaveState("");

    try {
      const submitAction =
        event.nativeEvent?.submitter?.dataset?.action || "save";

      if (submitAction === "add") {
        await handleAdd();
        return;
      }

      await handleSave();
    } catch (error) {
      setFormError(error.message || "Unable to save certifications.");
    }
  };

  const handleEdit = (index, certification) => {
    setEditing(index);
    setFormData({
      name: certification.name || "",
      issuer: certification.issuer || "",
      date: certification.date || "",
      credentialId: certification.credentialId || "",
    });
    setFormError("");
    setSaveState("");
  };

  const handleRemove = async (index) => {
    const nextCertifications = certifications.filter(
      (_, currentIndex) => currentIndex !== index,
    );

    try {
      await persistCertifications(nextCertifications, "Certification removed.");
      if (editing === index) {
        resetForm();
      }
    } catch (error) {
      setFormError(error.message || "Unable to remove certification.");
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Certifications
        </h2>
        <p className="text-sm text-gray-500">Loading certifications...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Certifications</h2>

      {certifications.length > 0 && (
        <div className="mb-6 space-y-3">
          {certifications.map((cert, index) => (
            <div
              key={cert.id || `${cert.name}-${index}`}
              className="flex items-start justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:border-primary-300"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-gray-700">{cert.issuer}</p>
                <div className="mt-1 flex gap-4 text-sm text-gray-600">
                  {cert.date && <span>{cert.date}</span>}
                  {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(index, cert)}
                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                >
                  <FiCheck className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border-2 border-dashed border-gray-300 p-6"
      >
        <h3 className="mb-4 font-semibold text-gray-900">
          {editing !== null ? "Edit Certification" : "Add Certification"}
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Certification Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClassName}
              placeholder="AWS Certified Solutions Architect"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Issuing Organization *
            </label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={(e) =>
                setFormData({ ...formData, issuer: e.target.value })
              }
              className={inputClassName}
              placeholder="Amazon Web Services"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Issue Date
            </label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className={inputClassName}
              placeholder="Jan 2024"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Credential ID
            </label>
            <input
              type="text"
              name="credentialId"
              value={formData.credentialId}
              onChange={(e) =>
                setFormData({ ...formData, credentialId: e.target.value })
              }
              className={inputClassName}
              placeholder="ABC123XYZ"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            data-action="save"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
          >
            <FiCheck className="h-5 w-5" />
            Save
          </button>
          <button
            type="submit"
            data-action="add"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700"
          >
            <FiPlus className="h-5 w-5" />
            Add Certification
          </button>
          {editing !== null && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setFormError("");
                setSaveState("");
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiX className="h-5 w-5" />
              Cancel
            </button>
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
