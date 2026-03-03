import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tag } from "@/components/ui/Tag";
import userEvent from "@testing-library/user-event";

describe("Tag", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("renders as a span when not clickable", () => {
        render(<Tag>TypeScript</Tag>);
        const el = screen.getByText("TypeScript");
        expect(el.tagName).toBe("SPAN");
    });

    it("renders as a button when onClick is provided", () => {
        const handler = vi.fn();
        render(<Tag onClick={handler}>React</Tag>);
        const el = screen.getByText("React");
        expect(el.tagName).toBe("BUTTON");
    });

    it("calls onClick when clicked", async () => {
        const user = userEvent.setup();
        const handler = vi.fn();
        render(<Tag onClick={handler}>React</Tag>);
        await user.click(screen.getByText("React"));
        expect(handler).toHaveBeenCalledOnce();
    });

    it("applies active styles when active", () => {
        render(<Tag active>Active Tag</Tag>);
        const el = screen.getByText("Active Tag");
        expect(el.className).toContain("bg-neutral-800");
    });

    it("applies default styles when not active", () => {
        render(<Tag>Default Tag</Tag>);
        const el = screen.getByText("Default Tag");
        expect(el.className).toContain("bg-neutral-100");
    });
});
