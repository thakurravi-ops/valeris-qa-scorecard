# Valeris PBV QA Scorecard — Reference Guide

## Overview

A single-page web application for Pharmacy Benefits Verification (PBV) call quality assurance. Includes a **QA Call Scorecard** (score-based, 1–5 per check) and an **AI Agent Pre-Live Checklist** (Go/No-Go binary).

**Live URL:** https://thakurravi-ops.github.io/valeris-qa-scorecard/

**GitHub Repo:** https://github.com/thakurravi-ops/valeris-qa-scorecard

---

## Features

| Feature | Description |
|---|---|
| **Score-Based QA** | Each check scored 1–5 (not Pass/Fail). Overall weighted score determines Successful (≥80%) or Fail. |
| **AI-Assisted Scoring** | Upload call script + patient data + transcript → Claude API auto-scores all 19 checks with justifications. |
| **AI Pre-Live Checklist** | Binary Pass/Fail for Go/No-Go launch decisions. Blockers must all pass. |
| **Admin Panel** | Add/edit/delete checks, manage programs, adjust scoring weights — no code changes needed. |
| **Google Sheet Sync** | Config + submissions stored in Google Sheets for co-ownership across the team. |
| **Offline Fallback** | Works locally with hardcoded defaults if no Google Sheet is connected. |
| **CSV Export** | Export individual or all submissions as CSV. Copy to clipboard supported. |
| **JSON Config** | Export/import config as JSON for backup or sharing across environments. |

---

## Tabs

### 1. Call Scorecard
- Fill call metadata (program, ref ID, payer, etc.)
- **AI-Assisted Scoring** (collapsible section):
  - Upload/paste: Approved Call Script, Patient Data, Call Transcript
  - Click "Analyze & Auto-Score" → Claude API scores all checks with notes
  - Click "Auto-Fill Metadata Only" → extracts program, payer, call type from transcript
  - Requires Anthropic API key (set in Admin Panel → Settings)
- Rate each check on a **1–5 scale** + N/A
- Score legend: **5** Excellent, **4** Good, **3** Acceptable, **2** Needs Work, **1** Poor
- Live weighted score calculates as you go
- **≥80% = Successful**, **<80% = Fail**
- Weights: P0 checks × 3, P1 × 2, P2 × 1

### 2. AI Pre-Live Checklist
- For AI agent Go/No-Go decisions before production launch
- Blocker items must all pass for GO verdict
- Warning items tracked but non-blocking

### 3. Submission Log
- All submitted scorecards stored in browser localStorage
- Export to CSV or copy to clipboard
- Delete individual entries or clear all

### 4. Google Sheet Setup
- Connect to a Google Sheet for auto-push of submissions
- Apps Script code provided — paste into Extensions → Apps Script
- Supports both QA and AI submission sheets plus config sheets

### 5. Admin Panel
- **QA Checks Editor** — inline edit ID, section, priority, name, description. Reorder with ↑↓. Add/delete checks.
- **AI Checks Editor** — same pattern with Blocker/Warning priorities.
- **Settings:**
  - Programs list (add/remove)
  - Pass threshold %, priority weights (P0/P1/P2)
  - Anthropic API key and model selection for AI-assisted scoring
- **Sync Controls** — save/load config to Google Sheet, export/import JSON.

---

## QA Check Items (19 checks)

### Section A: Call Introduction & Compliance (P0)
| ID | Check | Description |
|---|---|---|
| A1 | Program Identification | Agent correctly states the program name during call opening |
| A2 | Caller Identification | Agent identifies as calling on behalf of the correct program |
| A3 | Outbound Disclosure (OBD) | Agent provides required outbound disclosure statement |
| A4 | Callback Number Accuracy | Callback number matches program's official number |

### Section B: Medication Handling (P0)
| ID | Check | Description |
|---|---|---|
| B1 | Drug Name Pronunciation | Medication names pronounced clearly and correctly |
| B2 | Drug Name Documentation | Medication names spelled correctly in output |
| B3 | No System Artifacts in Drug Name | No system tags/codes appended to medication name |

### Section C: Information Accuracy (P0)
| ID | Check | Description |
|---|---|---|
| C1 | No Fabricated Information | No unverified benefit details confirmed or generated |
| C2 | Call Completion Accuracy | Call not marked complete while fields are missing |
| C3 | Benefits Output Accuracy | All documented fields match what the payer stated |

### Section D: Communication Quality (P1)
| ID | Check | Description |
|---|---|---|
| D1 | No Overtalk / Communication Lag | Agent doesn't speak over payer rep, no excessive delays |
| D2 | Professional Language & Tone | Professional, clear, courteous language throughout |
| D3 | No Background Noise | No audible distractions during the call |
| D4 | No Fillers or Informal Language | No "yeah", "uh-huh", "like", "you know" — uses "yes", "understood", "correct" |

### Section E: Member Verification & Data (P1)
| ID | Check | Description |
|---|---|---|
| E1 | Verification Sequence | Standard payer auth flow — name, DOB first, then member ID |
| E2 | Patient Data Accuracy | Member identifiers match payer records |

### Section F: Call Efficiency & Process (P2)
| ID | Check | Description |
|---|---|---|
| F1 | Within Max Attempt Policy | Call attempts within allowed maximum |
| F2 | IVR Navigation | Successfully navigated payer IVR to live rep |
| F3 | Correct Disposition | Disposition accurately reflects call outcome |

---

## AI Pre-Live Check Items (23 checks)

### Script & Prompt Compliance (Blocker)
S1–S6: Call intro script, program name config, caller ID, callback number, drug pronunciation dictionary, no system artifacts.

### Conversation & Voice Quality
V1–V2 (Blocker): Response latency ≤2s, VAD tuned — no overtalk.
V3–V4 (Warning): Interruption handling, end-of-turn detection.

### Benefits Data Extraction
T1–T3 (Blocker): All mandatory fields in template, entity extraction ≥95%, drug name correct in output.
T4 (Warning): Verification sequence matches standard flow.

### Edge Cases & Safety
E1–E4 (Blocker): No hallucination, AI detection handling, human transfer path, max attempt guardrail.
E5–E7 (Warning): IVR navigation for top payers, prior call context handling, disposition logic.

---

## Scoring System

```
Per-check score: 1–5 (or N/A)
Weight by priority: P0 × 3, P1 × 2, P2 × 1

Overall % = Σ(score × weight) / Σ(5 × weight) × 100
  (N/A checks excluded from both numerator and denominator)

Verdict:
  ≥ 80%  →  Successful
  < 80%  →  Fail

Threshold and weights are configurable in Admin Panel → Settings.
```

---

## AI-Assisted Scoring Setup

1. Get an Anthropic API key from https://console.anthropic.com/
2. Open the scorecard → **Admin Panel** → **Settings** → paste the API key → **Apply Settings**
3. Go to **Call Scorecard** tab → expand **AI-Assisted Scoring**
4. Upload or paste:
   - **Approved Call Script** — the reference script the agent should follow
   - **Patient Data** — patient name, DOB, member ID, drug, payer info
   - **Call Transcript** — the actual call being reviewed
5. Click **Analyze & Auto-Score**
6. Review AI-suggested scores and notes, adjust as needed, then submit

**Models available:**
- Claude Sonnet 4 (recommended) — more accurate, slower
- Claude Haiku 4.5 — faster, cheaper, good for high-volume QA

**API key security:** Stored only in your browser's localStorage. Never sent to any server except Anthropic's API directly.

---

## Google Sheet Architecture

```
Google Sheet (1 workbook)
├── QA Submissions    ← Auto-filled on scorecard submit
├── AI Submissions    ← Auto-filled on AI checklist submit
├── QA Config         ← Check items: ID, Section, Priority, Name, Description
├── AI Config         ← AI check items: ID, Section, Priority, Name, Description
└── Settings          ← Key-Value pairs: programs, passThreshold, weightP0/P1/P2
```

### Quick Setup
1. Create a Google Sheet
2. Extensions → Apps Script → paste the script from `gsheet_setup/setup_and_deploy.gs`
3. **Select `setupAll` from the function dropdown → Run** (creates all 5 tabs with data)
4. Deploy → New Deployment → Web app (Execute as: Me, Access: Anyone)
5. Copy the Web App URL → paste into scorecard's Google Sheet Setup tab → Save

### Co-Ownership
Anyone with edit access to the Google Sheet can modify check items and settings directly. Changes are pulled into the scorecard via Admin Panel → "Load from Google Sheet".

---

## Files

| File | Purpose |
|---|---|
| `Valeris_QA_Scorecard.html` | The complete scorecard application (single file) |
| `gsheet_setup/setup_and_deploy.gs` | Google Apps Script — paste into Extensions → Apps Script, run `setupAll` |
| `Valeris_QA_Scorecard_Reference.md` | This reference document |

---

## Deployment (GitHub Pages)

**Repo:** https://github.com/thakurravi-ops/valeris-qa-scorecard
**Live:** https://thakurravi-ops.github.io/valeris-qa-scorecard/

To update:
```bash
cd ~/claude-files/valeris-qa-scorecard
# Edit index.html
git add index.html
git commit -m "description of change"
git push
# GitHub Pages auto-deploys within ~1 minute
```

To sync local copy ↔ repo copy:
```bash
# After editing the main file, copy to repo and push:
cp ~/claude-files/Valeris_QA_Scorecard.html ~/claude-files/valeris-qa-scorecard/index.html
cd ~/claude-files/valeris-qa-scorecard && git add . && git commit -m "Update" && git push
```
