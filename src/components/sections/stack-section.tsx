import Image from "next/image";
import { Section } from "../section";
import { Reveal } from "../reveal";
import { DOMAINS, STACK } from "@/data/stack";

/**
 * Marks that are near-black and disappear on the dark ground. Both are
 * monochrome, so CSS inversion is safe and avoids a second asset — the
 * component is server-rendered and cannot know the visitor's theme, so
 * swapping `src` is not an option.
 */
const DARK_MARKS = new Set(["nextdotjs", "express"]);

/**
 * One row per domain: index, name, the evidence line, then the tools.
 *
 * The previous version led with pills, which is what every portfolio does and
 * says nothing. The domain blurbs are specific and earned, so they lead.
 */
export function StackSection() {
  return (
    <Section
      id="stack"
      label="Stack"
      title="What I build with"
      intro="Grouped by where it sits in the system, front to storefront to server."
    >
      {DOMAINS.map((domain, index) => (
        <Reveal key={domain.id} delay={index * 40}>
          <div className="stack__group">
            <p className="stack__index">{String(index + 1).padStart(2, "0")}</p>
            <div>
              <h3 className="stack__group-name">{domain.label}</h3>
              <p className="stack__evidence">{domain.blurb}</p>
              <ul className="tags">
                {STACK.filter((item) => item.domain === domain.id).map((item) => (
                  <li key={item.name} className="tag">
                    {item.icon ? (
                      <Image
                        src={`/logos/${item.icon}.svg`}
                        alt=""
                        width={13}
                        height={13}
                        unoptimized
                        aria-hidden="true"
                        data-dark-mark={
                          DARK_MARKS.has(item.icon) ? "" : undefined
                        }
                      />
                    ) : null}
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      ))}
    </Section>
  );
}
