import { Helmet } from 'react-helmet-async';
import { useWorld } from '@/hooks/useWorld';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { NomologicalNet } from '@/components/consulting/NomologicalNet';
import { DecisionForm } from '@/components/consulting/DecisionForm';
import { Button } from '@/components/ui/button';
import { WRITING } from '@/data/consulting';

const kicker = 'font-mono text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--oxblood))]';

const Consulting = () => {
  useWorld('academic');

  return (
    <>
      <Helmet>
        <title>Consulting — Augusto González-Bonorino</title>
        <meta
          name="description"
           content="Independent review across measurement, specification, and estimation—with criteria frozen before the result."
        />
        <link rel="canonical" href="https://augusto-gonzalezbonorino.com/consulting" />
        <meta property="og:title" content="Consulting — Augusto González-Bonorino" />
        <meta
          property="og:description"
           content="Independent review across measurement, specification, and estimation—with criteria frozen before the result."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://augusto-gonzalezbonorino.com/consulting" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-8">
          <header className="mb-10 sm:mb-14">
            <div className={kicker}>§ Independent review</div>
            <h1
              className="mt-5 font-serif font-medium leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 3.8rem)' }}
            >
              Consulting
            </h1>
            <p className="mt-5 max-w-3xl font-serif text-lg italic leading-relaxed text-[hsl(var(--muted-ink))] sm:text-xl">
              Independent review at three stages of an empirical pipeline — criteria <em>frozen before the result</em>, so the finding is one you can act on.
            </p>
          </header>

          <NomologicalNet />

          <div className="mt-7 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <Button asChild variant="link" className="h-auto rounded-none p-0 font-serif text-[16px] font-medium text-[hsl(var(--oxblood))] underline-offset-4">
              <a href="#decision">Describe a decision →</a>
            </Button>
            <span className="font-serif text-[14px] italic text-[hsl(var(--muted-ink))]">Twenty minutes. Deadline and cost of being wrong, not a pitch deck.</span>
          </div>

          <section className="mt-14 border-y border-[hsl(var(--rule))] py-9 sm:mt-16 sm:py-11">
            <div className={kicker}>How I work</div>
            <blockquote className="mt-4 max-w-3xl font-serif text-xl italic leading-relaxed sm:text-2xl">
              “It is useless to quantify uncertainty without a strategy to reduce it.”
            </blockquote>
          </section>

          {/* Writing rail */}
          <section className="mt-14 sm:mt-16">
            <div className={kicker}>Also written</div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {WRITING.map((item) => (
                <article key={item.title}>
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--muted-ink))]">
                    {item.kind}
                  </div>
                  <h3 className="mt-2 font-serif text-lg font-medium leading-snug">
                    {item.href === '#' ? (
                      <span>{item.title}</span>
                    ) : (
                      <a href={item.href} target="_blank" rel="noreferrer" className="hover:text-[hsl(var(--oxblood))] transition-colors">{item.title}</a>
                    )}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[hsl(var(--muted-ink))]">
                    {item.blurb}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section id="decision" className="mt-14 scroll-mt-20 border-t border-[hsl(var(--rule))] pt-8 sm:mt-16">
            <div className={kicker}>Start here</div>
            <div className="mt-6">
              <DecisionForm />
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
};

export default Consulting;
