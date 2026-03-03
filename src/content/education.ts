import type { EducationItem } from "./types";

export const education: readonly EducationItem[] = [
    {
        id: "purdue",
        school: "Purdue University",
        degree: "Bachelor's degree, Computer Science (Honors College), Minors: ECE, Math",
        endDate: "2027",
        highlights: [
            "GPA: 4.0",
            "Focus: Digital Design, Embedded Software Engineering",
            "Relevant Coursework: Discrete Math, Object Oriented Programming, Programming in C, Linear Algebra, Statistical Methods",
        ],
    },
    {
        id: "syosset-hs",
        school: "Syosset High School",
        degree: "High School Diploma",
        highlights: [],
    },
];
