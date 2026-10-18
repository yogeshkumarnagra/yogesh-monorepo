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
  linkedin: "https://linkedin.com/in/yogesh-kumar-3a31aa21b",
  github: "https://github.com/yogesh-kumar",
  available: true,
};

export const stats = [
  { number: "100M+", label: "Monthly Transacting Users" },
  { number: "8B+",   label: "Annual Transactions" },
  { number: "39.4%", label: "Organic Traffic Growth" },
  { number: "~45%",  label: "JS Bundle Reduction" },
  { number: "4+",    label: "Years Experience" },
];

export const experiences = [
  {
    company: "Airtel Payments Bank Pvt. Ltd.",
    role: "Software Development Engineer II · Frontend",
    period: "Oct 2022 – Present",
    location: "Gurgaon, India",
    badge: "Fortune Fintech Innovator Asia 2024 · India's Largest Payments Bank",
    bullets: [
      "**Fraud Reporting Platform (14C / I4C Government Integration):** Owned frontend delivery of APB's fraud reporting integration with the Indian Cyber Crime Coordination Centre (I4C), enabling customers to raise cyber fraud complaints directly from the Airtel Thanks App.",
      "Built transaction listing, filtering, and selection workflows for eligible transactions spanning the previous six months, with a streamlined review and confirmation flow.",
      "Integrated secure APIs for sharing transaction metadata and customer KYC information with government fraud reporting systems.",
      "Implemented complaint acknowledgment and reference tracking, including seamless redirection between Airtel Payments Bank and I4C platforms.",
      "Instrumented comprehensive **Google Analytics** event tracking across the fraud reporting funnel for user-behaviour analysis and business reporting.",
      "Spearheaded frontend architecture of the **Next.js enterprise web platform** serving **100M+ monthly transacting users** and ₹3,207 Cr in FY26 revenue.",
      "Reduced client-side JavaScript bundle by **~45%** using Next.js Server Components, dynamic imports, and code-splitting.",
      "Improved First Contentful Paint (FCP) by **~40%** through SSR, lazy-loading, and Core Web Vitals optimisation.",
      "Frontend work contributed to **39.4% growth in organic clicks** and a **55% improvement in Google ranking positions** (pos. 14.1 → 6.3).",
      "Drove **73% growth in non-branded organic clicks** and **167% CTR improvement** via GTM + Google Analytics instrumentation.",
      "Engineered Prismic Slice Machine CMS workflow reducing feature delivery time by **30%**.",
      "Led migration of **5+ legacy Vanilla JS apps** into a unified React/TypeScript Monorepo, maximising code reuse.",
      "Delivered customer-facing WebView platforms — **Rewards Hub, Transparent Banking, WhatsApp Banking** — used by millions of active users.",
      "Built an enterprise-grade **UI component library** and utility suite, saving cross-functional teams dozens of engineering hours per sprint.",
      "Implemented robust application monitoring using **Grafana and Kibana** to capture runtime bugs and optimise frontend uptime.",
    ],
    metrics: [
      "100M+ MTU", "8B+ Transactions/yr", "+39.4% Organic Clicks",
      "~45% JS Reduction", "+167% Generic CTR", "30% Faster Delivery",
      "55% Better Rankings", "I4C Govt. Integration",
    ],
  },
  {
    company: "Freelance Frontend Developer",
    role: "Frontend Developer · Remote",
    period: "Jun 2021 – Sep 2022",
    location: "Remote",
    badge: null,
    bullets: [
      "Conceptualised and engineered high-performance responsive web applications for global clients using **React.js and TypeScript**.",
      "Built secure, serverless database integrations and real-time functions leveraging the **Firebase** ecosystem.",
      "Owned client engagement from technical scoping and effort estimation through to production deployment and final asset delivery.",
    ],
    metrics: [],
  },
];

export const skillCategories = [
  {
    name: "Core Languages",
    skills: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "Java (Basic)", "Python"],
  },
  {
    name: "Frameworks",
    skills: ["React.js", "Next.js (App Router)", "Angular", "Redux Toolkit", "Context API", "Storybook"],
  },
  {
    name: "Styling & UI",
    skills: ["Tailwind CSS", "SCSS", "Material UI", "Bootstrap", "Responsive Design", "Web Accessibility (a11y)"],
  },
  {
    name: "Tooling, DevOps & CMS",
    skills: ["Monorepo Architecture", "Git", "Bitbucket", "Jenkins", "Nginx", "Kong Gateway", "Prismic CMS", "Slice Machine"],
  },
  {
    name: "Monitoring & Analytics",
    skills: ["Google Analytics", "Google Tag Manager (GTM)", "Grafana", "Kibana", "SEO Optimization"],
  },
];

export const projects = [
  {
    name: "Airtel Payments Bank Website",
    description:
      "Enterprise-grade Next.js web platform for India's largest payments bank. Serves 100M+ monthly transacting users. Contributed to 39.4% organic traffic growth.",
    stack: ["Next.js", "TypeScript", "Prismic CMS", "GTM", "GA4", "SSR"],
    liveUrl: "https://www.airtel.in/bank",
    githubUrl: null,
  },
  {
    name: "Fraud Reporting Platform (14C / I4C)",
    description:
      "Government-integrated fraud reporting feature inside the Airtel Thanks App. Lets customers raise cyber fraud complaints with I4C — transaction selection, KYC transmission, and complaint tracking with full GA analytics.",
    stack: ["React", "TypeScript", "Google Analytics", "REST APIs", "Angular"],
    liveUrl: null,
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
      "Customer-facing React/TypeScript webview for the Airtel super-app. Rewards Hub, Transparent Banking, WhatsApp Banking — used by millions of active users monthly.",
    stack: ["React", "TypeScript", "Monorepo", "Grafana", "Kibana"],
    liveUrl: null,
    githubUrl: null,
  },
  {
    name: "Enterprise UI Component Library",
    description:
      "Internal UI library built with React, TypeScript, and Storybook. Adopted across multiple distributed teams at Airtel Payments Bank.",
    stack: ["React", "TypeScript", "Storybook", "SCSS", "Tailwind"],
    liveUrl: null,
    githubUrl: null,
  },
];

export const education = [
  {
    institution: "SS International University",
    degree: "Master of Computer Applications (MCA)",
    period: "2022 – 2025",
    location: "Online",
  },
  {
    institution: "University of Delhi",
    degree: "B.Sc. Computer Science",
    period: "2017 – 2020",
    location: "Delhi, India",
  },
];
