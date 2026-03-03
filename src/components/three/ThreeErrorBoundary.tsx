"use client";

import { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ThreeErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.warn("WebGL/Three.js rendered error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none aria-hidden">
                    <div className="w-64 h-64 border-[1px] border-foreground rounded-full rotate-45 transform skew-x-12 skew-y-12" />
                </div>
            );
        }

        return this.props.children;
    }
}
