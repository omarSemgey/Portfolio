export default function Contact() {
    return (
        <section id="contact" className="border-t border-surface bg-main py-24 text-center">
            <div className="max-w-screen-md mx-auto px-4 flex flex-col items-center">
                
                <h2 className="text-4xl md:text-5xl font-bold text-default tracking-tight max-w-xl">
                    Let&#39;s build something great.
                </h2>

                <p className="text-muted mt-4 max-w-md text-sm md:text-base leading-relaxed"> 
                    Available for full-time software engineering roles, as well as freelance projects and technical collaborations.
                </p>

                <div className="mt-6 text-sm md:text-base text-muted font-medium">
                    <span>Phone / WhatsApp: </span>
                    <a 
                        href="https://wa.me/963934769422" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:underline ml-1 font-semibold transition-all"
                    >
                        +963 934 769 422
                    </a>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                
                    <a 
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=omar.semgey@gmail.com" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary hover:bg-primary/90 text-default font-semibold px-8 py-3.5 rounded-md transition-colors text-sm tracking-wide"
                    >
                        Email Me
                    </a>

                    <a 
                        href="/resume.pdf" 
                        download 
                        className="bg-surface hover:bg-surface/80 text-default font-medium px-8 py-3.5 rounded-md transition-colors text-sm tracking-wide border border-surface"
                    >
                        Download Resume
                    </a>

                </div>

            </div>
        </section>
    );
}