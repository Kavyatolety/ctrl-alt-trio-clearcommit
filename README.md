# ClearCommit

ClearCommit turns messy meeting transcripts into reviewable commitments with an owner, deadline, confidence score, and the original supporting evidence. It is designed around a human-confirmation step so inferred details are never presented as unquestionable facts.

Built by **ctrl+alt+trio** for the DevFest DC 2026 Build-a-thon.

## Demo

[Open the deployed application](https://clearcommit-devfest.ktolety.chatgpt.site)

## Core flow

1. Paste a meeting transcript or load the included sample.
2. Extract candidate commitments.
3. Review owners, due dates, confidence, and source evidence.
4. Copy a confirmation message or export the results as CSV.

## Run locally

Requirements: Node.js 22.13 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open the local URL shown in the terminal.

## Build

```bash
pnpm build
```

## Scope decision and limitation

This prototype prioritizes one complete transcript-to-follow-up workflow. Its extraction logic is intentionally lightweight for the sprint, and inferred owners or dates must be confirmed by a human. A production version would replace the prototype parser with structured model extraction and an editable approval step.

## Team

**ctrl+alt+trio** — three builders collaborating at DevFest DC 2026.

