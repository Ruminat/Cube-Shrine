import { Fragment, type ReactNode } from "react";

type FooterLink = { readonly label: string; readonly href: string };
type FooterSite = { readonly name: string; readonly links: readonly FooterLink[] };

const EXTERNAL_REL = "noopener noreferrer";

const FOOTER_SITES: readonly FooterSite[] = [
  {
    name: "Cubing Cheat Sheet",
    links: [
      { label: "Home", href: "https://cubingcheatsheet.com" },
      { label: "OLL", href: "https://cubingcheatsheet.com/algs3x_oll.html" },
      { label: "PLL", href: "https://cubingcheatsheet.com/algs3x_pll.html" },
    ],
  },
  {
    name: "SpeedCubeDB",
    links: [
      { label: "3×3", href: "https://www.speedcubedb.com/a/3x3" },
      { label: "OLL", href: "https://www.speedcubedb.com/a/3x3/OLL" },
      { label: "PLL", href: "https://www.speedcubedb.com/a/3x3/PLL" },
    ],
  },
];

function renderExternalLink(link: FooterLink): ReactNode {
  return (
    <a
      className="text-primary underline-offset-2 transition-colors hover:text-primary/90 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      href={link.href}
      target="_blank"
      rel={EXTERNAL_REL}
    >
      {link.label}
    </a>
  );
}

function renderLinkRow(links: readonly FooterLink[]): ReactNode {
  return links.map((link, index) => (
    <Fragment key={link.href}>
      {index > 0 ? (
        <span className="select-none text-muted-foreground" aria-hidden>
          ·
        </span>
      ) : null}
      {renderExternalLink(link)}
    </Fragment>
  ));
}

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Useful sites</p>
          <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-6">
            {FOOTER_SITES.map((site) => (
              <div key={site.name} className="flex min-w-[min(100%,16rem)] flex-col gap-1">
                <p className="m-0 text-[0.9375rem] font-semibold text-foreground">{site.name}</p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-relaxed text-muted-foreground">
                  {renderLinkRow(site.links)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
