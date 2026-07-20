import Image from 'next/image';

export default function Skills() {
    const skills = [
        { name: "Laravel", type: "Backend", src: "/laravel.svg" },
        { name: "React", type: "Frontend", src: "/react.svg" },
        { name: "Next.js", type: "Frontend", src: "/next.svg" },
        { name: "Node.js", type: "Backend", src: "/node.svg" },
        { name: "PostgreSQL", type: "Database", src: "/postgresql.svg" },
        { name: "MySQL", type: "Database", src: "/mysql.svg" },
        { name: "Redis", type: "Caching", src: "/redis.svg" },
        { name: "Docker", type: "DevOps", src: "/docker.svg" },

    ];
    return (
        <section id="skills" className="border-t border-surface bg-main py-24">
            <div className="max-w-screen-md mx-auto px-4 text-center">
                
                <h2 className="text-3xl font-bold text-default tracking-tight">
                    Tech Stack
                </h2>
                <p className="text-muted mt-2 text-sm max-w-sm mx-auto">
                    Core tools I use to build robust full-stack applications.
                </p>

                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    {skills.map((skill) => (
                        <div 
                            key={skill.name} 
                            className="bg-surface border border-transparent rounded-xl p-5 flex flex-col items-center justify-center gap-4 hover:border-accent/30 transition-all duration-300 group cursor-default"
                        >
                            <div className="w-20 h-20 bg-main rounded-xl flex items-center justify-center p-3 group-hover:scale-105 transition-all duration-300 select-none">
                                <Image 
                                    src={skill.src} 
                                    alt={`${skill.name} logo`}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-contain"
                                    priority={true}
                                    draggable={false}
                                />
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-default text-sm font-semibold tracking-wide">
                                    {skill.name}
                                </span>
                                <span className="text-[10px] text-muted font-medium uppercase tracking-wider mt-0.5">
                                    {skill.type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}