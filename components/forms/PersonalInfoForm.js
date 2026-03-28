"use client";

import useResumeStore from "@/store/resumeStore";

export default function PersonalInfoForm({
  showSummary = true,
  errors = {},
  countries = [],
  states = [],
}) {
  const { personalInfo, setPersonalInfo } = useResumeStore();

  const inputClassName =
    "w-full rounded-xl border px-4 py-3 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-primary-500 focus:border-primary-500";
  const errorClassName =
    "border-red-300 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-200";
  const selectClassName =
    "w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22 stroke=%22%236B7280%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m6 8 4 4 4-4%22/%3E%3C/svg%3E')] bg-[length:1rem] bg-[position:right_0.85rem_center] bg-no-repeat";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value,
      ...(name === "countryId" ? { stateId: "", pincode: "" } : null),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={personalInfo.fullName}
            onChange={handleChange}
            className={`${inputClassName} ${errors.fullName ? errorClassName : "border-gray-300"}`}
            placeholder="John Doe"
            pattern="^[A-Za-z][A-Za-z\s.'-]*$"
            title="Use letters, spaces, apostrophes, hyphens, and periods only."
          />
          {errors.fullName ? (
            <p className="mt-2 text-xs text-red-600">{errors.fullName}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={personalInfo.email}
            onChange={handleChange}
            readOnly
            className={`${inputClassName} bg-gray-50 text-gray-600 cursor-not-allowed ${errors.email ? errorClassName : "border-gray-200"}`}
            placeholder="john@example.com"
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            title="Enter a valid email address."
          />
          {errors.email ? (
            <p className="mt-2 text-xs text-red-600">{errors.email}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={personalInfo.phone}
            onChange={handleChange}
            className={`${inputClassName} ${errors.phone ? errorClassName : "border-gray-300"}`}
            placeholder="+1 (555) 123-4567"
            inputMode="tel"
            pattern="^[+]?[0-9\s().-]+$"
            title="Enter a valid phone number."
          />
          {errors.phone ? (
            <p className="mt-2 text-xs text-red-600">{errors.phone}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Country *
          </label>
          <select
            id="country"
            name="countryId"
            value={personalInfo.countryId || ""}
            onChange={handleChange}
            className={`${selectClassName} ${errors.country ? errorClassName : "border-gray-300"}`}
          >
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country ? (
            <p className="mt-2 text-xs text-red-600">{errors.country}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="stateId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            State / Province *
          </label>
          <select
            id="stateId"
            name="stateId"
            value={personalInfo.stateId || ""}
            onChange={handleChange}
            className={`${selectClassName} ${errors.stateId ? errorClassName : "border-gray-300"}`}
            disabled={!personalInfo.countryId}
          >
            <option value="">
              {personalInfo.countryId
                ? "Select state / province"
                : "Select country first"}
            </option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.stateId ? (
            <p className="mt-2 text-xs text-red-600">{errors.stateId}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="pincode"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Pincode / Postal Code
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={personalInfo.pincode || ""}
            onChange={handleChange}
            className={`${inputClassName} ${errors.pincode ? errorClassName : "border-gray-300"}`}
            placeholder="110001"
            pattern="^[A-Za-z0-9\s-]{3,12}$"
            title="Enter a valid postal code."
          />
          {errors.pincode ? (
            <p className="mt-2 text-xs text-red-600">{errors.pincode}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="linkedin"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            LinkedIn Profile
          </label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={personalInfo.linkedin}
            onChange={handleChange}
            className={`${inputClassName} ${errors.linkedin ? errorClassName : "border-gray-300"}`}
            placeholder="https://linkedin.com/in/johndoe"
            pattern="^https?:\/\/(www\.)?linkedin\.com\/.*$"
            title="Enter a valid LinkedIn profile URL."
          />
          {errors.linkedin ? (
            <p className="mt-2 text-xs text-red-600">{errors.linkedin}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="github"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            GitHub Profile
          </label>
          <input
            type="url"
            id="github"
            name="github"
            value={personalInfo.github}
            onChange={handleChange}
            className={`${inputClassName} ${errors.github ? errorClassName : "border-gray-300"}`}
            placeholder="https://github.com/johndoe"
            pattern="^https?:\/\/(www\.)?github\.com\/.*$"
            title="Enter a valid GitHub profile URL."
          />
          {errors.github ? (
            <p className="mt-2 text-xs text-red-600">{errors.github}</p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="portfolio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Portfolio Website
          </label>
          <input
            type="url"
            id="portfolio"
            name="portfolio"
            value={personalInfo.portfolio}
            onChange={handleChange}
            className={`${inputClassName} ${errors.portfolio ? errorClassName : "border-gray-300"}`}
            placeholder="https://johndoe.com"
            pattern="^https?:\/\/.*$"
            title="Enter a valid website URL."
          />
          {errors.portfolio ? (
            <p className="mt-2 text-xs text-red-600">{errors.portfolio}</p>
          ) : null}
        </div>

        {showSummary ? (
          <div className="md:col-span-2">
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Professional Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              value={personalInfo.summary}
              onChange={handleChange}
              rows="4"
              className={`${inputClassName} ${errors.summary ? errorClassName : "border-gray-300"}`}
              placeholder="Brief professional summary highlighting your key achievements and goals..."
              maxLength={500}
            />
            {errors.summary ? (
              <p className="mt-2 text-xs text-red-600">{errors.summary}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
