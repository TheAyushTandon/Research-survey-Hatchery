# Architecture & Deployment Specification

## 1. System Overview

The Academic Research Questionnaire Platform is built as a three-application architecture representing three distinct stakeholder deployments:

1. `founders/`: Startup Founders & Entrepreneurs (54 Questions)
2. `institutional/`: Incubator Managers/Staff & Faculty Members (Two isolated paths: `/staff` with 10 questions & `/faculty` with 10 questions)
3. `government/`: Government Agencies & Innovation Missions (42 Questions)

Each application is a fully independent, zero-coupling Next.js (App Router) project built with TypeScript, Tailwind CSS, Lucide icons, and modern React patterns.

```
FORM QUESTIONAIRE HATCHERY/
├── founders/               # Deployment 1: Founders & Entrepreneurs
│   ├── app/
│   │   ├── api/            # Server-side validation, sessions, autosave, submission, PDF
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/         # Questionnaire engine, UI components, intake, PDF download
│   ├── config/             # Verbatim questionnaire configuration (JSON/TS)
│   ├── lib/                # Google Sheets client, tokens, session management
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── institutional/          # Deployment 2: Institutional (Staff & Faculty)
│   ├── app/
│   │   ├── staff/          # Route for Incubator Managers & Operational Staff
│   │   ├── faculty/        # Route for Faculty Members (Deans, HoDs, VCs)
│   │   ├── api/            # Isolated server APIs for both groups
│   │   └── page.tsx        # Gateway / selector with token enforcement
│   ├── components/
│   ├── config/             # Configs for Staff (10Q) and Faculty (10Q)
│   ├── lib/
│   ├── package.json
│   └── ...
│
├── government/             # Deployment 3: Government Agencies
│   ├── app/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── config/             # Verbatim questionnaire config (42Q)
│   ├── lib/
│   ├── package.json
│   └── ...
│
├── docs/                   # Documentation & Content Audits
├── scripts/                # Token generation utilities
└── package.json            # Root convenience orchestrator
```

---

## 2. Design System & Theme

### Palette Tokens
- **Cool Horizon (`#79addc`)**: Primary actions, active selected borders, progress bars, interactive focus rings.
- **Peach Glow (`#ffc09f`)**: Gentle accent highlights, pill indicators.
- **Light Gold (`#ffee93`)**: Subtle indicator tags and secondary highlights.
- **Lemon Chiffon (`#fcf5c7`)**: Warm background surface variations, note boxes, subtle banners.
- **Celadon (`#adf7b6`)**: Successful persistence indicator, completion badges, checkmarks.
- **Background**: Clean off-white (`#fafafa` / `#ffffff`).
- **Foreground / Text**: Deep slate/charcoal (`#111827`, `#374151`) with high readability contrast.

### Typography
- Google Font **Ubuntu** (Weights: 400, 500, 700).
- Centered editorial container: `max-w-2xl` (~720px) with comfortable breathing room and mobile-first single column spacing.

---

## 3. Security & Access Control

1. **HMAC Invitation Tokens**:
   - Format: `v1.<payload_base64url>.<hmac_signature>`.
   - Payload: `{ questionnaireId, group, expiresAt, nonce }`.
   - Validated server-side before displaying the intake form or initiating sessions.
   - Separate tokens for `founders`, `institutional-staff`, `institutional-faculty`, and `government`.
   - Institutional deployment rejects a `staff` token on the `/faculty` flow and vice-versa.

2. **Session Identification & State**:
   - UUID v4 generated on intake validation.
   - Client stores active session in HttpOnly / SameSite secure cookie and local storage resume token.
   - Submitted sessions become permanently read-only (`status: SUBMITTED`).

---

## 4. Google Sheets Storage Architecture

Each questionnaire stream writes to its dedicated spreadsheet ID:
- `FOUNDERS_SPREADSHEET_ID`
- `INSTITUTIONAL_STAFF_SPREADSHEET_ID`
- `INSTITUTIONAL_FACULTY_SPREADSHEET_ID`
- `GOVERNMENT_SPREADSHEET_ID`

### Required Tabs & Schema
1. **Sessions**:
   `Session ID | Respondent ID | Questionnaire ID | Respondent Group | Start Timestamp | Last Updated | Current Section | Current Question | Completion Status | Submission Timestamp`
2. **Respondents**:
   `Respondent ID | Session ID | Full Name | Designation | Email | Phone Number | Consent Version | Created Timestamp`
3. **Responses**:
   `Response Key (SessionID_QuestionID) | Session ID | Questionnaire ID | Section ID | Question ID | Question Number | Question Text | Answer (JSON string or text) | Answered Timestamp | Last Updated`
4. **Submission Logs**:
   `Event ID | Session ID | Event Type | Timestamp | Status | Error Details`

*Safety feature*: Prevents formula injection by prefixing risky characters (`=`, `+`, `-`, `@`) with `'`.
*Fallback / Resilience*: If Google credentials are not yet configured in local development, operations are logged and maintained in memory/local mock store without crashing.

---

## 5. PDF Response Report

- Built using client & server safe PDF generation (`jspdf` + `jspdf-autotable`).
- Fully formatted individual response report:
  - Header: Academic study metadata, participant name, designation, session ID, submission date.
  - Progress summary: Total questions answered, percentage completion.
  - Detailed Section-wise breakdown: Original question numbering, exact question text, user answers, Likert scales, and other-specify details.
  - Footer: Page numbers, Session ID watermark, confidentiality declaration.
