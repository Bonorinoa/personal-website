import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useWorld } from '@/hooks/useWorld';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { NomologicalNet } from '@/components/consulting/NomologicalNet';
import { DecisionForm } from '@/components/consulting/DecisionForm';
import { INTRO, NOTES, WHAT_YOU_GET, WRITING } from '@/data/consulting';

const kicker = 'font-mono text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--oxblood))]';

const TITLE = 'Methods review | Augusto Gonzalez-Bonorino';
const META_DESCRIPTION =
  'A second look at the evidence behind a decision: which measures your assumptions allow, the range of answers the data supports, and what to collect next.';
const SOCIAL_DESCRIPTION =
  "Before you act on a number: what the evidence supports, what it doesn't, and what to collect next.";
const URL = 'https://augusto-gonzalezbonorino.com/consulting';
const OG_IMAGE = 'https://augusto-gonzalezbonorino.com/og-image.jpg';

const Consulting = () => {
  useWorld('academic');
  const showNotes = NOTES.length >= 2;

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={SOCIAL_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={SOCIAL_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-8">
          <header>
            <div className={kicker}>§ Independent review</div>
            <h1
              className="mt-5 font-serif font-medium leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 3.8rem)' }}
            >
              Methods review
            </h1>
            <p className="mt-5 max-w-3xl font-serif text-lg italic leading-relaxed text-[hsl(var(--muted-ink))] sm:text-xl">
              Independent review at three stages of an empirical pipeline — criteria <em>frozen before the result</em>, so the finding is one you can act on.
            </p>
          </header>

          <p className="mt-8 mb-3 max-w-[60ch] font-serif text-[15px] text-[hsl(var(--muted-ink))]">{INTRO}</p>

          <NomologicalNet />

          <section className="mt-10 border-t border-[hsl(var(--rule))] pt-6">
            <div className={kicker}>What you get</div>
            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
              {WHAT_YOU_GET.map((item) => (
                <div key={item.id}>
                  <div className="font-mono text-[11px] tracking-[0.2em] text-[hsl(var(--oxblood))]">{item.id}</div>
                  <div className="mt-2 font-serif text-[17px] font-medium">{item.title}</div>
                  <p className="mt-1 text-[14px] leading-relaxed text-[hsl(var(--muted-ink))]">{item.line}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 border-y border-[hsl(var(--rule))] py-9 sm:mt-16 sm:py-11">
            <div className={kicker}>How I work</div>
            <blockquote className="mt-4 max-w-3xl font-serif text-xl italic leading-relaxed sm:text-2xl">
              “It is useless to quantify uncertainty without a strategy to reduce it.”
            </blockquote>
          </section>

          {showNotes && (
            <section className="mt-14">
              <div className={kicker}>Notes from clients</div>
              <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
                {NOTES.map((note) => (
                  <figure key={note.name + note.quote} className="border-l-2 border-[hsl(var(--oxblood)/0.6)] pl-5">
                    <blockquote className="font-serif text-[17px] italic leading-relaxed">“{note.quote}”</blockquote>
                    <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--muted-ink))]">
                      {[note.name, note.role, note.stage].filter(Boolean).join(' · ')}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

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
                  <p className="mt-2 text-[14px] leading-relaxed text-[hsl(var(--muted-ink))]">{item.blurb}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="mt-14 font-serif text-[15px] text-[hsl(var(--muted-ink))]">
            Augusto Gonzalez-Bonorino is an economist (ASU) and the author of cvprofiles.{' '}
            <Link
              to="/academic"
              className="text-[hsl(var(--oxblood))] underline decoration-[hsl(var(--oxblood)/0.35)] underline-offset-4 hover:decoration-[hsl(var(--oxblood))]"
            >
              Resume →
            </Link>
          </p>

          <section id="decision" className="mt-8 scroll-mt-20 border-t border-[hsl(var(--rule))] pt-8">
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
