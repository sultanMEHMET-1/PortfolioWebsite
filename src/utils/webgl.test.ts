import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isWebGLAvailable } from './webgl';

describe('isWebGLAvailable', () => {
    let originalWindow: typeof window | undefined;

    beforeEach(() => {
        originalWindow = global.window;
    });

    afterEach(() => {
        if (originalWindow) {
            global.window = originalWindow;
        }
        vi.restoreAllMocks();
    });

    it('should return false if window is undefined', () => {
        // @ts-expect-error testing missing window
        delete global.window;
        expect(isWebGLAvailable()).toBe(false);
    });

    it('should return true if WebGL context is supported', () => {
        const mockGetContext = vi.fn().mockReturnValue({});

        global.window = {
            WebGLRenderingContext: true,
        } as unknown as Window & typeof globalThis;

        const mockCreateElement = vi.spyOn(document, 'createElement');
        mockCreateElement.mockReturnValue({
            getContext: mockGetContext,
        } as unknown as HTMLCanvasElement);

        expect(isWebGLAvailable()).toBe(true);
        expect(mockGetContext).toHaveBeenCalledWith('webgl');
    });

    it('should return false if WebGL content is not supported', () => {
        const mockGetContext = vi.fn().mockImplementation((_contextId) => {
            // Simulate no context returning null
            return null;
        });

        global.window = {
            WebGLRenderingContext: true,
        } as unknown as Window & typeof globalThis;

        const mockCreateElement = vi.spyOn(document, 'createElement');
        mockCreateElement.mockReturnValue({
            getContext: mockGetContext,
        } as unknown as HTMLCanvasElement);

        expect(isWebGLAvailable()).toBe(false);
        expect(mockGetContext).toHaveBeenCalledWith('webgl');
        expect(mockGetContext).toHaveBeenCalledWith('experimental-webgl');
    });

    it('should return false if window.WebGLRenderingContext is missing', () => {
        global.window = {} as unknown as Window & typeof globalThis;
        expect(isWebGLAvailable()).toBe(false);
    });
});
