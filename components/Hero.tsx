export default function Hero() {
    return (
        <section 
            id="hero" 
            className="relative bg-main min-h-[calc(100vh-64px)] flex items-center justify-center text-center overflow-hidden"
        >
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                <div className="absolute -top-10 -left-10 w-72 h-72 md:w-96 md:h-96 bg-primary/15 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-72 h-72 md:w-96 md:h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-screen-md mx-auto px-4 flex flex-col items-center justify-center w-full">
                
                <h1 className="text-4xl md:text-6xl font-bold text-default tracking-tight max-w-xl">
                    Full-Stack Web Developer.
                </h1>

                <p className="text-muted mt-6 max-w-md text-sm md:text-base leading-relaxed"> 
                    Building clean, high-performance web applications with robust backend logic and exceptional user experiences.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                
                    <a 
                        href="/resume.pdf" 
                        download 
                        className="bg-primary hover:bg-primary/90 text-default font-semibold px-8 py-3.5 rounded-md transition-colors text-sm tracking-wide shadow-md"
                    >
                        Download Resume
                    </a>

                    <a 
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=omar.semgey@gmail.com" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-surface hover:bg-surface/80 text-default font-medium px-8 py-3.5 rounded-md transition-colors text-sm tracking-wide border border-surface"
                    >
                        Email Me
                    </a>

                </div>

            </div>
        </section>
    );
}