import type { Person } from "./types";

export const profile: Person = {
    name: "Mehmet Mercan",
    headline: "TODO: Add your professional headline from LinkedIn",
    location: "TODO: Add your location",
    summary:
        "TODO: Add your professional summary. Export your LinkedIn profile and paste the summary here.",
    contactLinks: [
        {
            platform: "LinkedIn",
            url: "https://www.linkedin.com/in/mehmet-mer/",
            label: "LinkedIn",
        },
        {
            platform: "Email",
            url: "mailto:TODO@example.com",
            label: "TODO@example.com",
        },
        // TODO: Add GitHub, Twitter, or other links
    ],
};
