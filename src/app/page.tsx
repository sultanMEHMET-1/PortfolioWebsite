import { Hero } from "@/components/sections/Hero";
import { MetricsStrip } from "@/components/sections/MetricsStrip";
import { About } from "@/components/sections/About";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
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
      <MetricsStrip />
      <About />
      <ExperienceTimeline items={experience} />
      <ProcessTimeline />
      <ProjectGrid projects={projects} />
      <SkillsMatrix groups={skills} />
      <EducationList items={education} />
      <ContactInfo />
    </>
  );
}
