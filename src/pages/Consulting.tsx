import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useWorld } from '@/hooks/useWorld';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { NomologicalNet } from '@/components/consulting/NomologicalNet';
import { DecisionForm } from '@/components/consulting/DecisionForm';
import { WRITING, NOTES } from '@/data/consulting';

const EASE = [0.16, 1, 0.3, 1] as const;

const kicker = 'font-mono text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--oxblood))]';

const Consulting = () => {
  useWorld('academic');

  return (
    <>
      <Helmet>
        <title>Consulting — Augusto González-Bonorino</title>
        <meta
          name="description"
          content="Independent review for a named decision: evaluating whether a system is fit to rely on, whether an intervention changed the outcome, and whether a score measures what the decision assumes."
        />
        <link rel="canonical" href="https://augusto-gonzalezbonorino.com/consulting" />
        <meta property="og:title" content="Consulting — Augusto González-Bonorino" />
        <meta
          property="og:description"
          content="Independent review for a named decision. Frozen tests, failure registers, and evidence packs another reviewer can rerun."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://augusto-gonzalezbonorino.com/consulting" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-8">
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-10 sm:mb-14"
          >
            <div className={kicker}>§ Independent review</div>
            <h1
              className="mt-5 font-serif font-medium leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 3.8rem)' }}
            >
              Consulting
            </h1>
            <p className="mt-5 font-serif italic text-lg sm:text-xl text-[hsl(var(--muted-ink))] max-w-2xl">
              Independent review for a named decision — what the evidence supports, where it breaks,
              and what another reviewer would find.
            </p>
          </motion.header>

          <NomologicalNet />

          {/* Writing rail */}
          <section className="mt-16 sm:mt-20 pt-8 border-t border-[hsl(var(--rule))]">
            <div className={kicker}>Also written</div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {WRITING.map((item) => (
                <article key={item.title}>
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--muted-ink))]">
                    {item.kind}
                  </div>
                  <h3 className="mt-2 font-serif text-lg font-medium leading-snug">
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="hover:text-[hsl(var(--oxblood))] transition-colors"
                    >
                      {item.title}
                    </a>
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[hsl(var(--muted-ink))]">
                    {item.blurb}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 sm:mt-20 pt-8 border-t border-[hsl(var(--rule))]">
            <div className={kicker}>Start here</div>
            <div className="mt-6">
              <DecisionForm />
            </div>
          </section>

          {/* Notes — only when at least two real notes exist */}
          {NOTES.length >= 2 && (
            <section className="mt-16 sm:mt-20 pt-8 border-t border-[hsl(var(--rule))]">
              <div className={kicker}>On the work</div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {NOTES.slice(0, 2).map((note) => (
                  <figure key={note.name}>
                    <blockquote className="font-serif italic text-[16px] leading-relaxed text-foreground/90">
                      {note.quote}
                    </blockquote>
                    <figcaption className="mt-3 text-[13px] text-[hsl(var(--muted-ink))]">
                      {note.name} · {note.role}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Consulting;
