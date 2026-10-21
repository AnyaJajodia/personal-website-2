/**
 * Central, editable content for every detail route (/work/[slug]).
 * Source: handoff/content/work/*.md. Copy is the factual authority — do not
 * add claims here that are not in the handoff or supplied by Anya.
 *
 * Dates: uncertain end dates use the 2027 placeholder the user requested and
 * are flagged `needsReview: true` (listed in EDITING_CHECKLIST.md). Entries with
 * no known start date keep `start: null`, which omits the public period field.
 */

import type { ExternalLink } from "./site";

export type Theme = "lynxster" | "amnh" | "default";

export type Period = {
  label: "Period" | "Year";
  start: string | null;
  end: string | null;
  needsReview?: boolean;
  reviewNote?: string;
};

export type Section = { heading: string; paragraphs: string[] };

/** A distinct workstream within one organisation, with its own sections and figure. */
export type Stream = {
  id: string;
  heading: string;
  figure?: Figure;
  sections: Section[];
  /** an honest note about what is not yet confirmed */
  pending?: string;
};

export type FlowStep = { title: string; note: string };

export type Figure =
  | { kind: "flow"; steps: FlowStep[]; caption: string }
  | { kind: "plates"; plates: { caption: string; pattern: "ledger" | "grid" | "field" }[]; note: string };

export type WorkEntry = {
  slug: string;
  /** Short name used in breadcrumbs, pager and page <title> */
  name: string;
  theme: Theme;
  /** Small blue label lines above the title (organisation, department) */
  eyebrow?: string[];
  /** h1 — the editorial headline */
  title: string;
  subtitle: string;
  role?: { label: string; value: string };
  period?: Period;
  /** Additional metadata (Focus, Tools, Publication…) */
  meta?: { label: string; value: string }[];
  /** Lynxster: opening statement shown in the dark hero beside the title */
  lede?: string[];
  figure?: Figure;
  /** separate workstreams, shown before the shared `sections` */
  streams?: Stream[];
  sections: Section[];
  links?: (ExternalLink & { needsReview?: boolean })[];
  /** Short description used in <meta name="description"> */
  description: string;
};

export function formatPeriod(p?: Period): string | null {
  if (!p || !p.start) return null; // never invent a start date
  if (!p.end || p.end === p.start) return p.start;
  return `${p.start}–${p.end}`;
}

export const work: WorkEntry[] = [
  {
    slug: "lynxster",
    name: "Lynxster",
    theme: "lynxster",
    title: "Building systems of trust.",
    subtitle: "Product engineering and cryptographic implementation for independently verifiable records.",
    role: { label: "Role", value: "Engineering & technical leadership" },
    period: {
      label: "Period",
      start: "2026",
      end: "2027",
      needsReview: true,
      reviewNote: "Placeholder end year; start month not verified; confirm formal title.",
    },
    meta: [{ label: "Focus", value: "Cryptography · Product development · Agentic workflows" }],
    lede: [
      "Lynxster is building tools for recording disclosures and producing evidence packages that can be verified independently. My work connects the underlying cryptographic implementation with the application people use to manage those workflows.",
    ],
    sections: [
      {
        heading: "My work",
        paragraphs: [
          "I’ve worked across the MVP: implementing the cryptographic core, building application workflows, developing internal tools, and preparing technical documentation and demos.",
          "That means moving between different kinds of problems. Some require careful attention to data structures and verification behavior. Others require a clear interface, a useful explanation, or a development process that makes errors easier to catch.",
        ],
      },
      {
        heading: "Building with agents",
        paragraphs: [
          "I’ve also developed agent-assisted workflows for planning, coding, review, and security review. The useful part is the structure around the generated code: clear tasks, separate review stages, and a way to bring findings back into implementation.",
          "These workflows support the engineering process alongside direct development and manual review.",
        ],
      },
      {
        heading: "From implementation to explanation",
        paragraphs: [
          "Building the system has also meant making it understandable. I’ve worked on programming guides, technical explanations, and demos that connect implementation details to the product’s purpose.",
          "Writing those explanations often reveals where the implementation—or the explanation itself—needs more work.",
        ],
      },
      {
        heading: "What I’m learning",
        paragraphs: [
          "This work has made me more attentive to the distance between a specification, a working implementation, and a product someone can actually use. Each has to support the others, and keeping them aligned takes deliberate effort.",
        ],
      },
    ],
    description:
      "Lynxster: product engineering and cryptographic implementation for independently verifiable records.",
  },
  {
    slug: "amnh",
    name: "AMNH",
    theme: "amnh",
    eyebrow: ["American Museum of Natural History", "Invertebrate Zoology"],
    title: "A closer look at the archive.",
    subtitle: "Digitizing dragonfly records and improving the tools around them.",
    role: { label: "Role", value: "Volunteer" },
    period: {
      label: "Period",
      start: "2026",
      end: "2027",
      needsReview: true,
      reviewNote: "Placeholder end year; start month to confirm.",
    },
    meta: [{ label: "Focus", value: "Archival digitization · Digitization rigs · Workflow improvement · Mantis behavioral research" }],
    streams: [
      {
        id: "collections-digitization",
        heading: "Collections digitization",
        figure: {
          kind: "plates",
          note: "Original photographs to come.",
          plates: [
            { caption: "Archival dragonfly record, Invertebrate Zoology.", pattern: "ledger" },
            { caption: "3D-printed digitization rig.", pattern: "grid" },
          ],
        },
        sections: [
          {
            heading: "Overview",
            paragraphs: [
              "I volunteer in the American Museum of Natural History’s Invertebrate Zoology department, where I help digitize archival dragonfly records.",
              "The work brings together historical material, careful handling, and the practical question of how to make records easier to access and use.",
            ],
          },
          {
            heading: "Records, rigs, and workflows",
            paragraphs: [
              "Alongside digitization, I help set up 3D-printed rigs and look for ways to improve the workflow around them. It’s a combination of working with the records themselves and paying attention to the tools and repeated steps involved in capturing them.",
              "Small practical changes matter when a process has to be repeated across an archive.",
            ],
          },
          {
            heading: "Why this work",
            paragraphs: [
              "I’m interested in natural history, conservation, and the ways information moves between physical collections and digital systems. This work lets me approach those interests through something tangible: a record, a setup, and the care required to preserve what the record contains.",
              "It also gives me a reason to spend time thinking about dragonflies. I’m comfortable with that outcome.",
            ],
          },
        ],
      },
      {
        id: "mantis-research",
        heading: "Mantis behavioral research",
        figure: {
          kind: "plates",
          note: "Original photographs to come.",
          plates: [{ caption: "Mantis behavioral research.", pattern: "field" }],
        },
        sections: [
          {
            heading: "Overview",
            paragraphs: ["I’ve joined a mantis behavioral research project at the museum."],
          },
        ],
        pending: "The research question, methods, my responsibilities and any outcomes will be added once they’re confirmed.",
      },
    ],
    sections: [
      {
        heading: "What I’m exploring",
        paragraphs: [
          "I’m interested in pursuing research that connects anthropology and zoology at the museum. That’s a direction I’m exploring alongside my current digitization work, not an established research project.",
        ],
      },
    ],
    description:
      "Volunteering in AMNH Invertebrate Zoology: digitizing archival dragonfly records and improving the tools around them.",
  },
  {
    slug: "crackd-ai",
    name: "Crackd.ai",
    theme: "default",
    title: "Can a model learn to be funny?",
    subtitle: "LLM chaining, prompt experimentation, and product development for AI-generated humor.",
    role: { label: "Role", value: "Software Engineer — Frontend & Admin Team, Prompt Engineering" },
    period: { label: "Period", start: "Sep 2025", end: "2027", needsReview: true, reviewNote: "Placeholder end year." },
    meta: [{ label: "Tools", value: "Supabase · TensorFlow · LLM workflows" }],
    figure: {
      kind: "flow",
      caption: "How the caption experiments were structured.",
      steps: [
        { title: "Context", note: "Randomized examples and cultural context from Supabase" },
        { title: "Chain", note: "Matrix functionality linking model outputs across steps" },
        { title: "Critique", note: "The model scores multiple outputs and corrects errors" },
      ],
    },
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "At Crackd.ai, I worked on frontend and admin features alongside prompt-engineering experiments. The work explored how cultural context, examples, and multiple model steps could influence generated captions.",
        ],
      },
      {
        heading: "My contribution",
        paragraphs: [
          "I added Matrix functionality for chaining LLM outputs across steps and pulling cultural context from Supabase. I built functions to randomize examples and context, reducing anchoring bias by 40%, and iterated on features using interviews and product walkthrough feedback, increasing relevant language use by 35%.",
          "I added a self-critique step in which the model scored multiple outputs and corrected errors, and integrated TensorFlow image embeddings into prompt construction.",
        ],
      },
      {
        heading: "What I took from it",
        paragraphs: [
          "The model’s response is only one part of the product. The examples it sees, the context it receives, and the interface used to evaluate its output all shape the result.",
          "Humor adds another complication: technically correct is a fairly low bar for a joke.",
        ],
      },
    ],
    links: [
      {
        label: "llm_chaining_matrix on GitHub",
        url: "https://github.com/AnyaJajodia/llm_chaining_matrix",
        needsReview: true,
      },
    ],
    description: "Crackd.ai: LLM chaining, prompt experimentation, and product development for AI-generated humor.",
  },
  {
    slug: "buzzworks",
    name: "Buzzworks",
    theme: "default",
    title: "Onboarding, one message at a time.",
    subtitle: "A WhatsApp-based HR platform built around multi-step employee workflows.",
    role: { label: "Role", value: "Full Stack Software Development Intern" },
    period: { label: "Period", start: "May 2025", end: "2027", needsReview: true, reviewNote: "Placeholder end year." },
    meta: [{ label: "Tools", value: "Docker · Redis · Meta’s Business API" }],
    figure: {
      kind: "flow",
      caption: "Some of the multi-step workflows tracked by the Redis-backed state machine.",
      steps: [
        { title: "OTP login", note: "" },
        { title: "Offer letter", note: "" },
        { title: "Signature", note: "" },
        { title: "KYC", note: "" },
        { title: "Documents", note: "" },
        { title: "Leave", note: "" },
      ],
    },
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "At Buzzworks, I was the sole engineer building a WhatsApp HR onboarding system from scratch, working with product stakeholders to translate business requirements into conversational workflows.",
        ],
      },
      {
        heading: "My contribution",
        paragraphs: [
          "I used Docker, Redis, and Meta’s Business API to build the system, evaluating latency and concurrency tradeoffs and achieving sub-200ms responses at 10K+ sessions.",
          "A Redis-backed state machine tracked multi-step workflows including OTP login, offer letters, signatures, KYC, document collection, and leave applications. I integrated OCR and media APIs for document fields and uploads, and enabled multilingual onboarding.",
          "I led demos and technical walkthroughs for internal stakeholders. The system was being prepared for integration into ICICI Bank’s internal infrastructure.",
        ],
      },
      {
        heading: "What I took from it",
        paragraphs: [
          "A conversational interface still needs a carefully structured system underneath it. Each message has to arrive in the right context, and the application needs to know what has happened, what is missing, and what comes next.",
        ],
      },
    ],
    description: "Buzzworks: a WhatsApp-based HR platform built around multi-step employee workflows.",
  },
  {
    slug: "tmu-citation-tooling",
    name: "Research tooling · TMU",
    theme: "default",
    eyebrow: ["Toronto Metropolitan University"],
    title: "Following the footnotes.",
    subtitle: "Python research tooling for tracing and validating legal citations.",
    role: { label: "Role", value: "Research Assistant — Ted Rogers School of Management" },
    period: {
      label: "Period",
      start: "May 2025",
      end: "2027",
      needsReview: true,
      reviewNote: "Résumé versions disagree on the end month (Sep vs Oct 2025); 2027 placeholder per request.",
    },
    meta: [{ label: "Tools", value: "Python · Parsing · AI-assisted validation" }],
    figure: {
      kind: "flow",
      caption: "From an ambiguous reference to a validated citation — or a flag for a person to check.",
      steps: [
        { title: "Trace", note: "Id., Ibid., and Supra, including nested references" },
        { title: "Parse", note: "Multi-stage parsing and semantic matching" },
        { title: "Validate", note: "AI-assisted validation with logging" },
        { title: "Flag", note: "Ambiguous citations go to human review" },
      ],
    },
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "As a research assistant at the Ted Rogers School of Management, I built a pipeline to replace and validate over 800 legal footnotes in a manuscript, with 92% accuracy.",
        ],
      },
      {
        heading: "My contribution",
        paragraphs: [
          "The pipeline used multi-stage parsing to resolve references such as Id., Ibid., and Supra, including nested references and semantic matching.",
          "I added AI-assisted validation and logging to flag ambiguous citations for human review, alongside parallel processing and a modular, unit-tested architecture. The workflow reduced manual review cycles by 30%.",
        ],
      },
      {
        heading: "What I took from it",
        paragraphs: [
          "Useful research automation needs to show where uncertainty remains. Flagging an ambiguous reference can be more valuable than silently producing a confident answer.",
        ],
      },
    ],
    description:
      "Research tooling at Toronto Metropolitan University: a Python pipeline for tracing, replacing, and validating legal citations.",
  },
  {
    slug: "inteli-lens",
    name: "Inteli-lens",
    theme: "default",
    title: "From footage to a working prototype.",
    subtitle: "A computer-vision experiment in identifying potentially intoxicated behavior.",
    role: { label: "Type", value: "Independent project" },
    period: {
      label: "Period",
      start: null,
      end: "2027",
      needsReview: true,
      reviewNote: "No start date supplied — period hidden until confirmed.",
    },
    meta: [{ label: "Tools", value: "Python · OpenCV · TensorFlow · PyQt5 · FFmpeg · SQLite" }],
    figure: {
      kind: "flow",
      caption: "The prototype pipeline, from decoded footage to a logged result.",
      steps: [
        { title: "Decode", note: "CCTV footage via FFmpeg" },
        { title: "Prepare", note: "Preprocessing and augmentation for lighting and camera angle" },
        { title: "Classify", note: "OpenCV and TensorFlow CNNs" },
        { title: "Review", note: "PyQt5 interface with SQLite logging" },
      ],
    },
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Inteli-lens is a Python desktop prototype built to explore behavior detection in CCTV footage using OpenCV and TensorFlow CNNs.",
        ],
      },
      {
        heading: "My contribution",
        paragraphs: [
          "I developed preprocessing and augmentation pipelines with NumPy and scikit-image to address lighting and camera-angle variation, built a PyQt5 GUI prototype, and integrated FFmpeg decoding and SQLite logging.",
          "I validated the model on a labeled dataset and improved precision and recall.",
        ],
      },
      {
        heading: "Scope",
        paragraphs: [
          "This was a prototype exploring a behavior-classification task. It was not a clinical assessment of intoxication.",
          "The desktop prototype was deployed as a prototype, not as a production rollout.",
        ],
      },
    ],
    description: "Inteli-lens: a computer-vision prototype for identifying potentially intoxicated behavior in CCTV footage.",
  },
  {
    slug: "gvi-conservation",
    name: "GVI · South Africa",
    theme: "default",
    eyebrow: ["GVI · South Africa"],
    title: "Learning to look more closely.",
    subtitle: "Conservation fieldwork in the South African bushveld.",
    role: { label: "Type", value: "Conservation fieldwork" },
    period: {
      label: "Period",
      start: null,
      end: "2027",
      needsReview: true,
      reviewNote: "No start date supplied — period hidden until confirmed.",
    },
    figure: {
      kind: "plates",
      note: "Fieldwork photographs to come.",
      plates: [{ caption: "Fieldwork in the South African bushveld.", pattern: "field" }],
    },
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "During fieldwork with GVI in South Africa, I helped collect cheetah data and took part in bird surveys.",
        ],
      },
      {
        heading: "What stayed with me",
        paragraphs: [
          "The experience strengthened my interest in conservation and the information that supports it. It also gave me a different perspective on research: collecting observations carefully comes before deciding what to do with them.",
          "That interest continues to shape the technical and research work I’m drawn to.",
        ],
      },
    ],
    description: "Conservation fieldwork with GVI in the South African bushveld: cheetah data and bird surveys.",
  },
  {
    slug: "pmmy-research",
    name: "PMMY research",
    theme: "default",
    eyebrow: ["Research publication"],
    title: "Policy, data, and lived consequences.",
    subtitle: "PMMY & women’s financial empowerment",
    role: { label: "Role", value: "Lead Researcher" },
    period: { label: "Year", start: "2022", end: null },
    meta: [
      { label: "Paper", value: "Impact of the PMMY (Pradhan Mantri Mudra Yojana) In Empowering Women" },
      { label: "Publication", value: "IJSHRE" },
    ],
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "This research used Python-based NLP sentiment analysis of public Twitter data to examine responses to PMMY. The work was published in IJSHRE and accompanied by financial-literacy outreach with an NGO, helping secure startup loans for 50+ women.",
        ],
      },
      {
        heading: "Focus",
        paragraphs: [
          "Connecting data analysis with questions about access, economic opportunity, and women’s experiences of public policy.",
        ],
      },
    ],
    links: [{ label: "Read the paper", url: null, pendingNote: "Paper link to come" }],
    description: "Research on the impact of the PMMY (Pradhan Mantri Mudra Yojana) in empowering women, published in IJSHRE (2022).",
  },
  {
    slug: "teenage-pregnancy-research",
    name: "Teenage pregnancy research",
    theme: "default",
    eyebrow: ["Research publication"],
    title: "Looking beyond the numbers.",
    subtitle: "Teenage pregnancy & fertility",
    role: { label: "Role", value: "Lead Researcher" },
    period: { label: "Year", start: "2022", end: null },
    meta: [
      { label: "Paper", value: "Projecting Teenage Pregnancy and Motherhood and Fertility Rates" },
      { label: "Publication", value: "IJSHRE" },
    ],
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "This research used Python, NumPy, Pandas, and Matplotlib to examine socioeconomic drivers of teenage pregnancy in rural India. It was published in IJSHRE and accompanied by educational outreach with NGO Saksharta, reaching 200+ rural girls through targeted education initiatives.",
          "I presented the paper at an annual panel at Chirayu Hospital.",
        ],
      },
      {
        heading: "Focus",
        paragraphs: ["Using data to investigate a social question while keeping the surrounding context in view."],
      },
    ],
    links: [{ label: "Read the paper", url: null, pendingNote: "Paper link to come" }],
    description: "Research on socioeconomic drivers of teenage pregnancy in rural India, published in IJSHRE (2022).",
  },
  {
    slug: "esp-teaching",
    name: "Emerging Scholars Program",
    theme: "default",
    eyebrow: ["Emerging Scholars Program · Columbia"],
    title: "Making room for the next question.",
    subtitle: "Peer teaching in computer science at Columbia.",
    role: { label: "Role", value: "Teaching Assistant" },
    period: { label: "Period", start: "Jan 2024", end: "Dec 2024" },
    sections: [
      {
        heading: "My contribution",
        paragraphs: [
          "I helped lead weekly peer-taught computer science sessions covering UI/UX, algorithms, machine learning, and AI for Columbia and Barnard undergraduates.",
          "I taught two cohorts across two semesters and supported students building foundations for research and technical projects.",
        ],
      },
      {
        heading: "What I value",
        paragraphs: [
          "Teaching means paying attention to how someone is thinking, then finding an explanation that gives them a useful next step.",
        ],
      },
    ],
    description: "Peer teaching in computer science at Columbia through the Emerging Scholars Program.",
  },
  {
    slug: "adi-mentorship",
    name: "Application Development Initiative",
    theme: "default",
    eyebrow: ["Application Development Initiative · Columbia"],
    title: "Working through it together.",
    subtitle: "Technical mentorship through Columbia’s ADI community.",
    role: { label: "Role", value: "Mentor" },
    period: { label: "Period", start: "Jan 2024", end: "2027", needsReview: true, reviewNote: "Placeholder end year." },
    sections: [
      {
        heading: "My contribution",
        paragraphs: [
          "I’ve mentored 10+ students on academic planning, technical projects, skill-building, and recruiting. I guided peers on recruiting strategy and technical development that contributed to internships at Google, Meta, and Duolingo.",
        ],
      },
      {
        heading: "What I value",
        paragraphs: [
          "I like helping someone reach the point where a problem starts to make sense—and where they can take the next step themselves.",
        ],
      },
    ],
    description: "Technical mentorship through Columbia’s Application Development Initiative community.",
  },
];

export function getWork(slug: string): WorkEntry | undefined {
  return work.find((w) => w.slug === slug);
}

export function getNeighbours(slug: string) {
  const i = work.findIndex((w) => w.slug === slug);
  return {
    prev: i > 0 ? work[i - 1] : undefined,
    next: i >= 0 && i < work.length - 1 ? work[i + 1] : undefined,
  };
}
