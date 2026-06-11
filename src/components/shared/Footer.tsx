import { Github, Linkedin, ExternalLink } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="hairline-t mt-24 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-6 sm:gap-0 justify-between items-start sm:items-center text-xs text-muted-foreground">
        <p className="font-mono">
          © {year} Augusto González-Bonorino
        </p>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/Bonorinoa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/augustogbono/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <Linkedin className="w-3.5 h-3.5" /> LinkedIn
          </a>
          <a
            href="https://orcid.org/0000-0002-9355-0831"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" /> ORCID
          </a>
          <a
            href="mailto:agonz439@asu.edu"
            className="hover:text-foreground transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
