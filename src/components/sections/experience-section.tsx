import { Section } from "../section";
import { Reveal } from "../reveal";
import { EXPERIENCE } from "@/data/experience";

/** A single dotted timeline — the standard CV shape, scannable top to bottom. */
export function ExperienceSection() {
  return (
    <Section
      id="experience"
      label="Experience"
      title="Where I've worked"
      intro="Four years across agency and product teams, from eCommerce builds to full-stack feature ownership."
    >
      <ol className="timeline">
        {EXPERIENCE.map((role, index) => (
          <li key={`${role.organisation}-${role.period}`} className="timeline__item">
            <Reveal delay={index * 40}>
              <p className="label">{role.period}</p>
              <h3 className="timeline__role">
                {role.title} <span className="timeline__org">· {role.organisation}</span>
              </h3>
              <p className="timeline__desc">{role.description}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
