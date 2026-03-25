import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { SharedCanvas } from "./SharedCanvas";
import * as webgl from "@/utils/webgl";
import { MotionProvider } from "@/components/motion/MotionProvider";

const mockMatchMedia = (matches: boolean) => {
    return vi.fn().mockImplementation((query: string) => ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }));
};

describe("SharedCanvas", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders nothing when WebGL is unsupported", async () => {
        vi.spyOn(webgl, "isWebGLAvailable").mockReturnValue(false);
        window.matchMedia = mockMatchMedia(false);

        render(
            <MotionProvider>
                <SharedCanvas bloom={false}>
                    <mesh />
                </SharedCanvas>
            </MotionProvider>
        );

        await waitFor(() => {
            expect(document.querySelector("canvas")).toBeNull();
        });
    });

    it("renders nothing when user prefers reduced motion", async () => {
        vi.spyOn(webgl, "isWebGLAvailable").mockReturnValue(true);
        window.matchMedia = mockMatchMedia(true);

        render(
            <MotionProvider>
                <SharedCanvas bloom={false}>
                    <mesh />
                </SharedCanvas>
            </MotionProvider>
        );

        await waitFor(() => {
            expect(document.querySelector("canvas")).toBeNull();
        });
    });

    it("renders canvas when WebGL is supported and reduced motion is off", async () => {
        vi.spyOn(webgl, "isWebGLAvailable").mockReturnValue(true);
        window.matchMedia = mockMatchMedia(false);

        render(
            <MotionProvider>
                <SharedCanvas bloom={false}>
                    <mesh />
                </SharedCanvas>
            </MotionProvider>
        );

        await waitFor(() => {
            expect(document.querySelector("canvas")).toBeInTheDocument();
        });
    });
});
