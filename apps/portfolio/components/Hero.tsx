import { profile, stats } from "@/lib/data";

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-[60px] relative overflow-hidden"
    >
      {/* Glow background */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl">
        {/* Badge */}
        {profile.available && (
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5 text-xs font-mono text-accent-light mb-6">
            <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
            Available for Senior Frontend Roles
          </div>
        )}

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-3">
          {profile.name.split(" ")[0]}{" "}
          <span className="text-accent-light">{profile.name.split(" ")[1]}</span>
        </h1>

        <p className="text-lg md:text-xl text-text-secondary font-light mb-5">
          {profile.role} · {profile.tagline}
        </p>

        <p className="text-text-secondary max-w-xl leading-relaxed mb-8 text-sm md:text-base">
          I build high-performance, large-scale web applications for millions of users. Currently
          engineering the frontend at{" "}
          <strong className="text-text-primary">Airtel Payments Bank</strong> — India&apos;s largest
          payments bank, serving{" "}
          <strong className="text-text-primary">100M+ monthly transacting users</strong> and
          processing <strong className="text-text-primary">8 billion+ transactions annually</strong>.
        </p>

        <div className="flex gap-4 flex-wrap mb-16">
          <a
            href="#experience"
            className="bg-accent hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5"
          >
            View My Work
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="border border-border text-text-primary hover:border-accent hover:text-accent-light px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
          >
            Get In Touch
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 border border-border rounded-xl overflow-hidden">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-card px-4 py-5 text-center border-r border-b border-border last:border-r-0"
            >
              <span className="block text-2xl font-bold font-mono text-accent-light">
                {s.number}
              </span>
              <span className="text-[0.7rem] text-text-muted uppercase tracking-wider mt-1 block">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
