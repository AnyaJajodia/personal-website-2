/**
 * Lynxster — the detail page's copy, verbatim from handoff/content/work/lynxster.md
 * (one typo corrected: "interally" → "internally"). The Markdown's internal
 * notes are not rendered.
 *
 * Keep descriptions at the Markdown's level: no architecture, mechanisms,
 * workflows, customers or partners, metrics, or legal/compliance claims.
 */

export const lynxster = {
  name: "Lynxster",
  title: "Building systems of trust.",
  subtitle: "Engineering, product development, and technical leadership for independently verifiable digital records.",
  role: "Chief Technology Officer & Co-founder",
  period: "April 2026–present",
  status: "Patent pending",

  problem: {
    heading: "The problem",
    paragraphs: [
      "Organizations rely on digital records every day. When a record moves between people or organizations, confirming that it is genuine and unaltered can become a complicated process.",
    ],
    statement: "Lynxster is building infrastructure intended to make important digital records independently verifiable.",
  },

  progression: {
    heading: "From developer to co-founder",
    /** where it started, and where it is now — no date is given for the change */
    from: { when: "April 2026", role: "Junior Developer" },
    to: { when: "Today", role: "Chief Technology Officer & Co-founder" },
    paragraphs: [
      "I joined Lynxster in April 2026 as a Junior Developer, when the company was still at an early stage. Starting with a blank slate, I worked across the technical foundations and gradually took on responsibilities beyond development.",
      "Today, as Chief Technology Officer and Co-founder, I work across engineering, product, and the systems that support the company’s development.",
    ],
  },

  areas: {
    heading: "What I work on",
    items: [
      {
        key: "engineering",
        title: "Engineering and infrastructure",
        text: "I’ve built foundational software and set up development infrastructure across the company’s technology stack, helping establish the environment for ongoing product work.",
      },
      {
        key: "cryptography",
        title: "Cryptography and product",
        text: "My work has included cryptographic implementation and product development: moving between foundational technical questions and the application being built around them.",
      },
      {
        key: "agents",
        title: "Agent-assisted development",
        text: "I established an AI-assisted development environment to support engineering work, documentation, iteration, and even internally for the other teams at Lynxster.",
      },
      {
        key: "communication",
        title: "Product and communication",
        text: "Alongside development, I’ve worked on technical documentation, demonstrations, outreach, and communicating the product’s purpose.",
        /** the patent: Anya's first complete draft, developed further by the team */
        note: "I also prepared the first complete draft of the patent application, which became the starting point for subsequent work and revisions by the wider team.",
      },
    ],
  },

  learning: {
    heading: "What I’m learning",
    paragraphs: [
      "Working at an early-stage company has meant moving between building, explaining, and making decisions about what comes next.",
      "I’m learning how to bring technical work and product thinking together while helping shape a company from its early stages.",
    ],
  },

  more: {
    heading: "More to come",
    text: "Lynxster is ongoing and patent pending. More details will be shared as the work develops.",
  },
};
