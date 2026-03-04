"use client";

import { useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import { duration, ease } from "@/components/motion/tokens";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { getAllTags, filterAndSearchProjects } from "@/lib/filters";
import type { ProjectItem } from "@/content/types";
import type { ReactNode } from "react";

interface ProjectGridProps {
    readonly projects: readonly ProjectItem[];
}

export function ProjectGrid({ projects }: ProjectGridProps): ReactNode {
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { reducedMotion } = useMotion();

    gsap.registerPlugin(ScrollTrigger);

    const allTags = getAllTags(projects);
    const filtered = filterAndSearchProjects(projects, activeTags, searchQuery);

    useLayoutEffect(() => {
        if (reducedMotion) return;
        const ctx = gsap.context(() => {
            const images = gsap.utils.toArray<HTMLElement>('.parallax-image');
            images.forEach((img) => {
                gsap.to(img, {
                    yPercent: 20,
                    ease: "none",
                    scrollTrigger: {
                        trigger: img.parentElement,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, [filtered, reducedMotion]);

    const toggleTag = useCallback((tag: string) => {
        setActiveTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
        );
    }, []);

    const clearFilters = useCallback(() => {
        setActiveTags([]);
        setSearchQuery("");
    }, []);

    return (
        <Section id="projects">
            <Container>
                <ScrollReveal>
                    <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
                        Projects
                    </h2>
                </ScrollReveal>

                {/* Filters */}
                <ScrollReveal delay={0.1}>
                    <div className="mb-8 space-y-4">
                        {/* Search */}
                        <div className="relative max-w-sm">
                            <input
                                type="search"
                                placeholder="Search projects…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                                aria-label="Search projects by name"
                            />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by technology">
                            {allTags.map((tag) => (
                                <Tag
                                    key={tag}
                                    variant="accent"
                                    active={activeTags.includes(tag)}
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                </Tag>
                            ))}
                            {(activeTags.length > 0 || searchQuery) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-xs text-muted underline underline-offset-2 hover:text-foreground"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Grid */}
                <LayoutGroup>
                    <div ref={containerRef}>
                        <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence mode="popLayout">
                                {filtered.map((project) => (
                                    <StaggerItem key={project.id}>
                                        <motion.div
                                            layout={!reducedMotion}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{
                                                duration: duration.base,
                                                ease: ease.standard,
                                            }}
                                        >
                                            <Card
                                                hover
                                                onClick={() => setSelectedProject(project)}
                                                className="h-full flex flex-col cursor-pointer overflow-hidden p-0"
                                            >
                                                <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                                                    <div
                                                        className="parallax-image absolute -top-[20%] left-0 h-[140%] w-full bg-cover bg-center"
                                                        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1618042164219-62c420f04023?w=600&h=400&fit=crop&q=80)` }}
                                                    />
                                                </div>
                                                <div className="flex flex-col flex-1 p-6">
                                                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                                                        {project.name}
                                                    </h3>
                                                    <p className="mb-4 text-sm leading-relaxed text-muted line-clamp-3">
                                                        {project.description}
                                                    </p>
                                                    <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                                                        {project.tech.map((t) => (
                                                            <Tag key={t}>{t}</Tag>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    </StaggerItem>
                                ))}
                            </AnimatePresence>
                        </StaggerChildren>
                    </div>
                </LayoutGroup>

                {filtered.length === 0 && (
                    <p className="mt-8 text-center text-muted">
                        No projects match your filters.{" "}
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-accent underline underline-offset-2"
                        >
                            Clear filters
                        </button>
                    </p>
                )}

                {/* Project Detail Drawer */}
                <ProjectDetail
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            </Container>
        </Section>
    );
}

/* ── ProjectDetail ── */

interface ProjectDetailProps {
    readonly project: ProjectItem | null;
    readonly onClose: () => void;
}

function ProjectDetail({ project, onClose }: ProjectDetailProps): ReactNode {
    const { reducedMotion } = useMotion();

    useEffect(() => {
        if (!project) return;
        const handleKey = (e: KeyboardEvent): void => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [project, onClose]);

    // Lock body scroll when detail is open
    useEffect(() => {
        if (project) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [project]);

    return (
        <AnimatePresence>
            {project && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: duration.fast }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-neutral-950/50"
                        onClick={onClose}
                        aria-hidden
                    />

                    {/* Detail panel */}
                    <motion.div
                        className="relative z-10 mx-4 w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface p-6 shadow-2xl sm:max-h-[85vh] sm:rounded-2xl"
                        initial={reducedMotion ? {} : { y: 40, opacity: 0 }}
                        animate={reducedMotion ? {} : { y: 0, opacity: 1 }}
                        exit={reducedMotion ? {} : { y: 40, opacity: 0 }}
                        transition={{ duration: duration.base, ease: ease.emphasized }}
                        role="dialog"
                        aria-label={`Project: ${project.name}`}
                        aria-modal="true"
                    >
                        <div className="mb-4 flex items-start justify-between">
                            <h3 className="text-2xl font-bold text-foreground">
                                {project.name}
                            </h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:text-foreground"
                                aria-label="Close project details"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                >
                                    <line x1="3" y1="3" x2="13" y2="13" />
                                    <line x1="13" y1="3" x2="3" y2="13" />
                                </svg>
                            </button>
                        </div>

                        <p className="mb-4 text-sm leading-relaxed text-neutral-600">
                            {project.description}
                        </p>

                        {project.highlights.length > 0 && (
                            <div className="mb-4">
                                <h4 className="mb-2 text-sm font-semibold text-foreground">
                                    Highlights
                                </h4>
                                <ul className="space-y-1.5">
                                    {project.highlights.map((h, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 text-sm text-neutral-600"
                                        >
                                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mb-4 flex flex-wrap gap-1.5">
                            {project.tech.map((t) => (
                                <Tag key={t} variant="accent">
                                    {t}
                                </Tag>
                            ))}
                        </div>

                        {project.links.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {project.links.map((link) => (
                                    <a
                                        key={link.url}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-accent underline underline-offset-2 hover:text-accent-dark"
                                    >
                                        {link.label} ↗
                                    </a>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
