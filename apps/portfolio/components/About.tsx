export default function About() {
  return (
    <section id="about" className="py-24 border-t border-border">
      <div className="container mx-auto px-6 max-w-4xl">
        <span className="font-mono text-xs text-accent uppercase tracking-widest mb-2 block">
          // about me
        </span>
        <h2 className="text-3xl font-bold tracking-tight mb-8">Who I Am</h2>
        <div className="max-w-2xl space-y-4 text-text-secondary text-[0.95rem] leading-relaxed">
          <p>
            I&apos;m a frontend engineer who thrives at the intersection of engineering precision and
            user experience. With 4+ years of experience, I specialise in building scalable,
            performant web platforms using{" "}
            <strong className="text-text-primary">Next.js, React, and TypeScript</strong>.
          </p>
          <p>
            At Airtel Payments Bank — India&apos;s #1 payments bank and a{" "}
            <strong className="text-text-primary">Fortune Fintech Innovator Asia 2024</strong> — I&apos;ve
            architected systems that directly serve over 100 million users, optimised Core Web
            Vitals, driven measurable SEO and analytics outcomes, and led the migration of legacy
            apps into modern, maintainable architectures.
          </p>
          <p>
            I care about clean code, measurable outcomes, and shipping things that actually reach
            people.
          </p>
        </div>
      </div>
    </section>
  );
}
