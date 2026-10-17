import { skillCategories } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="py-24 border-t border-border">
      <div className="container mx-auto px-6 max-w-4xl">
        <span className="font-mono text-xs text-accent uppercase tracking-widest mb-2 block">
          // skills
        </span>
        <h2 className="text-3xl font-bold tracking-tight mb-10">Tech Stack</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillCategories.map((cat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5">
              <h4 className="font-mono text-[0.72rem] uppercase tracking-widest text-text-muted mb-3">
                {cat.name}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, j) => (
                  <span
                    key={j}
                    className="bg-bg border border-border text-text-secondary font-mono text-[0.72rem] px-2 py-1 rounded hover:border-accent hover:text-accent-light transition-all cursor-default"
                  >
                    {skill}
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
