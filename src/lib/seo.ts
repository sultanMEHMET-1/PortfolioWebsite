import type { Metadata } from "next";
import { profile } from "@/content/profile";

const siteUrl = "https://mehmetmercan.tech";

interface SeoOptions {
    readonly title?: string;
    readonly description?: string;
    readonly path?: string;
}

export function buildMetadata(options: SeoOptions = {}): Metadata {
    const title = options.title
        ? `${options.title} | ${profile.name}`
        : `${profile.name} — Portfolio`;
    const description =
        options.description ?? profile.headline ?? "Personal portfolio website";
    const url = `${siteUrl}${options.path ?? ""}`;

    return {
        title,
        description,
        metadataBase: new URL(siteUrl),
        openGraph: {
            title,
            description,
            url,
            siteName: profile.name,
            type: "website",
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: url,
        },
    };
}
