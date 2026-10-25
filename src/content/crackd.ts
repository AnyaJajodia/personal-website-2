/**
 * The Crackd.ai detail page — approved copy from handoff/content/work/crackd-ai.md,
 * verbatim. The file's implementation notes (the HTML comment at its end) are
 * internal instructions and are not rendered.
 *
 * Two phases carry the page:
 *   01  September–December 2025 — contributions to the shared platform (a team)
 *   02  January–May 2026        — my own implementations of the three applications
 *
 * Links: one repository per application, each listed under its own application
 * in the source (checked public). The demo URLs in the source are not shown —
 * their status is still to be confirmed (EDITING_CHECKLIST.md). No screenshots,
 * metrics or architecture connections are claimed.
 */

export type Repo = { label: string; url: string };

export type App = {
  id: string;
  name: string;
  /** the application's one-line description in the source */
  lede: string;
  paragraphs: string[];
  repo: Repo;
};

export const crackd = {
  name: "Crackd.ai",
  title: "Can a model learn to be funny?",
  subtitle: "Three applications, a prompt experimentation platform, and the surprisingly complicated business of campus humor.",
  meta: [
    { label: "Role", value: "Software development · UI implementation · Admin tooling · Prompt engineering" },
    { label: "Period", value: "September 2025–May 2026" },
    { label: "Context", value: "Two semesters of coursework with Professor Lydia Chilton and Michael Roger" },
  ],

  intro: {
    id: "what-is-crackd",
    heading: "What is Crackd?",
    opening: "A joke needs context. Campus humor needs quite a lot of it.",
    paragraphs: [
      "Crackd.ai generates image-based humor grounded in the communities at Columbia, Barnard, and Stanford. It combines images with campus terminology, conversations, and current events to produce captions in different humor styles, called “flavors.”",
      "Behind the captions are extensive data archives and regularly updated pipelines. Daily updates draw on campus activity and Sidechat communities, helping the platform work with references that are current and recognizable to its audience.",
      "Flavors explore different approaches to humor, including voices inspired by fictional characters and public figures. The challenge goes beyond generating a plausible sentence: the output needs to fit the image, understand the reference, and actually land.",
    ],
    bridge:
      "My work on Crackd developed in two phases: contributing to the existing platform within a larger team, then building my own implementations of its three applications.",
  },

  phases: [
    {
      id: "phase-1",
      n: "01",
      dates: "September–December 2025",
      /** whose work this was, in the credits' own words */
      scope: "Contributions to the shared platform",
      heading: "Contributing to the platform",
      paragraphs: [
        "I worked across the admin, prompt engineering, and UI design pods, contributing to existing applications while learning how the different parts of the platform fit together.",
      ],
      notes: [
        {
          heading: "Interfaces people could use",
          paragraphs: [
            "I implemented UI changes based on the design team’s work and helped improve the main application. This meant translating designs into working interfaces and making changes within an established codebase.",
          ],
        },
        {
          heading: "Tools behind the scenes",
          paragraphs: [
            "On the admin application, I worked on features for reviewing platform statistics and analyzing data, helping make the system’s activity easier to inspect.",
          ],
        },
        {
          heading: "Finding new flavors",
          paragraphs: [
            "Within the prompt engineering pod, I developed new humor flavors and ran experiments in the chaining matrix. The work involved trying different instructions, examples, and context to understand how they affected the generated humor.",
          ],
        },
        {
          heading: "Working within a larger team",
          paragraphs: [
            "We used Linear to organize work and GitHub to collaborate on the code. I worked through branches, pull requests, and merge conflicts while coordinating changes with other contributors.",
            "The experience taught me how to make a useful contribution to a system that other people were actively building, too.",
          ],
        },
      ],
    },
    {
      id: "phase-2",
      n: "02",
      dates: "January–May 2026",
      scope: "My own implementations of the three applications",
      heading: "Building three connected applications",
      paragraphs: [
        "The course format changed in the following semester. Rather than contributing through pods, I built my own versions of the user application, admin application, and LLM chaining matrix from scratch. A separate team continued developing the main platform.",
        "That expanded my responsibility from individual features to the applications around them: user-facing interfaces, administrative tools, database integration, and the workflows used to develop and test humor.",
      ],
      notes: [],
    },
  ],

  apps: [
    {
      id: "user-application",
      name: "The user application",
      lede: "The audience-facing part of the system: an application for interacting with Crackd’s AI-generated humor.",
      paragraphs: ["I built my own implementation of the user-facing experience, connecting the interface to the data and generation workflows behind it."],
      repo: { label: "caption_voting_user_interface", url: "https://github.com/AnyaJajodia/caption_voting_user_interface" },
    },
    {
      id: "admin-application",
      name: "The admin application",
      lede: "The tools needed to manage and understand the platform.",
      paragraphs: [
        "My implementation included interfaces for inspecting database records, managing permissions, and reviewing statistics. Building it meant thinking about the people maintaining the system as well as the people using the main application.",
      ],
      repo: { label: "crackd-spring2026-admin-panel", url: "https://github.com/AnyaJajodia/crackd-spring2026-admin-panel" },
    },
    {
      id: "chaining-matrix",
      name: "The LLM chaining matrix",
      lede: "The development environment for experimenting with how humor gets generated.",
      paragraphs: [
        "I built an application for working with multi-step LLM workflows, where outputs from one step could become inputs to another. It provided a place to develop flavors, experiment with prompts, and investigate how context and intermediate processing shaped the final result.",
      ],
      repo: { label: "llm_chaining_matrix", url: "https://github.com/AnyaJajodia/llm_chaining_matrix" },
    },
  ] satisfies App[],
  appsOutro: "Together, the three applications gave me experience building both the visible product and the tools needed to support and improve it.",

  matrix: {
    id: "inside-the-matrix",
    heading: "Inside the chaining matrix",
    subheading: "A caption has a workflow behind it",
    before: [
      "The matrix was where I could look beyond a single prompt and experiment with the process around it.",
      "Campus context, examples, instructions, and intermediate model outputs could all influence the result. Chaining made it possible to break generation into stages and investigate what each stage contributed.",
    ],
    /** "The questions were practical: …" — the paragraph, set as its questions */
    questionsLead: "The questions were practical:",
    questions: [
      "What context does the model need?",
      "Which examples help?",
      "What should happen in a separate step?",
      "And how do you tell whether a change made the humor better?",
    ],
    after: [
      "This work combined software development with prompt-engineering research. I was building the environment for experimentation while also using it to explore new flavors and approaches.",
    ],
  },

  takeaways: {
    id: "what-i-took-from-it",
    heading: "What I took from it",
    paragraphs: [
      "The model’s response is only one part of the product. The data it receives, the workflow around it, and the tools used to inspect its behavior all shape what people eventually see.",
      "Working across the user application, admin tools, and matrix made those connections tangible. A useful product needs more than a good generation: it needs interfaces people can use, data people can manage, and a way to keep improving the system.",
    ],
    punchline: "Humor adds another complication: technically correct is a fairly low bar for a joke.",
  },

  table: {
    id: "explore-the-applications",
    heading: "Explore the applications",
    columns: ["Application", "What it does"],
    rows: [
      { app: "User application", anchor: "user-application", what: "The audience-facing experience for interacting with AI-generated humor." },
      { app: "Admin application", anchor: "admin-application", what: "Tools for inspecting data, managing permissions, and reviewing platform statistics." },
      { app: "LLM chaining matrix", anchor: "chaining-matrix", what: "An environment for developing humor flavors and experimenting with multi-step generation workflows." },
    ],
  },

  tools: {
    id: "tools-and-credits",
    heading: "Tools and workflow",
    items: [
      { label: "Application development", value: "Full-stack development across three applications." },
      { label: "Data and infrastructure", value: "Supabase and integration with live databases." },
      { label: "Models and experimentation", value: "LLM chaining, prompt engineering, and humor-flavor experiments." },
      { label: "Collaboration", value: "GitHub, pull requests, and Linear." },
      { label: "Development workflow", value: "AI-assisted development using skills and MCP integrations." },
    ],
  },

  credits: {
    heading: "Credits",
    lead: "Coursework with Professor Lydia Chilton and Michael Roger.",
    phases: [
      { dates: "September–December 2025", text: "Contributions to the shared platform through the admin, prompt engineering, and UI design pods." },
      { dates: "January–May 2026", text: "My own implementations of the three applications, developed as coursework while a separate team continued work on the main platform." },
    ],
  },
};

/** "On this page": the page's main sections, in order */
export const crackdSections = [
  { id: crackd.intro.id, label: "What is Crackd?" },
  { id: "phase-1", label: "Contributing to the platform", n: "01" },
  { id: "phase-2", label: "Building three connected applications", n: "02" },
  { id: crackd.matrix.id, label: "Inside the chaining matrix" },
  { id: crackd.takeaways.id, label: "What I took from it" },
  { id: crackd.table.id, label: "Explore the applications" },
  { id: crackd.tools.id, label: "Tools and credits" },
];
