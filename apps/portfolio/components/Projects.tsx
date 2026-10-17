import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="py-24 border-t border-border">
      <div className="container mx-auto px-6 max-w-4xl">
        <span className="font-mono text-xs text-accent uppercase tracking-widest mb-2 block">
          // projects
        </span>
        <h2 className="text-3xl font-bold tracking-tight mb-10">Things I&apos;ve Built</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 hover:border-accent/40 hover:-translate-y-1 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="font-semibold text-[0.95rem]">{p.name}</span>
                <div className="flex gap-2">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted border border-border text-[0.72rem] px-2 py-0.5 rounded hover:border-accent hover:text-accent-light transition-all"
                    >
                      Live ↗
                    </a>
                  )}
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted border border-border text-[0.72rem] px-2 py-0.5 rounded hover:border-accent hover:text-accent-light transition-all"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                {p.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((s, j) => (
                  <span
                    key={j}
                    className="bg-accent/10 border border-accent/20 text-accent-light font-mono text-[0.68rem] px-2 py-0.5 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
