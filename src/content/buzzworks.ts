/**
 * The Buzzworks detail page — approved copy from handoff/content/work/buzzworks.md,
 * verbatim. The file's internal notes (the HTML comment at its end) are not
 * rendered.
 *
 * The one invented thing on the page is the conversation below: fictional, as
 * the notes allow, captioned with the notes' own wording, and limited to flows
 * the page documents. No employee data, proprietary screens, code, endpoints
 * or credentials; no stack details, metrics or rollout status beyond the copy.
 */

export type Capability = { id: string; name: string; text: string };

export type Message = {
  from: "employee" | "assistant";
  time: string;
  text?: string;
  /** a short list inside an assistant message */
  list?: string[];
  /** quick-reply buttons under an assistant message */
  replies?: string[];
  /** an attached photo (shown as a generic document, never a real one) */
  attachment?: string;
  /** the documented flow this message illustrates (a capability id) */
  flow?: string;
};

const capabilities: Capability[] = [
  { id: "cap-access", name: "Access an account", text: "Verify identity through an OTP-based flow and establish the account context needed for personalized interactions." },
  { id: "cap-tasks", name: "Find pending tasks", text: "Retrieve outstanding tasks associated with the employee or candidate and guide them through the relevant steps." },
  { id: "cap-forms", name: "Complete forms", text: "Collect information through a sequence of questions, validate responses, and support review and correction within the implemented workflows." },
  { id: "cap-offers", name: "Review offers and provide signatures", text: "Present offer-related information and support acceptance, rejection, and signature collection." },
  { id: "cap-kyc", name: "Complete KYC and submit documents", text: "Collect identification, banking information, and other required details, with document uploads and processing integrated into the workflow." },
  { id: "cap-leave", name: "Apply for leave", text: "Submit leave requests through the conversation, connecting the interaction to the company’s existing processes." },
  { id: "cap-status", name: "Check statuses", text: "Retrieve the status of supported tasks and requests without requiring the user to navigate the web portal." },
  {
    id: "cap-policy",
    name: "Ask about company policies",
    text: "Use a two-agent Claude system to answer company-policy questions, providing another conversational route into information that would otherwise require navigating documents.",
  },
  { id: "cap-language", name: "Choose a language", text: "Support multilingual interactions across the onboarding experience." },
];

export const buzzworks = {
  name: "Buzzworks",
  title: "There’s a workflow behind that message.",
  subtitle: "Building a personalized WhatsApp HR platform, from account verification and onboarding to employee requests.",
  meta: [
    { label: "Role", value: "Full Stack Software Development Intern" },
    { label: "Period", value: "May 2025–May 2026" },
    { label: "Scope", value: "Application design and development · Workflow orchestration · API integration · Deployment" },
  ],

  intro: {
    id: "hr-workflows",
    heading: "HR workflows, inside a conversation",
    paragraphs: [
      "An employee might need to complete a form, upload a document, check an application, or find out what still needs doing. Each action involves information and processes that already exist somewhere in the company’s systems.",
      "At Buzzworks, I built a WhatsApp-based interface to those workflows, extending the existing Veytan HR platform into a conversational experience.",
      "Employees could verify their identity, access relevant tasks, provide information, submit documents, and make requests through the chat. Behind each exchange, the application connected the conversation to the person’s account and the company’s backend.",
      "The platform was developed as a service Buzzworks could offer client companies, rather than solely as an internal tool.",
    ],
  },

  owned: {
    id: "what-i-owned",
    heading: "What I owned",
    paragraphs: [
      "I was the sole developer building the conversational application and workflow orchestration from scratch over a year-long internship.",
      "I worked with product stakeholders to translate HR requirements into conversational flows, implemented the application and integrations, and led demos and technical walkthroughs.",
      "The company’s teams supplied existing APIs and helped provide additional endpoints where needed. I coordinated with the infrastructure team on the EC2 environment and with Wacto’s team on messaging integration.",
      "My responsibility was making those pieces work together as a usable application: deciding what the conversation needed to know, what should happen next, and how each action reached the underlying system.",
    ],
  },

  conversation: {
    id: "conversation",
    label: "An illustrative conversation",
    /** the notes' own caption */
    caption: "Illustrative conversation reconstructed to explain the workflow. No employee data or proprietary application screens shown.",
    contact: "HR assistant",
    messages: [
      { from: "employee", time: "10:02", text: "Hi" },
      { from: "assistant", time: "10:02", text: "Hello! Which language would you like to continue in?", replies: ["English", "हिन्दी", "मराठी"], flow: "cap-language" },
      { from: "employee", time: "10:02", text: "English" },
      { from: "assistant", time: "10:02", text: "To get started, please enter the 6-digit code sent to your registered mobile number.", flow: "cap-access" },
      { from: "employee", time: "10:03", text: "••••••" },
      { from: "assistant", time: "10:03", text: "Thanks, Meera — you’re verified. You have 3 pending tasks:", list: ["KYC documents", "Personal details form", "Offer letter"], flow: "cap-tasks" },
      { from: "employee", time: "10:03", text: "1" },
      { from: "assistant", time: "10:03", text: "Please send a clear photo of your PAN card.", flow: "cap-kyc" },
      { from: "employee", time: "10:04", attachment: "PAN card · photo" },
      { from: "assistant", time: "10:04", text: "I read these details from your document. Are they correct?", list: ["Name: Meera K.", "PAN: ABCDE••••F"], replies: ["Confirm", "Edit"], flow: "cap-forms" },
      { from: "employee", time: "10:05", text: "Confirm" },
      { from: "assistant", time: "10:05", text: "Saved to your KYC task. 2 tasks left: Personal details form, Offer letter." },
    ] satisfies Message[],
  },

  capabilities: {
    id: "capabilities",
    heading: "One conversation, several kinds of work",
    items: capabilities,
  },

  personalized: {
    id: "personalized",
    heading: "Personalized beyond the greeting",
    paragraphs: [
      "Personalization meant more than inserting a name into a message.",
      "The application needed the right account context, the person’s pending tasks, and their current position in a workflow. Those details determined which questions to ask and which actions were relevant.",
      "I integrated the conversation with Veytan APIs for retrieving information and submitting updates. The messaging layer became another interface to existing HR processes, while the workflow engine managed the steps between a request and its completion.",
    ],
  },

  system: {
    id: "system",
    heading: "The system behind the messages",
    paragraphs: [
      "I separated messaging integration, conversational workflow logic, and backend API interactions into modular services packaged with Docker.",
      "A Redis-backed state machine tracked the conversation’s current stage and the information collected along the way. Rather than treating every message as a new request, the application interpreted it within the active workflow.",
      "Meta’s WhatsApp Business APIs and Wacto formed part of the messaging integration. Company APIs connected the application to account information, tasks, forms, and document operations.",
      "I used Postman to inspect and test API behavior, then built the orchestration needed to turn individual endpoints into complete conversational experiences.",
    ],
  },

  difficult: {
    id: "difficult-parts",
    heading: "Engineering the difficult parts",
    parts: [
      {
        id: "policy-questions",
        heading: "Policy questions needed a different approach",
        paragraphs: [
          "A structured form has an expected sequence. A question about company policy can arrive in many different forms.",
          "I built a two-agent Claude system for policy inquiries alongside the structured HR workflows. This extended the application beyond collecting and submitting information into helping employees find answers within company-policy material.",
        ],
      },
      {
        id: "document-uploads",
        heading: "A document upload was the start of a workflow",
        paragraphs: [
          "Receiving a file in WhatsApp did not, by itself, complete a document task.",
          "The application had to obtain the media through the relevant APIs, process the document where required, and associate the resulting information and file references with the correct account and task.",
          "I integrated OCR and media APIs to support document fields and uploads, including identification information such as PAN and Aadhaar. Document handling connected the conversation to the company’s backend storage and submission workflows.",
        ],
      },
      {
        id: "alignment",
        heading: "Conversations and records had to stay aligned",
        paragraphs: [
          "The chat, the in-progress form, and the backend record each represented a different part of the same process.",
          "The Redis-backed state machine tracked progress while task handlers collected information and called the appropriate APIs. Review and editing behavior allowed users to correct information within supported flows before submission.",
          "Keeping those responsibilities explicit was central to the design: collecting an answer and completing a backend task were separate steps.",
        ],
      },
    ],
  },

  deployment: {
    id: "deployment",
    heading: "Deployment and integration",
    paragraphs: [
      "I deployed the containerized application on an AWS EC2 instance, coordinating with the company’s infrastructure team on server setup and connectivity.",
      "The work included configuring messaging webhooks and connecting externally received events to the application services. Integration required coordination across the application, hosting environment, messaging provider, and existing company APIs.",
      "I also led product demonstrations and technical walkthroughs to explain the flows, gather feedback, and prepare the system for further integration.",
    ],
    /** the rollout qualification, verbatim — prepared for, not completed */
    rollout: "At the stage documented here, the platform was being prepared for integration into ICICI Bank’s internal infrastructure.",
  },

  performance: {
    id: "performance",
    heading: "Performance considerations",
    paragraphs: [
      "Latency and concurrency informed my architecture decisions, including the use of Redis for conversation state and Docker for modular service deployment.",
      "Responsiveness depended on more than the speed of an individual handler. Authentication, company API calls, document processing, and messaging delivery all contributed to the experience.",
    ],
  },

  tools: {
    id: "tools",
    heading: "Tools and infrastructure",
    columns: ["Area", "Tools and responsibilities"],
    rows: [
      ["Messaging", "Meta WhatsApp Business APIs, Wacto, webhook integration"],
      ["Workflow state", "Redis-backed state machine and task handlers"],
      ["Service packaging", "Docker and modular application services"],
      ["Hosting", "AWS EC2"],
      ["Backend integration", "Veytan and company REST APIs"],
      ["API testing", "Postman"],
      ["Documents", "Media APIs, OCR, file uploads, and company-backend storage integration"],
      ["Policy inquiries", "Two-agent Claude system"],
    ] as [string, string][],
  },

  takeaways: {
    id: "what-i-took-from-it",
    heading: "What I took from it",
    paragraphs: [
      "A conversational interface still needs a carefully structured system underneath it.",
      "Each message has to arrive in the right context. The application needs to know who is speaking, what they are trying to do, what information has already been collected, and what the backend has actually accepted.",
      "Building the system also taught me how much engineering happens between teams and services: understanding an API, clarifying a requirement, debugging a webhook, and making sure the whole journey works beyond an isolated endpoint.",
    ],
    punchline: "The visible interaction might be a short exchange. Making that exchange useful involves considerably more.",
  },
};

/** "On this page": the employee's journey through the case study */
export const buzzworksSections = [
  { id: buzzworks.intro.id, label: "HR workflows, inside a conversation" },
  { id: buzzworks.owned.id, label: "What I owned" },
  { id: buzzworks.conversation.id, label: "An illustrative conversation" },
  { id: buzzworks.capabilities.id, label: "One conversation, several kinds of work" },
  { id: buzzworks.personalized.id, label: "Personalized beyond the greeting" },
  { id: buzzworks.system.id, label: "The system behind the messages" },
  { id: buzzworks.difficult.id, label: "Engineering the difficult parts" },
  { id: buzzworks.deployment.id, label: "Deployment and integration" },
  { id: buzzworks.tools.id, label: "Tools and infrastructure" },
  { id: buzzworks.takeaways.id, label: "What I took from it" },
];
