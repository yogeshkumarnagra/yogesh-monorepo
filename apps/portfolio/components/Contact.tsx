import { profile } from "@/lib/data";

const contacts = [
  { icon: "✉️", label: "Email", value: "yogeshkumar.98129@gmail.com", href: `mailto:${profile.email}` },
  { icon: "💼", label: "LinkedIn", value: "linkedin.com/in/yogesh-kumar", href: profile.linkedin },
  { icon: "🐙", label: "GitHub", value: "github.com/yogesh-kumar", href: profile.github },
  { icon: "📱", label: "Phone", value: "+91 98129 77961", href: `tel:${profile.phone}` },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 border-t border-border">
      <div className="container mx-auto px-6 max-w-4xl">
        <span className="font-mono text-xs text-accent uppercase tracking-widest mb-2 block">
          // contact
        </span>
        <h2 className="text-3xl font-bold tracking-tight mb-3">Get In Touch</h2>
        <p className="text-text-secondary text-sm mb-8 max-w-md">
          Open to Senior Frontend / SDE II–III roles at product companies. Feel free to reach out.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {contacts.map((c, i) => (
            <a
              key={i}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="bg-card border border-border rounded-xl p-5 flex flex-col items-center gap-2 text-text-secondary hover:border-accent hover:text-accent-light transition-all text-center"
            >
              <span className="text-2xl">{c.icon}</span>
              <span className="font-mono text-[0.68rem] uppercase tracking-widest">{c.label}</span>
              <span className="text-[0.75rem] break-all">{c.value}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
