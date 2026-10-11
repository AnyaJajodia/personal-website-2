# Buzzworks
Onboarding, one message at a time.
A WhatsApp-based HR platform built around multi-step employee workflows.
Role: Full Stack Software Development Intern
Period: May 2025–2027 [EDIT: placeholder end year]
Tools: Docker · Redis · Meta’s Business API
## Overview
At Buzzworks, I was the sole engineer building a WhatsApp HR onboarding system from scratch, working with product stakeholders to translate business requirements into conversational workflows.
## My contribution
I used Docker, Redis, and Meta’s Business API to build the system, evaluating latency and concurrency tradeoffs and achieving sub-200ms responses at 10K+ sessions.
A Redis-backed state machine tracked multi-step workflows including OTP login, offer letters, signatures, KYC, document collection, and leave applications. I integrated OCR and media APIs for document fields and uploads, and enabled multilingual onboarding.
I led demos and technical walkthroughs for internal stakeholders. The system was being prepared for integration into ICICI Bank’s internal infrastructure.
## What I took from it
A conversational interface still needs a carefully structured system underneath it. Each message has to arrive in the right context, and the application needs to know what has happened, what is missing, and what comes next.
