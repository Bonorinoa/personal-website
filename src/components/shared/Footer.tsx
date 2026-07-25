export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="px-5 sm:px-10 lg:px-16 pt-10 sm:pt-14 pb-6 sm:pb-8">
      <p className="text-[10px] uppercase tracking-[0.28em] text-ink/40 font-mono">
        © {year} Augusto González-Bonorino
      </p>
    </footer>
  );
}
