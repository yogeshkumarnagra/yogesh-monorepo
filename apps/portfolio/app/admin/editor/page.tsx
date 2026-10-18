"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ResumeData {
  _meta: { version: number; lastUpdated: string; publishedAt: string };
  profile: {
    name: string; role: string; tagline: string; location: string;
    email: string; phone: string; linkedin: string; github: string;
    available: boolean; bio: string;
  };
  stats: { number: string; label: string }[];
  experiences: {
    company: string; role: string; period: string; location: string;
    badge: string | null; bullets: string[]; metrics: string[];
  }[];
  skills: { name: string; items: string[] }[];
  projects: {
    name: string; description: string; stack: string[];
    liveUrl: string | null; githubUrl: string | null;
  }[];
  education: { institution: string; degree: string; period: string; location: string }[];
}

interface Backup { filename: string; timestamp: string }

type Tab = "profile" | "experience" | "skills" | "projects" | "education";

// ─── Helper components ────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-text-muted uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors";
const textareaCls = `${inputCls} resize-none`;

// ─── Main Editor ─────────────────────────────────────────────────────────────
export default function EditorPage() {
  const router = useRouter();
  const [resume, setResume]     = useState<ResumeData | null>(null);
  const [backups, setBackups]   = useState<Backup[]>([]);
  const [activeTab, setTab]     = useState<Tab>("profile");
  const [status, setStatus]     = useState<"idle" | "saving" | "publishing" | "loading" | "error">("loading");
  const [message, setMsg]       = useState("");
  const [showBackups, setShowBackups] = useState(false);

  // ── Load resume on mount ──
  useEffect(() => {
    fetch("/api/resume")
      .then(r => r.json())
      .then(({ resume, backups }) => {
        setResume(resume);
        setBackups(backups ?? []);
        setStatus("idle");
      })
      .catch(() => {
        setStatus("error");
        setMsg("Failed to load resume data");
      });
  }, []);

  // ── Save / Publish ──
  const save = useCallback(async (action: "save" | "publish") => {
    if (!resume) return;
    setStatus(action === "publish" ? "publishing" : "saving");
    setMsg("");
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data: resume }),
      });
      const d = await res.json();
      if (res.ok) {
        setMsg(`✓ ${action === "publish" ? "Published" : "Saved"} — version ${d.version} · backup: ${d.backupCreated}`);
        setResume(r => r ? { ...r, _meta: { ...r._meta, version: d.version } } : r);
        // Refresh backup list
        fetch("/api/resume").then(r => r.json()).then(({ backups }) => setBackups(backups ?? []));
      } else {
        if (res.status === 401) { router.push("/admin"); return; }
        setMsg(`✗ Error: ${d.error}`);
      }
    } catch {
      setMsg("✗ Network error");
    } finally {
      setStatus("idle");
    }
  }, [resume, router]);

  // ── Restore backup ──
  async function restoreBackup(filename: string) {
    if (!confirm(`Restore backup "${filename}"? Current data will be backed up first.`)) return;
    setStatus("loading");
    const res = await fetch(`/api/resume/backup?file=${encodeURIComponent(filename)}`);
    const d = await res.json();
    if (res.ok) {
      setResume(d.resume);
      setMsg(`✓ Restored from ${filename}`);
      setShowBackups(false);
    } else {
      setMsg(`✗ ${d.error}`);
    }
    setStatus("idle");
  }

  // ── Logout ──
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  }

  // ── Helpers to update nested state ──
  const setProfile = (k: string, v: string | boolean) =>
    setResume(r => r ? { ...r, profile: { ...r.profile, [k]: v } } : r);

  const setStat = (i: number, k: "number" | "label", v: string) =>
    setResume(r => {
      if (!r) return r;
      const stats = [...r.stats];
      stats[i] = { ...stats[i], [k]: v };
      return { ...r, stats };
    });

  const setExpField = (ei: number, k: string, v: string | string[] | null) =>
    setResume(r => {
      if (!r) return r;
      const experiences = [...r.experiences];
      experiences[ei] = { ...experiences[ei], [k]: v };
      return { ...r, experiences };
    });

  if (status === "loading" || !resume) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-secondary font-mono text-sm animate-pulse">Loading resume data...</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "profile",    label: "Profile",    icon: "👤" },
    { key: "experience", label: "Experience", icon: "💼" },
    { key: "skills",     label: "Skills",     icon: "⚡" },
    { key: "projects",   label: "Projects",   icon: "🚀" },
    { key: "education",  label: "Education",  icon: "🎓" },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-text-muted hover:text-text-secondary text-xs font-mono transition-colors">← Portfolio</a>
          <span className="text-border">|</span>
          <span className="font-mono text-xs text-accent">// Resume Editor</span>
          <span className="text-xs text-text-muted font-mono">v{resume._meta.version}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBackups(!showBackups)}
            className="text-xs font-mono border border-border text-text-secondary hover:border-accent hover:text-accent-light px-3 py-1.5 rounded-lg transition-all"
          >
            🗂 Backups ({backups.length})
          </button>
          <button
            onClick={() => save("save")}
            disabled={status !== "idle"}
            className="text-xs font-medium bg-card border border-border hover:border-accent text-text-primary px-4 py-1.5 rounded-lg transition-all disabled:opacity-50"
          >
            {status === "saving" ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => save("publish")}
            disabled={status !== "idle"}
            className="text-xs font-medium bg-accent hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg transition-all disabled:opacity-50"
          >
            {status === "publishing" ? "Publishing..." : "🚀 Publish"}
          </button>
          <button onClick={logout} className="text-xs text-text-muted hover:text-red-400 transition-colors px-2">
            Logout
          </button>
        </div>
      </header>

      {/* ── Status message ── */}
      {message && (
        <div className={`px-6 py-2.5 text-xs font-mono border-b ${message.startsWith("✓") ? "bg-green/10 border-green/20 text-green" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
          {message}
        </div>
      )}

      {/* ── Backup panel ── */}
      {showBackups && (
        <div className="border-b border-border bg-card px-6 py-4">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">Previous Versions</p>
          {backups.length === 0 ? (
            <p className="text-text-muted text-sm">No backups yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {backups.map(b => (
                <button
                  key={b.filename}
                  onClick={() => restoreBackup(b.filename)}
                  className="text-xs font-mono border border-border text-text-secondary hover:border-accent hover:text-accent-light px-3 py-1.5 rounded-lg transition-all"
                  title={`Restore: ${b.filename}`}
                >
                  ↩ {b.filename.replace("resume-", "").replace(".json", "")}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* ── Meta info ── */}
        <div className="flex gap-4 text-xs font-mono text-text-muted mb-6 flex-wrap">
          <span>Last saved: {new Date(resume._meta.lastUpdated).toLocaleString()}</span>
          <span>·</span>
          <span>Published: {new Date(resume._meta.publishedAt).toLocaleString()}</span>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg transition-all font-medium
                ${activeTab === t.key
                  ? "bg-accent text-white"
                  : "bg-card border border-border text-text-secondary hover:border-accent hover:text-text-primary"
                }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Profile & Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name">
                <input className={inputCls} value={resume.profile.name} onChange={e => setProfile("name", e.target.value)} />
              </Field>
              <Field label="Role / Title">
                <input className={inputCls} value={resume.profile.role} onChange={e => setProfile("role", e.target.value)} />
              </Field>
              <Field label="Tagline">
                <input className={inputCls} value={resume.profile.tagline} onChange={e => setProfile("tagline", e.target.value)} />
              </Field>
              <Field label="Location">
                <input className={inputCls} value={resume.profile.location} onChange={e => setProfile("location", e.target.value)} />
              </Field>
              <Field label="Email">
                <input className={inputCls} type="email" value={resume.profile.email} onChange={e => setProfile("email", e.target.value)} />
              </Field>
              <Field label="Phone">
                <input className={inputCls} value={resume.profile.phone} onChange={e => setProfile("phone", e.target.value)} />
              </Field>
              <Field label="LinkedIn URL">
                <input className={inputCls} value={resume.profile.linkedin} onChange={e => setProfile("linkedin", e.target.value)} />
              </Field>
              <Field label="GitHub URL">
                <input className={inputCls} value={resume.profile.github} onChange={e => setProfile("github", e.target.value)} />
              </Field>
            </div>
            <Field label="Bio / Summary">
              <textarea className={textareaCls} rows={4} value={resume.profile.bio} onChange={e => setProfile("bio", e.target.value)} />
            </Field>
            <div className="flex items-center gap-3">
              <input
                type="checkbox" id="available"
                checked={resume.profile.available}
                onChange={e => setProfile("available", e.target.checked)}
                className="accent-accent w-4 h-4"
              />
              <label htmlFor="available" className="text-sm text-text-secondary">
                Show &quot;Available for roles&quot; badge
              </label>
            </div>

            <hr className="border-border" />
            <h2 className="text-lg font-semibold">Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resume.stats.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputCls + " w-28 flex-shrink-0 font-mono text-accent-light"}
                    value={s.number}
                    onChange={e => setStat(i, "number", e.target.value)}
                    placeholder="100M+"
                  />
                  <input
                    className={inputCls}
                    value={s.label}
                    onChange={e => setStat(i, "label", e.target.value)}
                    placeholder="Label"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EXPERIENCE TAB ── */}
        {activeTab === "experience" && (
          <div className="space-y-8">
            <h2 className="text-lg font-semibold">Work Experience</h2>
            {resume.experiences.map((exp, ei) => (
              <div key={ei} className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-accent uppercase tracking-widest">
                    Experience {ei + 1}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Company">
                    <input className={inputCls} value={exp.company} onChange={e => setExpField(ei, "company", e.target.value)} />
                  </Field>
                  <Field label="Role">
                    <input className={inputCls} value={exp.role} onChange={e => setExpField(ei, "role", e.target.value)} />
                  </Field>
                  <Field label="Period">
                    <input className={inputCls} value={exp.period} onChange={e => setExpField(ei, "period", e.target.value)} />
                  </Field>
                  <Field label="Location">
                    <input className={inputCls} value={exp.location} onChange={e => setExpField(ei, "location", e.target.value)} />
                  </Field>
                </div>
                <Field label="Badge (optional)">
                  <input className={inputCls} value={exp.badge ?? ""} onChange={e => setExpField(ei, "badge", e.target.value || null)} placeholder="e.g. Fortune Fintech Innovator Asia 2024" />
                </Field>
                <Field label="Bullet Points (one per line, use **text** for bold)">
                  <textarea
                    className={textareaCls}
                    rows={8}
                    value={exp.bullets.join("\n")}
                    onChange={e => setExpField(ei, "bullets", e.target.value.split("\n"))}
                  />
                </Field>
                <Field label="Metric Chips (comma separated)">
                  <input
                    className={inputCls}
                    value={exp.metrics.join(", ")}
                    onChange={e => setExpField(ei, "metrics", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                    placeholder="100M+ MTU, 8B+ Transactions/yr, ..."
                  />
                </Field>
              </div>
            ))}
          </div>
        )}

        {/* ── SKILLS TAB ── */}
        {activeTab === "skills" && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold">Skills</h2>
            {resume.skills.map((cat, ci) => (
              <div key={ci} className="bg-card border border-border rounded-xl p-5 space-y-3">
                <Field label="Category Name">
                  <input
                    className={inputCls}
                    value={cat.name}
                    onChange={e => setResume(r => {
                      if (!r) return r;
                      const skills = [...r.skills];
                      skills[ci] = { ...skills[ci], name: e.target.value };
                      return { ...r, skills };
                    })}
                  />
                </Field>
                <Field label="Skills (comma separated)">
                  <input
                    className={inputCls}
                    value={cat.items.join(", ")}
                    onChange={e => setResume(r => {
                      if (!r) return r;
                      const skills = [...r.skills];
                      skills[ci] = { ...skills[ci], items: e.target.value.split(",").map(s => s.trim()).filter(Boolean) };
                      return { ...r, skills };
                    })}
                  />
                </Field>
              </div>
            ))}
          </div>
        )}

        {/* ── PROJECTS TAB ── */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Projects</h2>
            {resume.projects.map((proj, pi) => (
              <div key={pi} className="bg-card border border-border rounded-xl p-5 space-y-3">
                <span className="font-mono text-xs text-accent uppercase tracking-widest">Project {pi + 1}</span>
                <Field label="Project Name">
                  <input className={inputCls} value={proj.name} onChange={e => setResume(r => {
                    if (!r) return r;
                    const projects = [...r.projects];
                    projects[pi] = { ...projects[pi], name: e.target.value };
                    return { ...r, projects };
                  })} />
                </Field>
                <Field label="Description">
                  <textarea className={textareaCls} rows={3} value={proj.description} onChange={e => setResume(r => {
                    if (!r) return r;
                    const projects = [...r.projects];
                    projects[pi] = { ...projects[pi], description: e.target.value };
                    return { ...r, projects };
                  })} />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Stack (comma separated)">
                    <input className={inputCls} value={proj.stack.join(", ")} onChange={e => setResume(r => {
                      if (!r) return r;
                      const projects = [...r.projects];
                      projects[pi] = { ...projects[pi], stack: e.target.value.split(",").map(s => s.trim()).filter(Boolean) };
                      return { ...r, projects };
                    })} />
                  </Field>
                  <Field label="Live URL">
                    <input className={inputCls} value={proj.liveUrl ?? ""} onChange={e => setResume(r => {
                      if (!r) return r;
                      const projects = [...r.projects];
                      projects[pi] = { ...projects[pi], liveUrl: e.target.value || null };
                      return { ...r, projects };
                    })} placeholder="https://..." />
                  </Field>
                  <Field label="GitHub URL">
                    <input className={inputCls} value={proj.githubUrl ?? ""} onChange={e => setResume(r => {
                      if (!r) return r;
                      const projects = [...r.projects];
                      projects[pi] = { ...projects[pi], githubUrl: e.target.value || null };
                      return { ...r, projects };
                    })} placeholder="https://github.com/..." />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── EDUCATION TAB ── */}
        {activeTab === "education" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Education</h2>
            {resume.education.map((edu, di) => (
              <div key={di} className="bg-card border border-border rounded-xl p-6 space-y-4">
                <span className="font-mono text-xs text-accent uppercase tracking-widest">
                  Degree {di + 1}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Institution">
                    <input className={inputCls} value={edu.institution} onChange={e => setResume(r => {
                      if (!r) return r;
                      const education = [...r.education];
                      education[di] = { ...education[di], institution: e.target.value };
                      return { ...r, education };
                    })} />
                  </Field>
                  <Field label="Degree">
                    <input className={inputCls} value={edu.degree} onChange={e => setResume(r => {
                      if (!r) return r;
                      const education = [...r.education];
                      education[di] = { ...education[di], degree: e.target.value };
                      return { ...r, education };
                    })} />
                  </Field>
                  <Field label="Period">
                    <input className={inputCls} value={edu.period} onChange={e => setResume(r => {
                      if (!r) return r;
                      const education = [...r.education];
                      education[di] = { ...education[di], period: e.target.value };
                      return { ...r, education };
                    })} />
                  </Field>
                  <Field label="Location">
                    <input className={inputCls} value={edu.location} onChange={e => setResume(r => {
                      if (!r) return r;
                      const education = [...r.education];
                      education[di] = { ...education[di], location: e.target.value };
                      return { ...r, education };
                    })} />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
