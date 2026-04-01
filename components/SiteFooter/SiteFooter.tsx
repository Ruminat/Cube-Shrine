import { Fragment, type ReactNode } from "react";
import { Container } from "@/components/UI/Container/Container";
import styles from "./SiteFooter.module.scss";

type FooterLink = { readonly label: string; readonly href: string };
type FooterSite = { readonly name: string; readonly links: readonly FooterLink[] };

const EXTERNAL_REL = "noopener noreferrer";

const FOOTER_SITES: readonly FooterSite[] = [
  {
    name: "Cubing Cheat Sheet",
    links: [
      { label: "Home", href: "https://cubingcheatsheet.com" },
      { label: "OLL", href: "https://cubingcheatsheet.com/algs3x_oll.html" },
      { label: "PLL", href: "https://cubingcheatsheet.com/algs3x_pll.html" }
    ]
  },
  {
    name: "SpeedCubeDB",
    links: [
      { label: "3×3", href: "https://www.speedcubedb.com/a/3x3" },
      { label: "OLL", href: "https://www.speedcubedb.com/a/3x3/OLL" },
      { label: "PLL", href: "https://www.speedcubedb.com/a/3x3/PLL" }
    ]
  }
];

function renderExternalLink(link: FooterLink): ReactNode {
  return (
    <a className={styles.link} href={link.href} target="_blank" rel={EXTERNAL_REL}>
      {link.label}
    </a>
  );
}

function renderLinkRow(links: readonly FooterLink[]): ReactNode {
  return links.map((link, index) => (
    <Fragment key={link.href}>
      {index > 0 ? (
        <span className={styles.sep} aria-hidden>
          ·
        </span>
      ) : null}
      {renderExternalLink(link)}
    </Fragment>
  ));
}

function renderSiteBlock(site: FooterSite): ReactNode {
  return (
    <div key={site.name} className={styles.siteBlock}>
      <p className={styles.siteName}>{site.name}</p>
      <div className={styles.links}>{renderLinkRow(site.links)}</div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          <p className={styles.title}>Useful sites</p>
          <div className={styles.sites}>{FOOTER_SITES.map((site) => renderSiteBlock(site))}</div>
        </div>
      </Container>
    </footer>
  );
}
