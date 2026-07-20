"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sectionIds: string[] = ['hero','skills', 'projects', 'contact'];

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
    };

    const handleSectionChange = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleSectionChange, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="bg-surface w-full sticky top-0 z-50 border-b border-accent/10">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        {/* Logo */}
        <div className="font-bold text-xl text-default">Omar Semgey</div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-muted rounded-md md:hidden hover:bg-main focus:outline-none focus:ring-2 focus:ring-default"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Navigation Links */}
        <div 
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`} 
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-surface rounded-lg bg-main md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent">
            <li>
              <Link
                href="/#hero" 
                className={`block py-2 px-3 md:p-0 transition-colors ${
                  activeSection === 'hero' ? 'text-default font-bold' : 'text-muted hover:text-default'
                }`}
                aria-current={activeSection === 'hero' ? 'page' : undefined}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/#skills" 
                className={`block py-2 px-3 md:p-0 transition-colors ${
                  activeSection === 'skills' ? 'text-default font-bold' : 'text-muted hover:text-default'
                }`}
              >
                Skills
              </Link>
            </li>
            <li>
              <Link
                href="/#projects" 
                className={`block py-2 px-3 md:p-0 transition-colors ${
                  activeSection === 'projects' ? 'text-default font-bold' : 'text-muted hover:text-default'
                }`}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/#contact" 
                className={`block py-2 px-3 md:p-0 transition-colors ${
                  activeSection === 'contact' ? 'text-default font-bold' : 'text-muted hover:text-default'
                }`}
              >
                Contact
              </Link>
            </li>
            <li>
              <a href="https://github.com/omarSemgey" target="_blank" rel="noreferrer" className="block py-2 px-3 text-muted hover:text-default md:p-0 transition-colors">
                Github
              </a>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}