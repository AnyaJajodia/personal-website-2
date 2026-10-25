# Buzzworks

## There’s a workflow behind that message.

Building a personalized WhatsApp HR platform, from account verification and onboarding to employee requests.

Role: Full Stack Software Development Intern
Period: May 2025–May 2026
Scope: Application design and development · Workflow orchestration · API integration · Deployment

## HR workflows, inside a conversation

An employee might need to complete a form, upload a document, check an application, or find out what still needs doing. Each action involves information and processes that already exist somewhere in the company’s systems.

At Buzzworks, I built a WhatsApp-based interface to those workflows, extending the existing Veytan HR platform into a conversational experience.

Employees could verify their identity, access relevant tasks, provide information, submit documents, and make requests through the chat. Behind each exchange, the application connected the conversation to the person’s account and the company’s backend.

The platform was developed as a service Buzzworks could offer client companies, rather than solely as an internal tool.

## What I owned

I was the sole developer building the conversational application and workflow orchestration from scratch over a year-long internship.

I worked with product stakeholders to translate HR requirements into conversational flows, implemented the application and integrations, and led demos and technical walkthroughs.

The company’s teams supplied existing APIs and helped provide additional endpoints where needed. I coordinated with the infrastructure team on the EC2 environment and with Wacto’s team on messaging integration.

My responsibility was making those pieces work together as a usable application: deciding what the conversation needed to know, what should happen next, and how each action reached the underlying system.

## One conversation, several kinds of work

### Access an account

Verify identity through an OTP-based flow and establish the account context needed for personalized interactions.

### Find pending tasks

Retrieve outstanding tasks associated with the employee or candidate and guide them through the relevant steps.

### Complete forms

Collect information through a sequence of questions, validate responses, and support review and correction within the implemented workflows.

### Review offers and provide signatures

Present offer-related information and support acceptance, rejection, and signature collection.

### Complete KYC and submit documents

Collect identification, banking information, and other required details, with document uploads and processing integrated into the workflow.

### Apply for leave

Submit leave requests through the conversation, connecting the interaction to the company’s existing processes.

### Check statuses

Retrieve the status of supported tasks and requests without requiring the user to navigate the web portal.

### Ask about company policies

Use a two-agent Claude system to answer company-policy questions, providing another conversational route into information that would otherwise require navigating documents.

### Choose a language

Support multilingual interactions across the onboarding experience.

## Personalized beyond the greeting

Personalization meant more than inserting a name into a message.

The application needed the right account context, the person’s pending tasks, and their current position in a workflow. Those details determined which questions to ask and which actions were relevant.

I integrated the conversation with Veytan APIs for retrieving information and submitting updates. The messaging layer became another interface to existing HR processes, while the workflow engine managed the steps between a request and its completion.

## The system behind the messages

I separated messaging integration, conversational workflow logic, and backend API interactions into modular services packaged with Docker.

A Redis-backed state machine tracked the conversation’s current stage and the information collected along the way. Rather than treating every message as a new request, the application interpreted it within the active workflow.

Meta’s WhatsApp Business APIs and Wacto formed part of the messaging integration. Company APIs connected the application to account information, tasks, forms, and document operations.

I used Postman to inspect and test API behavior, then built the orchestration needed to turn individual endpoints into complete conversational experiences.

## Engineering the difficult parts

### Policy questions needed a different approach

A structured form has an expected sequence. A question about company policy can arrive in many different forms.

I built a two-agent Claude system for policy inquiries alongside the structured HR workflows. This extended the application beyond collecting and submitting information into helping employees find answers within company-policy material.

### A document upload was the start of a workflow

Receiving a file in WhatsApp did not, by itself, complete a document task.

The application had to obtain the media through the relevant APIs, process the document where required, and associate the resulting information and file references with the correct account and task.

I integrated OCR and media APIs to support document fields and uploads, including identification information such as PAN and Aadhaar. Document handling connected the conversation to the company’s backend storage and submission workflows.

### Conversations and records had to stay aligned

The chat, the in-progress form, and the backend record each represented a different part of the same process.

The Redis-backed state machine tracked progress while task handlers collected information and called the appropriate APIs. Review and editing behavior allowed users to correct information within supported flows before submission.

Keeping those responsibilities explicit was central to the design: collecting an answer and completing a backend task were separate steps.

## Deployment and integration

I deployed the containerized application on an AWS EC2 instance, coordinating with the company’s infrastructure team on server setup and connectivity.

The work included configuring messaging webhooks and connecting externally received events to the application services. Integration required coordination across the application, hosting environment, messaging provider, and existing company APIs.

I also led product demonstrations and technical walkthroughs to explain the flows, gather feedback, and prepare the system for further integration.

At the stage documented here, the platform was being prepared for integration into ICICI Bank’s internal infrastructure.

## Performance considerations

Latency and concurrency informed my architecture decisions, including the use of Redis for conversation state and Docker for modular service deployment.

Responsiveness depended on more than the speed of an individual handler. Authentication, company API calls, document processing, and messaging delivery all contributed to the experience.

## Tools and infrastructure

| Area | Tools and responsibilities |
| --- | --- |
| Messaging | Meta WhatsApp Business APIs, Wacto, webhook integration |
| Workflow state | Redis-backed state machine and task handlers |
| Service packaging | Docker and modular application services |
| Hosting | AWS EC2 |
| Backend integration | Veytan and company REST APIs |
| API testing | Postman |
| Documents | Media APIs, OCR, file uploads, and company-backend storage integration |
| Policy inquiries | Two-agent Claude system |

## What I took from it

A conversational interface still needs a carefully structured system underneath it.

Each message has to arrive in the right context. The application needs to know who is speaking, what they are trying to do, what information has already been collected, and what the backend has actually accepted.

Building the system also taught me how much engineering happens between teams and services: understanding an API, clarifying a requirement, debugging a webhook, and making sure the whole journey works beyond an isolated endpoint.

The visible interaction might be a short exchange. Making that exchange useful involves considerably more.

---

<!-- INTERNAL IMPLEMENTATION AND EVIDENCE NOTES — DO NOT RENDER

CONFIDENTIALITY
Do not show proprietary application screens, employee records, company documents,
source code, credentials, infrastructure addresses, or internal API endpoints.

VISUAL MATERIAL
A fictional, clearly labeled conversation can illustrate the experience.
Caption:
"Illustrative conversation reconstructed to explain the workflow.
No employee data or proprietary application screens shown."

Do not present reconstructed conversations as screenshots of the deployed product.
A high-level architecture diagram may explain confirmed component relationships.
Do not invent endpoints, storage services, or security mechanisms.

OWNERSHIP
Anya built the conversational application and orchestration.
Company teams supported APIs and infrastructure; Wacto supported integration.
Do not imply Anya built the entire existing Veytan platform.

DATES
May 2025–May 2026 replaces older "Present" and placeholder dates.

STACK
Confirm final programming languages, frameworks, service names, and Docker setup.
Older discussions conflict about FastAPI. Do not include it without confirmation.
Do not infer Kubernetes, autoscaling, or independently scalable services.

DOCUMENT STORAGE
Company-backend storage integration is established.
Confirm the actual storage destination and file lifecycle before naming S3
or describing retention, encryption, or deletion behavior.

POLICY AGENTS
The two-agent Claude system appears in the supplied résumé history.
Confirm each agent's responsibility, document-access method, and actual
handling of unanswered questions before expanding this section.
Do not invent RAG, citations, confidence scores, or escalation mechanisms.

WORKFLOW DETAILS
Confirm the final status of nominee forms, prior-employment forms,
reminders, session recovery, and advanced editing before adding them.
Do not claim retry safety, duplicate suppression, or synchronization guarantees
without implementation evidence.

PERFORMANCE
Earlier résumé versions state sub-200ms responses at 10K+ sessions.
Retain as an internal claim pending measurement context:
what was timed, concurrent versus total sessions, workload, and environment.
Do not silently present it as end-to-end WhatsApp delivery latency.

ROLLOUT
AWS EC2 deployment is confirmed by Anya.
ICICI integration was being prepared; completed bank rollout is not established.

END INTERNAL NOTES -->