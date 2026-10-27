/**
 * The Buzzworks detail page — approved copy from handoff/content/work/buzzworks.md
 * (revised 26 Oct 2026), verbatim. The file's internal notes (the HTML comment
 * at its end) are not rendered.
 *
 * The one invented thing on the page is the reconstruction: four short,
 * fictional journeys through the WhatsApp application, captioned with the
 * notes' own wording and scripted only from what the notes specify — a form
 * with its review-and-edit loop, a policy question, leave balances and a
 * sample policy (no request sequence: not yet confirmed), and an offer with a
 * generic signature. Fictional names, data, attachments and policy text; no
 * uploads, authentication, backend calls or live AI. No employee data,
 * proprietary screens, code, endpoints or credentials; no stack details,
 * metrics or rollout status beyond the copy.
 */

/* ------------------------------------------------- the reconstruction */

/** one message from the HR assistant */
export type BotMessage = {
  text?: string;
  /** short lines inside the bubble (a summary, balances) */
  lines?: string[];
  /** a document card (fictional file) */
  doc?: { name: string; meta: string };
  /** a quiet label for sample material, shown in the bubble */
  sample?: string;
};

/** what the person does next — the guided path takes `pick` */
export type Action =
  | { kind: "buttons"; options: string[]; pick: string }
  | { kind: "list"; button: string; options: string[]; pick: string }
  | { kind: "reply"; text: string }
  | { kind: "attach"; file: { name: string; kind: "photo" | "signature" } };

/** one beat: the assistant speaks, the person acts, their message appears */
export type Beat = { bot: BotMessage; act?: Action };

export type Scenario = { id: string; label: string; beats: Beat[] };

const menu: Action = { kind: "list", button: "Menu", options: ["My tasks", "Leave", "Ask about a policy"], pick: "" };

export const scenarios: Scenario[] = [
  {
    id: "form",
    label: "Complete a form",
    beats: [
      {
        bot: { text: "Hi Meera! You have 3 pending tasks. Choose one to continue." },
        act: { kind: "list", button: "View tasks", options: ["Personal details form", "Bank details", "Offer letter"], pick: "Personal details form" },
      },
      { bot: { text: "What name would you like us to use?" }, act: { kind: "reply", text: "Meera" } },
      { bot: { text: "Which city are you currently based in?" }, act: { kind: "reply", text: "Pune" } },
      { bot: { text: "Please send a recent passport-size photo." }, act: { kind: "attach", file: { name: "sample-photo.jpg", kind: "photo" } } },
      {
        bot: { text: "Here’s what I have. Is everything correct?", lines: ["Preferred name: Meera", "City: Pune", "Photo: sample-photo.jpg"] },
        act: { kind: "buttons", options: ["Submit", "Edit a field"], pick: "Edit a field" },
      },
      {
        bot: { text: "Which field would you like to change?" },
        act: { kind: "list", button: "Choose a field", options: ["Preferred name", "City", "Photo"], pick: "City" },
      },
      { bot: { text: "Which city are you currently based in?" }, act: { kind: "reply", text: "Mumbai" } },
      {
        bot: { text: "Updated. Is everything correct now?", lines: ["Preferred name: Meera", "City: Mumbai", "Photo: sample-photo.jpg"] },
        act: { kind: "buttons", options: ["Submit", "Edit a field"], pick: "Submit" },
      },
      { bot: { text: "Submitted — your personal details form is complete. 2 tasks left: Bank details, Offer letter." } },
    ],
  },
  {
    id: "policy",
    label: "Ask about a policy",
    beats: [
      { bot: { text: "Hi Meera! What would you like to do?" }, act: { ...menu, pick: "Ask about a policy" } },
      { bot: { text: "Ask your question about company policies." }, act: { kind: "reply", text: "Can I work from home on Fridays?" } },
      {
        bot: {
          text: "Hybrid work is arranged with your manager: up to two remote days a week, which can include Fridays.",
          sample: "From a sample hybrid-work policy",
        },
        act: { kind: "buttons", options: ["Ask another question", "Main menu"], pick: "Ask another question" },
      },
      { bot: { text: "Of course — what would you like to know?" } },
    ],
  },
  {
    id: "leave",
    label: "Manage leave",
    beats: [
      { bot: { text: "Hi Meera! What would you like to do?" }, act: { ...menu, pick: "Leave" } },
      {
        bot: { text: "Here are your leave balances.", lines: ["Casual leave: 6 days", "Sick leave: 4 days", "Earned leave: 11 days"], sample: "Sample balances" },
        act: { kind: "buttons", options: ["Leave policy", "Main menu"], pick: "Leave policy" },
      },
      { bot: { text: "Here’s the leave policy.", doc: { name: "Sample leave policy.pdf", meta: "PDF · 2 pages" } } },
    ],
  },
  {
    id: "offer",
    label: "Review an offer",
    beats: [
      {
        bot: { text: "Your offer letter is ready to review.", doc: { name: "Offer letter — Sample Co.pdf", meta: "PDF · 3 pages" } },
        act: { kind: "buttons", options: ["Accept", "Reject"], pick: "Accept" },
      },
      { bot: { text: "Please send an image of your signature to complete your acceptance." }, act: { kind: "attach", file: { name: "Sample signature", kind: "signature" } } },
      { bot: { text: "Thank you — your acceptance and signature have been recorded." } },
    ],
  },
];

/* --------------------------------------------------------- the page */

export const buzzworks = {
  name: "Buzzworks",
  title: "There’s a workflow behind that message.",
  subtitle: "Designing and building a personalized WhatsApp HR platform, from account verification and onboarding to everyday employee requests.",
  meta: [
    { label: "Role", value: "Full Stack Software Development Intern" },
    { label: "Period", value: "May 2025–May 2026" },
    { label: "Scope", value: "Conversational UX design · Full-stack development · Workflow orchestration · API integration · Deployment" },
  ],

  intro: {
    id: "hr-workflows-inside-a-conversation",
    heading: "HR workflows, inside a conversation",
    paragraphs: [
      "Buzzworks provides HR services and software to businesses. I extended its existing Veytan HR platform into WhatsApp, allowing candidates and employees to complete tasks through a conversation connected to their accounts.",
      "The application supported onboarding, forms, documents, offers, signatures, leave requests, status checks, and company-policy questions. It was developed for Buzzworks’ own use and as a service for client companies.",
      "I was the sole developer responsible for designing and building the conversational application from scratch. I worked with product stakeholders on requirements, company teams on existing and additional APIs, the infrastructure team on hosting, and Wacto’s team on messaging integration.",
    ],
  },

  explore: {
    id: "explore-the-experience",
    heading: "Explore the experience",
    paragraphs: [
      "Different workflows called for different interactions: selecting a task, correcting a form, reviewing an offer, or asking an open-ended question.",
      "The reconstructed examples below show several of those journeys, using fictional information.",
    ],
    /** the notes' own caption */
    caption: "Illustrative workflows reconstructed using fictional information. No employee data or proprietary application screens are shown.",
    contact: "HR assistant",
  },

  design: {
    id: "designing-within-whatsapp",
    heading: "Designing within WhatsApp",
    decisions: [
      {
        heading: "Make choices easier to navigate",
        paragraphs: [
          "I used buttons and single-choice lists where users were selecting from known options, keeping text input for information they needed to provide. Menus, contextual prompts, and return paths helped people move through the available workflows without memorizing commands.",
        ],
      },
      {
        heading: "Let people correct an answer",
        paragraphs: [
          "Forms did not end with the first round of inputs. I built a review step that summarized the collected information and let users select individual fields to edit before submission.",
          "After a correction, the application returned an updated summary so users could check their information without starting over.",
        ],
      },
      {
        heading: "Work within the platform’s limits",
        paragraphs: [
          "WhatsApp limited selection lists to ten items. When an account had more pending tasks, I displayed the first ten and explained which additional tasks would become accessible as the visible ones were completed.",
          "This made the constraint explicit and gave users a next action rather than leaving the remaining tasks unexplained.",
        ],
      },
    ],
  },

  behind: {
    id: "behind-the-conversation",
    heading: "Behind the conversation",
    paragraphs: [
      "I separated messaging integration, conversational workflow logic, and backend API interactions into modular services packaged with Docker.",
      "Meta’s WhatsApp Business APIs, Wacto, and webhooks connected incoming messages to the application. A Redis-backed state machine tracked the active workflow and collected information, while task handlers retrieved account-specific data and submitted updates through Veytan and company APIs.",
      "Collecting an answer and completing a backend task were separate steps. The application needed to preserve that distinction while supporting review, editing, and submission.",
    ],
  },

  decisions: {
    id: "engineering-decisions",
    heading: "Engineering decisions",
    policy: {
      heading: "Select the documents before asking the model to read them",
      paragraphs: [
        "For company-policy questions, I designed a two-stage Claude workflow to avoid sending the full document collection into every request.",
        "The first stage received the question alongside document titles and descriptions, then selected relevant files. The application retrieved those files through a content API, and the second stage used the returned, processed document content to answer the question.",
        "Separating selection from answering limited unnecessary retrieval and model context, with the aim of reducing token costs and response time. It also introduced a dependency: the answering stage needed the selector to find the appropriate material.",
      ],
    },
    upload: {
      heading: "Treat an upload as part of a task",
      paragraphs: [
        "A document arriving in WhatsApp did not mean the underlying task was complete.",
        "I integrated media retrieval, OCR, and company-backend storage workflows so uploaded files and extracted information could be associated with the correct account and task. This supported identification and KYC documents alongside other forms and attachments.",
        "The work connected a familiar interaction—sending a file—to the processing and submission required by the HR system.",
      ],
    },
  },

  deployment: {
    id: "deployment-and-delivery",
    heading: "Deployment and delivery",
    paragraphs: [
      "I deployed the containerized application on AWS EC2, coordinating server setup and connectivity with the infrastructure team. I configured messaging webhooks and used Postman to inspect and test the APIs behind the workflows.",
      "Throughout development, I led demonstrations and technical walkthroughs to gather feedback and refine the experience.",
    ],
    /** the rollout qualification, verbatim — prepared for, not completed */
    rollout: "At the stage documented here, the platform was being prepared for integration into ICICI Bank’s internal infrastructure.",
  },

  tools: {
    id: "tools-and-infrastructure",
    heading: "Tools and infrastructure",
    columns: ["Area", "Tools and approach"],
    rows: [
      ["Messaging", "Meta WhatsApp Business APIs · Wacto · Webhooks"],
      ["Workflow orchestration", "Redis-backed state machine · Task handlers"],
      ["Infrastructure", "Docker · AWS EC2"],
      ["Backend integration", "Veytan and company REST APIs · Postman"],
      ["Documents", "Media APIs · OCR · Company-backend storage integration"],
      ["Policy questions", "Two-stage Claude document selection and answering"],
    ] as [string, string][],
  },

  takeaways: {
    id: "what-i-took-from-it",
    heading: "What I took from it",
    paragraphs: [
      "Building this application taught me to consider the conversation and the system together. A simpler choice on screen could require careful state handling underneath; a useful backend capability still needed an interaction someone could navigate.",
      "I also learned how much progress depended on working across boundaries: clarifying requirements, understanding another team’s API, debugging an integration, and following the journey through to completion.",
    ],
  },
};

/** "On this page" */
export const buzzworksSections = [
  { id: buzzworks.intro.id, label: "HR workflows, inside a conversation" },
  { id: buzzworks.explore.id, label: "Explore the experience" },
  { id: buzzworks.design.id, label: "Designing within WhatsApp" },
  { id: buzzworks.behind.id, label: "Behind the conversation" },
  { id: buzzworks.decisions.id, label: "Engineering decisions" },
  { id: buzzworks.deployment.id, label: "Deployment and delivery" },
  { id: buzzworks.tools.id, label: "Tools and infrastructure" },
  { id: buzzworks.takeaways.id, label: "What I took from it" },
];
