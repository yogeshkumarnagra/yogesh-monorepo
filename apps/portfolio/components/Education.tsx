import { education } from "@/lib/data";

export default function Education() {
  return (
    <section id="education" className="py-24 border-t border-border">
      <div className="container mx-auto px-6 max-w-4xl">
        <span className="font-mono text-xs text-accent uppercase tracking-widest mb-2 block">
          // education
        </span>
        <h2 className="text-3xl font-bold tracking-tight mb-10">Education</h2>

        <div className="space-y-4">
          {education.map((edu, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl px-6 py-5 flex flex-wrap justify-between items-start gap-3 hover:border-accent/40 transition-all"
            >
              <div>
                <p className="font-semibold text-text-primary">{edu.institution}</p>
                <p className="text-accent-light text-sm mt-0.5">{edu.degree}</p>
                <p className="text-text-muted text-xs mt-1 font-mono">{edu.location}</p>
              </div>
              <span className="font-mono text-xs text-text-muted bg-bg border border-border px-3 py-1 rounded-lg shrink-0">
                {edu.period}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
