import "@testing-library/jest-dom/vitest";

/** jsdom has no ResizeObserver; @react-three/fiber Canvas requires it. */
globalThis.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
};
