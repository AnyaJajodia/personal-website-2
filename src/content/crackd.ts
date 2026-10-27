/**
 * The Crackd.ai detail page — approved copy from handoff/content/work/crackd-ai.md
 * (revised 26 Oct 2026), verbatim. Its implementation notes (the HTML comment at
 * the end) are not rendered, and neither is the paragraph the notes mark as
 * editorial staging ("A detailed experiment comparison will be added…").
 *
 * Two phases carry the page:
 *   01  September–December 2025 — contributions to the shared platform (a team)
 *   02  January–May 2026        — my own implementations of the three applications,
 *                                 against the existing live database and services
 *
 * Walkthroughs: the supplied screenshots, prepared for public display by
 * scripts/build-crackd-walkthroughs.mjs (originals in handoff/assets/crackd-source,
 * never served), with the supplied titles and subtitles (walkthroughs.json).
 * Selected feature tours, not continuous recorded sessions.
 *
 * Links: one repository per application (checked public). Live apps only where
 * the address answered: the user app and the matrix both require sign-in; the
 * admin address returned 404 and is not shown. No architecture, metrics or
 * experiment comparison is claimed.
 */

export type Step = {
  /** /assets/crackd/<app>/<name> — served as <stem>-1280.webp and <stem>-2048.webp */
  stem: string;
  width: number;
  height: number;
  title: string;
  subtitle: string;
  alt: string;
};

export type App = {
  id: string;
  n: string;
  name: string;
  /** the application's one-line description in the source */
  lede: string;
  body: string;
  repo: { label: string; url: string };
  live?: { url: string; access: string };
  steps: Step[];
};

const s = (app: string, name: string, title: string, subtitle: string, alt: string, height = 1114): Step => ({
  stem: `/assets/crackd/${app}/${name}`,
  width: 2048,
  height,
  title,
  subtitle,
  alt,
});

export const crackd = {
  name: "Crackd.ai",
  title: "Can a model learn to be funny?",
  subtitle: "Building three applications for generating, managing, and experimenting with campus-specific AI humor.",
  meta: [
    { label: "Role", value: "Full-stack development · Conversational AI experimentation · UI and admin tooling" },
    { label: "Period", value: "September 2025–May 2026" },
    { label: "Context", value: "Coursework with Professor Lydia Chilton and Michael Roger" },
  ],

  intro: {
    id: "what-is-crackd",
    heading: "What is Crackd?",
    paragraphs: [
      "Crackd.ai generates image-based captions for the communities at Columbia, Barnard, and Stanford. Its humor styles, called “flavors,” combine images with campus terminology, current events, and voices inspired by fictional characters and public figures.",
      "The wider platform draws on regularly updated data, including campus activity and Sidechat discussions. That context helps it generate references its audience can recognize.",
    ],
    bridge:
      "My involvement developed in two phases: contributing to the shared platform within a larger team, then independently implementing three deployed applications against an existing live database.",
  },

  phases: [
    {
      id: "contributing-within-a-team",
      n: "01",
      dates: "September–December 2025",
      heading: "Contributing within a team",
      paragraphs: [
        "I worked across the UI design, admin, and prompt-engineering pods.",
        "I implemented interface changes based on the design team’s work, developed admin features for inspecting platform activity and statistics, and experimented with new humor flavors through the chaining matrix.",
        "We organized work in Linear and collaborated through GitHub branches and pull requests. I coordinated changes with other contributors, reviewed feedback, and resolved merge conflicts within an actively developed codebase.",
      ],
    },
    {
      id: "building-complete-applications",
      n: "02",
      dates: "January–May 2026",
      heading: "Building complete applications",
      paragraphs: [
        "In the following semester, I built my own implementations of the user application, admin application, and LLM chaining matrix while a separate team continued developing the main platform.",
        "I implemented each application end to end, including interfaces, authentication and access controls, application logic, integration with the existing database and services, and deployment. These are functioning applications connected to live data.",
      ],
    },
  ],

  apps: [
    {
      id: "user-application",
      n: "A",
      name: "User application",
      lede: "An application for uploading images, generating captions, browsing existing submissions, and voting on image-caption pairs.",
      body: "I built the user journeys around generation and feedback, including upload handling, progress states, caption viewing, voting rounds, personal caption collections, and highlights.",
      repo: { label: "caption_voting_user_interface", url: "https://github.com/AnyaJajodia/caption_voting_user_interface" },
      live: { url: "https://crackdspring2026.vercel.app", access: "Sign-in limited to Columbia, Barnard, and Stanford email addresses" },
      steps: [
        s("user-app", "01-home", "Choose a starting point", "The signed-in home screen offers caption rating and image-based generation.", "Dark Crack’d home screen with the headline “The funniest caption wins.” and two buttons, Rate Captions and Generate Your Own."),
        s("user-app", "02-voting", "Rate a caption", "Users evaluate image-caption pairs with voting controls and round progress.", "A voting card shows an image with a caption beneath it, a round counter, and Nope and Funny! buttons."),
        s("user-app", "03-upload", "Start a generation request", "An image is selected and ready to submit for caption generation.", "An upload dialog with a drag-and-drop area, one selected image file, and a Generate Captions button.", 968),
        s("user-app", "04-generation-progress", "Follow generation progress", "The interface distinguishes upload preparation, image registration, and caption generation.", "A progress dialog listing Preparing upload, Uploading image, and Registering image as done, and Generating captions as running."),
        s("user-app", "05-caption-results", "Review generated captions", "The personal caption viewer presents an image and lets users move between captions.", "A caption viewer over the Your Captions grid, with an obscured photograph, one caption, arrows to move between captions, and a position counter."),
        s("user-app", "06-highlights", "Explore highlights", "A highlights view presents ranked image-caption pairs with display-count controls.", "A Highlights grid of ranked caption cards with first, second, and third place badges and Top 5, Top 10, and Top 15 controls; the photographs are obscured."),
      ],
    },
    {
      id: "admin-application",
      n: "B",
      name: "Admin application",
      lede: "An interface for inspecting and managing the records and configuration behind the platform.",
      body: "I built searchable, filterable views for captions, images, profiles, and humor configuration, alongside permissions management and analytical views. Administrators could examine individual records, inspect prompt-step details, and explore patterns in caption feedback.",
      repo: { label: "crackd-spring2026-admin-panel", url: "https://github.com/AnyaJajodia/crackd-spring2026-admin-panel" },
      steps: [
        s("admin-app", "01-caption-inspection", "Inspect caption records", "Search, filters, and expanded records expose caption metadata and associated identifiers.", "The Captions view with search, visibility, featured and sort filters, and an expanded record showing its metadata fields; private records are obscured."),
        s("admin-app", "02-image-details", "Inspect image context", "An expanded image record displays its description and additional context.", "The Images view with an expanded record laid out as image, description, additional context, and celebrity recognition panels; this record is private, so its contents are obscured."),
        s("admin-app", "03-opener-statistics", "Analyze recurring openers", "A chart compares vote distributions for recurring caption-opening phrases.", "An Overused Openers bar chart comparing upvote and downvote shares for the openers “when you”, “when your”, “when the”, and other."),
        s("admin-app", "04-caption-popularity", "Compare caption popularity", "Ranked captions show net scores and underlying upvote/downvote counts.", "A Caption Popularity grid of the most-liked captions, each with its image, net vote score, and upvote and downvote counts."),
        s("admin-app", "05-flavor-step-details", "Inspect flavor-step configuration", "Expanded step details expose model metadata, prompts, and references to earlier outputs.", "The Humor Flavor Steps view with one step expanded to show its metadata, system prompt, and a user prompt that references the previous step’s output."),
      ],
    },
    {
      id: "llm-chaining-matrix",
      n: "C",
      name: "LLM chaining matrix",
      lede: "A development environment for building and testing multi-step humor-generation workflows.",
      body: "I implemented flavor browsing, ordered prompt-chain configuration, model and input/output settings, test-set selection, run progress, and caption review. Outputs from earlier steps could be referenced by later prompts, allowing generation to be broken into distinct operations.",
      repo: { label: "llm_chaining_matrix", url: "https://github.com/AnyaJajodia/llm_chaining_matrix" },
      live: { url: "https://crackdmatrix.vercel.app", access: "Requires sign-in" },
      steps: [
        s("matrix", "01-flavor-library", "Find a humor flavor", "The searchable library provides access to humor-flavor configurations.", "The Matrix’s Flavors library: a search field and a grid of humor-flavor cards with names, descriptions, and dates."),
        s("matrix", "02-prompt-chain", "Inspect the prompt chain", "Ordered steps expose prompts, model selections, and input/output types.", "A flavor’s prompt chain: numbered steps, each with its model, input and output types, and system and user prompts."),
        s("matrix", "03-test-set", "Choose a test set", "A flavor can be tested against an existing image set.", "The Test Flavor screen with a list of image sets, eight images from the selected set, and a Run Flavor on Set button."),
        s("matrix", "04-run-progress", "Monitor a batch run", "Per-image states and overall counts make batch progress visible.", "A batch run in progress: images marked Done, Generating, or Queued, with done, failed, and remaining counts.", 975),
        s("matrix", "05-caption-gallery", "Inspect caption outputs", "A caption gallery allows generated examples to be reviewed. This screen shows a different image from the preceding test-set selection.", "A gallery of generated captions, each card pairing an image with its caption and date, and a Load More button."),
      ],
    },
  ] satisfies App[],

  /** shown in every walkthrough: what the tour is, and what was obscured */
  tourNote: "Selected screens from the application, not one continuous session. Account details and private records are obscured.",

  matrix: {
    id: "inside-the-chaining-matrix",
    heading: "Inside the chaining matrix",
    paragraphs: [
      "A flavor is more than a single instruction to “be funny.” A chain can separate image interpretation, contextual information, and caption writing, with intermediate outputs informing later steps.",
      "Building the matrix meant making those workflows configurable and inspectable. Using it for prompt experiments meant considering which examples, instructions, and processing stages helped produce a particular voice or style.",
    ],
  },

  takeaways: {
    id: "what-i-took-from-it",
    heading: "What I took from it",
    paragraphs: [
      "Working across all three applications changed how I thought about an AI product. The generation matters, but so do the interfaces for using it, the tools for maintaining its data, and the environment for investigating why an output changed.",
    ],
    punchline: "Humor adds another complication: technically correct is a fairly low bar for a joke.",
  },

  tools: {
    id: "tools-and-workflow",
    heading: "Tools and workflow",
    items: ["Supabase", "Live database integration", "LLM chaining", "Prompt engineering", "GitHub", "Linear", "AI-assisted development"],
    credit: "Coursework with Professor Lydia Chilton and Michael Roger.",
  },
};

/** "On this page" */
export const crackdSections = [
  { id: crackd.intro.id, label: "What is Crackd?" },
  { id: crackd.phases[0].id, label: "Contributing within a team", n: "01" },
  { id: crackd.phases[1].id, label: "Building complete applications", n: "02" },
  { id: crackd.matrix.id, label: "Inside the chaining matrix" },
  { id: crackd.takeaways.id, label: "What I took from it" },
  { id: crackd.tools.id, label: "Tools and workflow" },
];
