import { Hero } from "@/components/sections/Hero";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { SkillsMatrix } from "@/components/sections/SkillsMatrix";
import { EducationList } from "@/components/sections/EducationList";
import { ContactInfo } from "@/components/sections/ContactInfo";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import { education } from "@/content/education";
import type { ReactNode } from "react";

export default function HomePage(): ReactNode {
  return (
    <>
      <Hero />
      <ExperienceTimeline items={experience} />
      <ProjectGrid projects={projects} />
      <SkillsMatrix groups={skills} />
      <EducationList items={education} />
      <ContactInfo />
    </>
  );
}
