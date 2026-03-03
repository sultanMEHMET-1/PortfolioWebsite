import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MotionProvider, useMotion } from "@/components/motion/MotionProvider";
import type { ReactNode } from "react";

function TestConsumer(): ReactNode {
    const { reducedMotion } = useMotion();
    return <p data-testid="motion-state">{reducedMotion ? "reduced" : "full"}</p>;
}

describe("MotionProvider", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("provides reducedMotion = false by default", () => {
        // Mock matchMedia to return matches: false
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        render(
            <MotionProvider>
                <TestConsumer />
            </MotionProvider>,
        );

        expect(screen.getByTestId("motion-state").textContent).toBe("full");
    });

    it("provides reducedMotion = true when prefers-reduced-motion matches", () => {
        // Mock matchMedia to return matches: true
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: true,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        render(
            <MotionProvider>
                <TestConsumer />
            </MotionProvider>,
        );

        expect(screen.getByTestId("motion-state").textContent).toBe("reduced");
    });
});
