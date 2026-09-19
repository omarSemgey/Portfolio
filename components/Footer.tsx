function getCurrentYear() {
  return new Date().getFullYear()
}

export default function Footer() {
  return (
    <footer className="border-t border-surface bg-main text-muted">
      <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-center sm:text-left">
          &copy; {getCurrentYear()} Omar. All rights reserved.
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
          <a href="https://github.com/omarSemgey" target="_blank" rel="noreferrer" className="hover:text-default transition-colors">
            GitHub
          </a>
          <a href="mailto:your-email@example.com" className="hover:text-default transition-colors">
            Mail
          </a>
          <a href="/resume.pdf" download className="text-accent hover:underline transition-all font-semibold">
            Download Resume
          </a>
        </div>
      </div>
    </footer>
  )
}