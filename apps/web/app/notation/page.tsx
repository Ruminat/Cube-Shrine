import { Header } from "@/components/header";
import { NotationGallery } from "@/components/notation-gallery";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { MARKETING_HERO_TITLE_CLASS } from "@/lib/marketing-hero-title-class";

export function NotationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h1 className={MARKETING_HERO_TITLE_CLASS}>Cube Notation</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
            Every atomic move supported by the engine — face turns, slices, wide moves, and whole-cube rotations.
            Each group shows the plain, prime, and double variants (for example R, R&apos;, R2).
          </p>
        </div>

        <NotationGallery />
      </main>

      <SiteFooter />
    </div>
  );
}

export default NotationPage;
