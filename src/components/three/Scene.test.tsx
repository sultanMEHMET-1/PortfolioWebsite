import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Scene } from "./Scene";
import * as webgl from "@/utils/webgl";
import { MotionProvider } from "@/components/motion/MotionProvider";

// Mock matchMedia for MotionProvider
const mockMatchMedia = (matches: boolean) => {
    return vi.fn().mockImplementation((query) => ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }));
};

describe("Scene Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should render fallback if WebGL is unsupported", () => {
        vi.spyOn(webgl, "isWebGLAvailable").mockReturnValue(false);
        window.matchMedia = mockMatchMedia(false);

        render(
            <MotionProvider>
                <Scene />
            </MotionProvider>
        );

        // The fallback container has aria-hidden
        const fallbacks = document.querySelectorAll(".w-64.h-64.rounded-full");
        expect(fallbacks.length).toBeGreaterThan(0);
    });

    it("should render fallback if user prefers reduced motion", () => {
        vi.spyOn(webgl, "isWebGLAvailable").mockReturnValue(true);
        window.matchMedia = mockMatchMedia(true);

        render(
            <MotionProvider>
                <Scene />
            </MotionProvider>
        );

        const fallbacks = document.querySelectorAll(".w-64.h-64.rounded-full");
        expect(fallbacks.length).toBeGreaterThan(0);
    });

    it("should render canvas if WebGL is supported and no reduced motion", () => {
        vi.spyOn(webgl, "isWebGLAvailable").mockReturnValue(true);
        window.matchMedia = mockMatchMedia(false);

        render(
            <MotionProvider>
                <Scene />
            </MotionProvider>
        );

        // Should not render the fallback
        const fallbacks = document.querySelectorAll(".w-64.h-64.rounded-full");
        expect(fallbacks.length).toBe(0);
    });
});
