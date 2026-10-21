import { achievements } from "@/lib/data";

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 border-t border-border">
      <div className="container mx-auto px-6 max-w-4xl">
        <span className="font-mono text-xs text-accent uppercase tracking-widest mb-2 block">
          // key achievements
        </span>
        <h2 className="text-3xl font-bold tracking-tight mb-10">Highlights</h2>

        <div className="space-y-3">
          {achievements.map((item, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl px-6 py-4 flex gap-4 items-start hover:border-accent/40 transition-all"
            >
              <span className="text-accent-light font-mono text-sm shrink-0 mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-text-secondary text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
