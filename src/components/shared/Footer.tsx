import { Github, Linkedin, ExternalLink, Mail } from 'lucide-react';

const iconLink =
  'inline-flex items-center gap-1.5 hover:text-foreground transition-colors min-h-[44px] py-2';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="hairline-t mt-16 sm:mt-24 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center text-xs text-muted-foreground">
        <p className="font-mono">© {year} Augusto González-Bonorino</p>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-5 gap-y-1 w-full sm:w-auto">
          <a href="https://github.com/Bonorinoa" target="_blank" rel="noopener noreferrer" className={iconLink}>
            <Github className="w-3.5 h-3.5" /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/augustogbono/" target="_blank" rel="noopener noreferrer" className={iconLink}>
            <Linkedin className="w-3.5 h-3.5" /> LinkedIn
          </a>
          <a href="https://orcid.org/0000-0002-9355-0831" target="_blank" rel="noopener noreferrer" className={iconLink}>
            <ExternalLink className="w-3.5 h-3.5" /> ORCID
          </a>
          <a href="mailto:agonz439@asu.edu" className={iconLink}>
            <Mail className="w-3.5 h-3.5" /> Email
          </a>
        </div>
      </div>
    </footer>
  );
}

