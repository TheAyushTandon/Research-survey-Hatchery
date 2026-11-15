# Academic Research Questionnaire Platform

A modern, minimal, editorial digital research questionnaire platform developed to collect structured research responses from key stakeholders associated with academic business incubators in India.

The platform replaces conventional survey forms with an interactive, responsive questionnaire experience that preserves exact academic questions, hypotheses, scales, and selection rules without compromise.

---

## Architecture: Three Independent Deployments

As required by the PRD, the platform is structured into **three completely independent web applications**, with zero cross-application interconnection, separate API routes, separate configurations, and isolated Google Sheets destinations:

```
FORM QUESTIONAIRE HATCHERY/
├── founders/               # Deployment 1: Startup Founders & Entrepreneurs (54 Questions)
│   ├── app/                # Next.js App Router (page.tsx, layout.tsx, api routes)
│   ├── components/         # Reusable UI & Questionnaire Engine
│   ├── config/             # Verbatim Questionnaire Configuration (54 questions)
│   ├── lib/                # Google Sheets client, PDF generator, token auth
│   ├── package.json
│   └── ...
│
├── institutional/          # Deployment 2: Institutional Stakeholders (Two isolated flows)
│   ├── app/
│   │   ├── staff/          # Route for Incubator Managers & Operational Staff (10 Questions)
│   │   ├── faculty/        # Route for Faculty Members, Deans, HoDs, VCs (10 Questions)
│   │   └── page.tsx        # Institutional Gateway / Stakeholder Selector
│   ├── config/             # Separate configs for Staff (10Q) and Faculty (10Q)
│   ├── components/
│   ├── lib/
│   └── ...
│
├── government/             # Deployment 3: Government Agencies (42 Questions)
│   ├── app/                # Next.js App Router (page.tsx, layout.tsx, api routes)
│   ├── components/
│   ├── config/             # Verbatim Questionnaire Configuration (42 questions)
│   ├── lib/
│   └── ...
│
├── docs/                   # Content audits, architecture docs & deployment guides
├── scripts/                # HMAC Token generation utilities
└── package.json            # Root workspace orchestrator
```

---

## Original Questionnaires & Question Counts

The questionnaires are driven directly from the three authoritative source DOCX files:

| Deployment | Source Document | Target Stakeholder Groups | Question Count | Sections / Scales |
|---|---|---|---|---|
| `founders` | `Questionnaire_Startup_Founders_Entrepreneurs.docx` | Startup Founders, Co-founders, CEOs, Directors | **54 Questions** | Section A (24), Section B: H1 (10), Section B: H2 (10), Section C (10) |
| `institutional` | `Questionnaire_Faculty_and_Staff.docx` | **Group A:** Incubator Managers & Staff<br>**Group B:** Faculty Members, Deans, HoDs, VCs | **10 Questions** (Staff)<br>**10 Questions** (Faculty) | 5-point Likert & descriptive evaluation scales |
| `government` | `Questionnaire_Government_Agencies.docx` | Central/State Ministries, Funding Agencies, PSUs | **42 Questions** | Section A (12), Section B: H1 (10), Section B: H2 (10), Section C (10) |

---

## Design System

- **Visual Direction**: Editorial minimalism, clean typography, whitespace, approachable.
- **Palette Tokens**:
  - `Cool Horizon` (`#79addc`): Primary buttons, active selections, progress indicator, focus rings.
  - `Peach Glow` (`#ffc09f`): Secondary tags, track badge highlights.
  - `Light Gold` (`#ffee93`): Subtle alerts and accents.
  - `Lemon Chiffon` (`#fcf5c7`): Warm background notice boxes, instruction surfaces.
  - `Celadon` (`#adf7b6`): Verified completion badges, checkmarks, autosave indicators.
- **Typography**: Google Font **Ubuntu** (Weights 400, 500, 700).
- **Interactions**: Fast, natural transitions; no confetti, no gamification badges, no sliders, no emojis.
- **Question Layout**: Centered `max-w-2xl` (~720px) single-column layout on both mobile and desktop.

---

## Core Features & Workflow

1. **Access Control**:
   - HMAC-SHA256 signed invitation tokens bound to audience and expiration.
   - Prevents unauthorized access or cross-cohort access attempts (e.g., Staff cannot access Faculty questions).
   - Reviewer demo mode allows instant one-click testing in evaluation environments.

2. **Respondent Intake**:
   - Collects Full Name, Designation, Email, Phone, and Consent acknowledgment before starting.
   - Generates a unique UUID v4 Session ID.

3. **Questionnaire Engine**:
   - One question at a time.
   - Real-time autosave with status indicator (`Saving...`, `Saved`, `Unable to save — Retry`).
   - Supports: Single Selection, Multiple Selection, Limited Multiple Selection (e.g., Q19 Startup Challenges max 3), 4-point & 5-point Likert scales, and "Other (Please specify)" input fields.
   - Dynamic conditional questions: Q9 & Q10 in Founders dynamically adapt based on Q8 (Incubated: Yes/No).

4. **Review & Final Submission**:
   - Comprehensive review screen organized by section.
   - "Edit" links jump directly back to any question.
   - Confirmed submission locks the session into a permanent `SUBMITTED` read-only state.

5. **Downloadable PDF Report**:
   - Built using `jspdf` and `jspdf-autotable`.
   - Generates an official, academic response report containing participant profile, session ID, completion stats, and complete question-by-question responses.

6. **Google Sheets Storage**:
   - Automated server-side persistence across 4 tabs: `Sessions`, `Respondents`, `Responses`, `Submission Logs`.
   - Formula injection prevention (`=`, `+`, `-`, `@` sanitization).
   - Resilience fallback: Runs seamlessly in mock mode if Google credentials are not yet populated.

---

## Quick Start & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Applications

You can run any of the three applications independently:

```bash
# Run Founders Questionnaire on port 3000
npm run dev:founders

# Run Institutional Questionnaire on port 3001
npm run dev:institutional

# Run Government Questionnaire on port 3002
npm run dev:government
```

### 3. Open in Browser

- Founders: [http://localhost:3000](http://localhost:3000)
- Institutional Gateway: [http://localhost:3001](http://localhost:3001)
  - Managers & Staff Flow: [http://localhost:3001/staff](http://localhost:3001/staff)
  - Faculty Members Flow: [http://localhost:3001/faculty](http://localhost:3001/faculty)
- Government: [http://localhost:3002](http://localhost:3002)

---

## Testing & Verification

Run the automated test suite verifying questionnaire integrity, token validation, conditional logic, and PDF generation:

```bash
node tests/integration_tests.js
```

Build all three applications for production:

```bash
npm run build:all
```

---

## Generate Invitation Tokens

```bash
# Generate tokens for all groups
npm run token:generate

# Or generate for a specific cohort
node scripts/generate-invitation-token.js founders
node scripts/generate-invitation-token.js staff
node scripts/generate-invitation-token.js faculty
node scripts/generate-invitation-token.js government
```

---

## Deployment to Vercel

See detailed instructions in [docs/deployment-guide.md](file:///d:/PROJECTS/FORM%20QUESTIONAIRE%20HATCHERY/docs/deployment-guide.md).
