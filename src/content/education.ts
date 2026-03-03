import type { EducationItem } from "./types";

export const education: readonly EducationItem[] = [
    {
        id: "purdue",
        school: "Purdue University",
        degree: "Bachelor's degree, Computer Science (Honors College), Minors: ECE, Math",
        startDate: "2023",
        endDate: "2027",
        highlights: [
            "Focus: Digital Design, Embedded Software Engineering",
        ],
    },
    {
        id: "syosset-hs",
        school: "Syosset High School",
        degree: "High School Diploma",
        startDate: "2019", // estimated based on FIRST Robotics from Sep 2019 - 2023
        endDate: "2023",
        highlights: [],
    },
];
