export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="px-5 sm:px-10 lg:px-16 pt-6 sm:pt-8 pb-4 sm:pb-6">
      <p className="text-[10px] uppercase tracking-[0.28em] text-ink/40 font-mono">
        © {year} Augusto González-Bonorino
      </p>
    </footer>
  );
}
