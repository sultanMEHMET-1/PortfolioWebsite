import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/motion";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resume — Mehmet Mercan",
    description: "View my professional resume and qualifications.",
};

export default function ResumePage(): ReactNode {
    return (
        <PageTransition>
            <main className="flex min-h-[calc(100vh-4rem)] flex-col pt-24 pb-16">
                <Container className="flex h-full flex-col grow">
                    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Resume
                            </h1>
                            <p className="mt-2 text-lg text-muted">
                                My professional background and qualifications.
                            </p>
                        </div>
                        <Button
                            href="/resume.pdf"
                            download="Mehmet_Mercan_Resume.pdf"
                            variant="primary"
                            className="shrink-0"
                            aria-label="Download resume as PDF"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                                aria-hidden="true"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" x2="12" y1="15" y2="3" />
                            </svg>
                            Download PDF
                        </Button>
                    </div>

                    <div className="relative mt-4 flex grow flex-col overflow-hidden rounded-xl border border-border bg-surface/[0.02] shadow-sm">
                        {/* 
                            We use an object tag to embed the PDF.
                            It takes up the full remaining height.
                        */}
                        <object
                            data="/resume.pdf"
                            type="application/pdf"
                            className="h-[75vh] min-h-[600px] w-full grow md:h-[80vh]"
                            aria-label="Embedded Resume PDF Viewer"
                        >
                            {/* Fallback content for when the browser doesn't support PDF embedding (e.g. mobile Safari) */}
                            <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-8 text-center">
                                <FileTextIcon className="mb-4 h-12 w-12 text-muted" aria-hidden="true" />
                                <h2 className="mb-2 text-xl font-semibold text-foreground">
                                    PDF Viewer not supported
                                </h2>
                                <p className="mb-6 max-w-md text-muted">
                                    Your browser doesn't seem to support embedded PDFs, or you're on a mobile device. No worries, you can still view it by downloading the file below!
                                </p>
                                <Button
                                    href="/resume.pdf"
                                    download="Mehmet_Mercan_Resume.pdf"
                                    variant="secondary"
                                >
                                    Download Resume
                                </Button>
                            </div>
                        </object>
                    </div>
                </Container>
            </main>
        </PageTransition>
    );
}

function FileTextIcon({ className, "aria-hidden": ariaHidden }: { readonly className?: string; readonly "aria-hidden"?: boolean | "true" | "false" }): ReactNode {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden={ariaHidden}
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
    );
}
