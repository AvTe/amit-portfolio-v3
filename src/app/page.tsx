import { Hero } from "@/components/hero";
import { BrandRow } from "@/components/brand-row";
import { WorkSection } from "@/components/sections/work-section";
import { StackSection } from "@/components/sections/stack-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandRow />
      <WorkSection />
      <StackSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
