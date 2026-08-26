import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="footer">
      <span className="footer__gradient" aria-hidden="true" />
      <span className="grain" aria-hidden="true" />
      <p className="label">
        © {new Date().getFullYear()} {site.name}
      </p>
      <p className="label">{site.role}</p>
    </footer>
  );
}
