/* ── Data model for all portfolio content ── */

export interface ContactLink {
    readonly platform: string;
    readonly url: string;
    readonly label: string;
}

export interface Person {
    readonly name: string;
    readonly headline: string;
    readonly location: string;
    readonly summary: string;
    readonly contactLinks: readonly ContactLink[];
    readonly avatarUrl?: string;
}

export interface ExperienceItem {
    readonly id: string;
    readonly company: string;
    readonly title: string;
    readonly startDate: string;
    readonly endDate: string | null;
    readonly location: string;
    readonly highlights: readonly string[];
}

export interface ProjectItem {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly tech: readonly string[];
    readonly links: readonly { readonly label: string; readonly url: string }[];
    readonly highlights: readonly string[];
    readonly image?: string;
    readonly featured?: boolean;
}

export interface EducationItem {
    readonly id: string;
    readonly school: string;
    readonly degree: string;
    readonly startDate?: string | null;
    readonly endDate?: string | null;
    readonly highlights: readonly string[];
}

export interface SkillGroup {
    readonly groupName: string;
    readonly skills: readonly string[];
}

export interface PostItem {
    readonly id: string;
    readonly title: string;
    readonly date: string;
    readonly url: string;
    readonly summary: string;
}

export interface AwardItem {
    readonly id: string;
    readonly title: string;
    readonly issuer: string;
    readonly date: string;
    readonly description: string;
}
