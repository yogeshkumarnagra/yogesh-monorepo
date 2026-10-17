import { experiences } from "@/lib/data";

function renderBullet(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-text-primary">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-24 border-t border-border">
      <div className="container mx-auto px-6 max-w-4xl">
        <span className="font-mono text-xs text-accent uppercase tracking-widest mb-2 block">
          // experience
        </span>
        <h2 className="text-3xl font-bold tracking-tight mb-10">Where I&apos;ve Worked</h2>

        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 md:p-8 hover:border-accent/40 hover:bg-card-hover transition-all"
            >
              {/* Header */}
              <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                <span className="font-bold text-lg">{exp.company}</span>
                <span className="font-mono text-xs text-text-muted bg-bg border border-border px-2 py-1 rounded">
                  {exp.period}
                </span>
              </div>
              <p className="text-accent-light text-sm mb-3">{exp.role}</p>

              {exp.badge && (
                <span className="inline-block bg-green/10 border border-green/20 text-green text-[0.7rem] font-mono px-2 py-0.5 rounded mb-4">
                  {exp.badge}
                </span>
              )}

              {/* Bullets */}
              <ul className="space-y-2.5">
                {exp.bullets.map((b, j) => (
                  <li
                    key={j}
                    className="text-text-secondary text-sm pl-4 relative leading-relaxed"
                  >
                    <span className="absolute left-0 text-accent">▸</span>
                    {renderBullet(b)}
                  </li>
                ))}
              </ul>

              {/* Metric chips */}
              {exp.metrics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {exp.metrics.map((m, k) => (
                    <span
                      key={k}
                      className="bg-accent/10 border border-accent/25 text-accent-light text-[0.72rem] font-mono px-3 py-1 rounded-full"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
