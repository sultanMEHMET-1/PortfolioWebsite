import { describe, it, expect } from "vitest";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { education } from "@/content/education";
import { skills } from "@/content/skills";

describe("content data validation", () => {
    describe("profile", () => {
        it("has required fields", () => {
            expect(profile.name).toBeTruthy();
            expect(typeof profile.name).toBe("string");
            expect(profile.headline).toBeTruthy();
            expect(profile.contactLinks).toBeInstanceOf(Array);
            expect(profile.contactLinks.length).toBeGreaterThan(0);
        });

        it("contact links have valid structure", () => {
            for (const link of profile.contactLinks) {
                expect(link.platform).toBeTruthy();
                expect(link.url).toBeTruthy();
                expect(link.label).toBeTruthy();
            }
        });
    });

    describe("experience", () => {
        it("is an array", () => {
            expect(experience).toBeInstanceOf(Array);
        });

        it("each item has required fields", () => {
            for (const item of experience) {
                expect(item.id).toBeTruthy();
                expect(item.company).toBeTruthy();
                expect(item.title).toBeTruthy();
                expect(item.startDate).toBeTruthy();
                expect(item.highlights).toBeInstanceOf(Array);
            }
        });
    });

    describe("projects", () => {
        it("is an array", () => {
            expect(projects).toBeInstanceOf(Array);
        });

        it("each item has required fields", () => {
            for (const item of projects) {
                expect(item.id).toBeTruthy();
                expect(item.name).toBeTruthy();
                expect(item.description).toBeTruthy();
                expect(item.tech).toBeInstanceOf(Array);
            }
        });

        it("project IDs are unique", () => {
            const ids = projects.map((p) => p.id);
            expect(new Set(ids).size).toBe(ids.length);
        });
    });

    describe("education", () => {
        it("is an array", () => {
            expect(education).toBeInstanceOf(Array);
        });

        it("each item has required fields", () => {
            for (const item of education) {
                expect(item.id).toBeTruthy();
                expect(item.school).toBeTruthy();
                expect(item.degree).toBeTruthy();
            }
        });
    });

    describe("skills", () => {
        it("is an array with at least one group", () => {
            expect(skills).toBeInstanceOf(Array);
            expect(skills.length).toBeGreaterThan(0);
        });

        it("each group has a name and at least one skill", () => {
            for (const group of skills) {
                expect(group.groupName).toBeTruthy();
                expect(group.skills).toBeInstanceOf(Array);
                expect(group.skills.length).toBeGreaterThan(0);
            }
        });
    });
});
