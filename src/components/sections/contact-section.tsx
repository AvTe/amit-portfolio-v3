import { Section } from "../section";
import { ContactHeadline } from "../contact-headline";
import { site } from "@/lib/site";

/** One email, set large, plus the three links worth following. */
export function ContactSection() {
  return (
    <Section
      id="contact"
      label="Contact"
      title={<ContactHeadline />}
      intro="MERN, Shopify, headless commerce. Available immediately — email is the fastest route, and I reply within a day."
      pad="lg"
    >
      <a href={`mailto:${site.email}`} className="contact__email">
        {site.email}
      </a>

      <div className="contact__links">
        <a href={site.socials.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={site.socials.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={site.socials.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href={site.resume} download>
          Download CV
        </a>
        <a href={site.socials.whatsapp} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <a href={`tel:${site.phone}`}>{site.phone}</a>
      </div>

      <p className="label mt-6">{site.location}</p>
    </Section>
  );
}
