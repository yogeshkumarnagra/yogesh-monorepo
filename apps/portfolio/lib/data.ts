export const profile = {
  name: "Yogesh Kumar",
  role: "Senior Frontend Engineer",
  tagline: "Next.js · React · TypeScript",
  bio: `I build high-performance, large-scale web applications for millions of users.
Currently engineering the frontend at Airtel Payments Bank — India's largest payments bank,
serving 100M+ monthly transacting users and processing 8 billion+ transactions annually.`,
  location: "Gurgaon, India",
  email: "yogeshkumar.98129@gmail.com",
  phone: "+91 98129 77961",
  linkedin: "https://linkedin.com/in/yogesh-kumar",
  github: "https://github.com/yogesh-kumar",
  available: true,
};

export const stats = [
  { number: "100M+", label: "Monthly Transacting Users" },
  { number: "8B+", label: "Annual Transactions" },
  { number: "39.4%", label: "Organic Traffic Growth" },
  { number: "~45%", label: "JS Bundle Reduction" },
  { number: "4+", label: "Years Experience" },
];

export const experiences = [
  {
    company: "Airtel Payments Bank Pvt. Ltd.",
    role: "Software Development Engineer II · Frontend",
    period: "Oct 2022 – Present",
    location: "Gurgaon, India",
    badge: "Fortune Fintech Innovator Asia 2024 · India's Largest Payments Bank",
    bullets: [
      "Spearheaded frontend architecture of the Next.js enterprise platform serving **100M+ monthly transacting users** and ₹3,207 Cr in FY26 revenue.",
      "Reduced client-side JavaScript bundle by **~45%** using Next.js Server Components, dynamic imports, and code-splitting.",
      "Improved First Contentful Paint (FCP) by **~40%** through SSR, lazy-loading, and Core Web Vitals optimisation.",
      "Frontend work contributed to **39.4% growth in organic clicks** and a **55% improvement in Google ranking positions** (pos. 14.1 → 6.3).",
      "Drove **73% growth in non-branded organic clicks** and **167% CTR improvement** via GTM + Google Analytics instrumentation.",
      "Engineered Prismic Slice Machine CMS workflow reducing feature delivery time by **30%**.",
      "Led migration of **5+ legacy Vanilla JS apps** into a unified React/TypeScript Monorepo.",
      "Delivered customer webviews — **Rewards Hub, Transparent Banking, WhatsApp Banking** — used by millions of active users.",
      "Designed OTP, KYC, and onboarding authentication flows for a platform processing **8B+ annual transactions**.",
      "Built an enterprise **UI component library** adopted across multiple distributed teams.",
    ],
    metrics: [
      "100M+ MTU",
      "8B+ Transactions/yr",
      "+39.4% Organic Clicks",
      "~45% JS Reduction",
      "+167% Generic CTR",
      "30% Faster Delivery",
      "55% Better Rankings",
    ],
  },
  {
    company: "Freelance Frontend Developer",
    role: "Frontend Developer · Remote",
    period: "Jun 2021 – Sep 2022",
    location: "Remote",
    badge: null,
    bullets: [
      "Built high-performance, responsive web applications for international clients using **React.js and TypeScript**.",
      "Integrated **Firebase** for serverless backend, real-time database, and authentication.",
      "Managed full project lifecycle — scoping, estimation, development, deployment — across 8+ client projects.",
    ],
    metrics: [],
  },
];

export const skillCategories = [
  {
    name: "Core Languages",
    skills: ["TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Python"],
  },
  {
    name: "Frameworks",
    skills: ["Next.js", "React.js", "Angular", "Redux Toolkit", "Context API"],
  },
  {
    name: "Styling & UI",
    skills: ["Tailwind CSS", "SCSS", "Material UI", "Storybook", "WCAG / a11y"],
  },
  {
    name: "Architecture",
    skills: ["Monorepo", "SSR / SSG", "Microfrontends", "Component Libraries"],
  },
  {
    name: "Tooling & DevOps",
    skills: ["Git", "Jenkins", "Nginx", "Kong Gateway", "Prismic CMS", "Firebase"],
  },
  {
    name: "Monitoring & Analytics",
    skills: ["Google Analytics", "GTM", "Grafana", "Kibana", "SEO", "Core Web Vitals"],
  },
];

export const projects = [
  {
    name: "Airtel Payments Bank Website",
    description:
      "Enterprise-grade Next.js web platform for India's largest payments bank. Serves 100M+ monthly transacting users. Architected SSR, CMS workflows, and authentication flows. Contributed to 39.4% organic traffic growth.",
    stack: ["Next.js", "TypeScript", "Prismic CMS", "GTM", "GA4", "SSR"],
    liveUrl: "https://www.airtel.in/bank",
    githubUrl: null,
  },
  {
    name: "AI Story Pipeline",
    description:
      "End-to-end AI-powered story generation pipeline. Generates story scripts, creates AI images per scene, synthesises narration audio, and assembles everything into a final video — fully automated.",
    stack: ["Python", "OpenAI", "FAL.ai", "ElevenLabs", "Next.js UI"],
    liveUrl: null,
    githubUrl: "https://github.com/yogesh-kumar",
  },
  {
    name: "Webview Platform — Rewards Hub",
    description:
      "Customer-facing React/TypeScript webview for the Airtel super-app ecosystem. Rewards Hub, Transparent Banking, and WhatsApp Banking — used by millions of active users monthly inside a unified Monorepo.",
    stack: ["React", "TypeScript", "Monorepo", "Grafana", "Kibana"],
    liveUrl: null,
    githubUrl: null,
  },
  {
    name: "Enterprise UI Component Library",
    description:
      "Internal UI library built with React, TypeScript, and Storybook. Adopted across multiple distributed development teams at Airtel Payments Bank. Enforces design-system consistency and reduces per-sprint component work.",
    stack: ["React", "TypeScript", "Storybook", "SCSS", "Tailwind"],
    liveUrl: null,
    githubUrl: null,
  },
];

export const education = {
  institution: "University of Delhi",
  degree: "B.Sc. Computer Science",
  period: "2017 – 2020",
  location: "Delhi, India",
};
