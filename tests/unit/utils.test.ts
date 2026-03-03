import { describe, it, expect } from "vitest";
import { formatDate, formatDateRange } from "@/lib/utils";

describe("formatDate", () => {
    it("formats year-month strings correctly", () => {
        expect(formatDate("2023-01")).toBe("Jan 2023");
        expect(formatDate("2022-12")).toBe("Dec 2022");
        expect(formatDate("2021-06")).toBe("Jun 2021");
    });

    it("returns 'Present' for null or undefined", () => {
        expect(formatDate(null)).toBe("Present");
        expect(formatDate(undefined)).toBe("Present");
    });

    it("handles year-only strings", () => {
        expect(formatDate("2023")).toBe("2023");
    });

    it("handles empty string", () => {
        expect(formatDate("")).toBe("Present");
    });
});

describe("formatDateRange", () => {
    it("formats a complete range", () => {
        expect(formatDateRange("2022-03", "2023-09")).toBe("Mar 2022 – Sep 2023");
    });

    it("formats range with no end date as Present", () => {
        expect(formatDateRange("2023-01", null)).toBe("Jan 2023 – Present");
    });
});
