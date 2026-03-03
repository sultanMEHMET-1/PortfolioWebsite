import { buildMetadata } from "@/lib/seo";
import { PageTransition } from "@/components/motion";
import { ContactInfo } from "@/components/sections/ContactInfo";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = buildMetadata({
    title: "Contact",
    description: "Get in touch for opportunities and collaborations",
    path: "/contact",
});

export default function ContactPage(): ReactNode {
    return (
        <PageTransition>
            <ContactInfo />
        </PageTransition>
    );
}
