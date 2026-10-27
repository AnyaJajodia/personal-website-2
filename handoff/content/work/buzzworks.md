# Buzzworks

## There’s a workflow behind that message.

Designing and building a personalized WhatsApp HR platform, from account verification and onboarding to everyday employee requests.

Role: Full Stack Software Development Intern
Period: May 2025–May 2026
Scope: Conversational UX design · Full-stack development · Workflow orchestration · API integration · Deployment

## HR workflows, inside a conversation

Buzzworks provides HR services and software to businesses. I extended its existing Veytan HR platform into WhatsApp, allowing candidates and employees to complete tasks through a conversation connected to their accounts.

The application supported onboarding, forms, documents, offers, signatures, leave requests, status checks, and company-policy questions. It was developed for Buzzworks’ own use and as a service for client companies.

I was the sole developer responsible for designing and building the conversational application from scratch. I worked with product stakeholders on requirements, company teams on existing and additional APIs, the infrastructure team on hosting, and Wacto’s team on messaging integration.

## Explore the experience

Different workflows called for different interactions: selecting a task, correcting a form, reviewing an offer, or asking an open-ended question.

The reconstructed examples below show several of those journeys, using fictional information.

<!-- INSERT TABBED WHATSAPP RECONSTRUCTION HERE.
See implementation notes below. -->

## Designing within WhatsApp

### Make choices easier to navigate

I used buttons and single-choice lists where users were selecting from known options, keeping text input for information they needed to provide. Menus, contextual prompts, and return paths helped people move through the available workflows without memorizing commands.

### Let people correct an answer

Forms did not end with the first round of inputs. I built a review step that summarized the collected information and let users select individual fields to edit before submission.

After a correction, the application returned an updated summary so users could check their information without starting over.

### Work within the platform’s limits

WhatsApp limited selection lists to ten items. When an account had more pending tasks, I displayed the first ten and explained which additional tasks would become accessible as the visible ones were completed.

This made the constraint explicit and gave users a next action rather than leaving the remaining tasks unexplained.

## Behind the conversation

I separated messaging integration, conversational workflow logic, and backend API interactions into modular services packaged with Docker.

Meta’s WhatsApp Business APIs, Wacto, and webhooks connected incoming messages to the application. A Redis-backed state machine tracked the active workflow and collected information, while task handlers retrieved account-specific data and submitted updates through Veytan and company APIs.

Collecting an answer and completing a backend task were separate steps. The application needed to preserve that distinction while supporting review, editing, and submission.

<!-- INSERT HIGH-LEVEL SYSTEM DIAGRAM HERE. -->

## Engineering decisions

### Select the documents before asking the model to read them

For company-policy questions, I designed a two-stage Claude workflow to avoid sending the full document collection into every request.

The first stage received the question alongside document titles and descriptions, then selected relevant files. The application retrieved those files through a content API, and the second stage used the returned, processed document content to answer the question.

Separating selection from answering limited unnecessary retrieval and model context, with the aim of reducing token costs and response time. It also introduced a dependency: the answering stage needed the selector to find the appropriate material.

<!-- INSERT TWO-STAGE POLICY WORKFLOW DIAGRAM HERE. -->

### Treat an upload as part of a task

A document arriving in WhatsApp did not mean the underlying task was complete.

I integrated media retrieval, OCR, and company-backend storage workflows so uploaded files and extracted information could be associated with the correct account and task. This supported identification and KYC documents alongside other forms and attachments.

The work connected a familiar interaction—sending a file—to the processing and submission required by the HR system.

## Deployment and delivery

I deployed the containerized application on AWS EC2, coordinating server setup and connectivity with the infrastructure team. I configured messaging webhooks and used Postman to inspect and test the APIs behind the workflows.

Throughout development, I led demonstrations and technical walkthroughs to gather feedback and refine the experience.

At the stage documented here, the platform was being prepared for integration into ICICI Bank’s internal infrastructure.

## Tools and infrastructure

| Area | Tools and approach |
| --- | --- |
| Messaging | Meta WhatsApp Business APIs · Wacto · Webhooks |
| Workflow orchestration | Redis-backed state machine · Task handlers |
| Infrastructure | Docker · AWS EC2 |
| Backend integration | Veytan and company REST APIs · Postman |
| Documents | Media APIs · OCR · Company-backend storage integration |
| Policy questions | Two-stage Claude document selection and answering |

## What I took from it

Building this application taught me to consider the conversation and the system together. A simpler choice on screen could require careful state handling underneath; a useful backend capability still needed an interaction someone could navigate.

I also learned how much progress depended on working across boundaries: clarifying requirements, understanding another team’s API, debugging an integration, and following the journey through to completion.

<!-- INTERNAL IMPLEMENTATION AND EVIDENCE NOTES — DO NOT RENDER

CONTENT AND OWNERSHIP
Anya designed and built the conversational UX, application, and orchestration.
She did not build the entire existing Veytan platform.
Company teams supported APIs and infrastructure.
Wacto supported messaging integration.
Dates: May 2025–May 2026.

VISUAL DISTRIBUTION
1. One tabbed WhatsApp reconstruction under "Explore the experience."
2. One high-level architecture diagram under "Behind the conversation."
3. One focused policy workflow diagram within "Engineering decisions."
Avoid additional visuals or lists that repeat the surrounding explanation.

WHATSAPP RECONSTRUCTION
Four scenarios:
- Complete a form — default.
- Ask about a policy.
- Manage leave.
- Review an offer.

Use supplied screenshots as private references for interaction patterns.
Do not render the original screenshots or embed proprietary materials.

Caption:
"Illustrative workflows reconstructed using fictional information. No employee
data or proprietary application screens are shown."

Use one shared panel with scenario controls above it.
Keep the panel compact and responsive; avoid major height jumps between tabs.
Provide accessible scenario controls and keyboard operation.

Use selected clickable choices and Next / Back / Restart controls.
Do not require typing, actual uploads, live AI, authentication, or backend access.
Do not autoplay long conversations.

SCENARIO DETAILS
Complete a form:
Demonstrate selection, short inputs, a fictional attachment, summary,
selection of one field to edit, updated summary, and submission confirmation.
Preserve the correction loop.
Do not reproduce personal details, résumé previews, or real documents.

Ask about a policy:
Demonstrate a question, a brief answer based on fictional policy material,
and an "Ask another question" option.
Do not copy internal policies or present sample terms as actual entitlements.

Manage leave:
Demonstrate the menu, fictional leave balances, and a sample leave policy.
The application supported leave requests, but confirm the actual request
sequence before reconstructing it.

Review an offer:
Demonstrate a fictional document card, accept/reject choice, sample signature
upload, and confirmation.
Use a generic signature placeholder, never a real signature.
Document viewing belongs within these scenarios, not a separate fifth tab.

INTERACTION LANGUAGE
Use buttons, quick replies, list selections, document cards, and concise
confirmation messages where supported by the references.
Do not describe these as conventional web radio buttons inside WhatsApp.
Do not invent authentication methods or unconfirmed branches.

TASK-LIST LIMIT
Implemented approach: show the first ten pending tasks and explain that
additional tasks become accessible as visible tasks are completed.
Do not describe this as pagination, "load more," or a prioritization algorithm.
Do not claim measured improvements in task completion.

ARCHITECTURE
Show the confirmed relationships between:
Employee/candidate in WhatsApp; messaging integration; workflow logic and
Redis state; company APIs; company systems and document operations.
Docker packages application services; AWS EC2 hosts the application.
Keep this conceptual, not a detailed network or deployment map.

POLICY WORKFLOW
Question + document titles/descriptions
→ Claude stage 1 selects relevant files
→ content API retrieves selected documents
→ Claude stage 2 answers using returned content
→ answer delivered in WhatsApp.

The content API supplied processed/chunked content.
Do not imply Anya independently built that upstream processing service.
Do not invent vector databases, embeddings, citations, fallback behavior,
or measured token/cost/latency reductions.
Describe reduced context and retrieval as the design rationale.
Do not claim an asymptotic time-complexity improvement.

TECHNICAL BOUNDARIES
Do not infer S3, Kubernetes, autoscaling, retry safety, duplicate suppression,
or synchronization guarantees.
Confirm languages and frameworks before expanding the stack.
Do not restore conflicting FastAPI claims without confirmation.

PERFORMANCE
Earlier résumé versions cite sub-200ms responses at 10K+ sessions.
Leave those figures out of public copy until the measured operation, workload,
session definition, and environment are established.

ROLLOUT
AWS EC2 deployment is confirmed.
ICICI integration was being prepared; completed bank rollout is not established.

CONFIDENTIALITY
Do not publish employee records, internal policy text, proprietary documents,
source code, credentials, infrastructure addresses, or internal endpoints.
Do not invent testimonials or outcomes.

END INTERNAL NOTES -->