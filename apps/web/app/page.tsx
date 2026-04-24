import { Header } from "@/components/header";
import { AlgorithmGallery } from "@/components/algorithm-gallery";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";

export function HomePage() {
  return (
    <div className='min-h-screen bg-background'>
      <Header />

      <main className='container mx-auto px-4 py-8'>
        <div className='mb-10 text-center'>
          <h1 className='text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl'>
            Master the CFOP Method
          </h1>

          <div className='mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2'>
            <div className='rounded-lg border border-border bg-card p-4'>
              <div className='mb-2 flex items-center justify-center gap-2'>
                <span className='h-3 w-3 rounded-full bg-yellow-500' />
                <span className='font-semibold text-foreground'>OLL</span>
              </div>
              <p className='text-sm text-muted-foreground'>Orientation of the last layer</p>
            </div>
            <div className='rounded-lg border border-border bg-card p-4'>
              <div className='mb-2 flex items-center justify-center gap-2'>
                <span className='h-3 w-3 rounded-full bg-blue-500' />
                <span className='font-semibold text-foreground'>PLL</span>
              </div>
              <p className='text-sm text-muted-foreground'>Permutation of the last layer</p>
            </div>
          </div>
        </div>

        <AlgorithmGallery />
      </main>

      <SiteFooter />
    </div>
  );
}

export default HomePage;
