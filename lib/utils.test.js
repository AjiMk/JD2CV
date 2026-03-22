import { describe, expect, it } from "vitest";
import { formatDate, isValidEmail, truncate } from "./utils";

describe("utils", () => {
  it("formats ISO dates into month year", () => {
    expect(formatDate("2024-01-15")).toBe("Jan 2024");
  });

  it("returns empty string for missing date", () => {
    expect(formatDate()).toBe("");
  });

  it("validates email addresses", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
  });

  it("truncates long text", () => {
    expect(truncate("hello world", 5)).toBe("hello...");
  });
});
