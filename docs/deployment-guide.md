# Vercel Deployment & Google Sheets Setup Guide

This guide explains how to deploy the three independent questionnaire applications to Vercel and configure Google Sheets for response storage.

---

## 1. Vercel Deployment Architecture

The platform consists of three completely independent web applications:

| Vercel Project Name | Source Subdirectory | Target Audience | Questionnaire ID |
|---|---|---|---|
| `research-founders` | `founders` | Startup Founders & Entrepreneurs | `founders` |
| `research-institutional` | `institutional` | Incubator Staff & Faculty Members | `institutional-staff` (`/staff`)<br>`institutional-faculty` (`/faculty`) |
| `research-government` | `government` | Government Agencies | `government` |

---

## 2. Deploying to Vercel (Step-by-Step)

### Option A: Via Vercel Web Dashboard (Recommended)

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In the Vercel Dashboard, click **Add New...** -> **Project**.
3. Select your repository.
4. **Project 1: Founders**:
   - Project Name: `research-founders`
   - Framework Preset: **Next.js**
   - **Root Directory**: Click *Edit* and select `founders`.
   - Environment Variables (see section 3).
   - Click **Deploy**.
5. **Project 2: Institutional**:
   - Add new project from the same repo.
   - Project Name: `research-institutional`
   - **Root Directory**: `institutional`
   - Environment Variables (see section 3).
   - Click **Deploy**.
6. **Project 3: Government**:
   - Add new project from the same repo.
   - Project Name: `research-government`
   - **Root Directory**: `government`
   - Environment Variables (see section 3).
   - Click **Deploy**.

---

## 3. Environment Variables Configuration

### 3.1 Project: `research-founders`
```env
# Google Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Target Spreadsheet ID
FOUNDERS_SPREADSHEET_ID=1A2B3C4D5E6F...

# Access Token Secret
INVITATION_TOKEN_SECRET=your_secure_random_secret_string
```

### 3.2 Project: `research-institutional`
```env
# Google Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Target Spreadsheet IDs (Separate for Staff and Faculty)
INSTITUTIONAL_STAFF_SPREADSHEET_ID=1StaffSheetId...
INSTITUTIONAL_FACULTY_SPREADSHEET_ID=1FacultySheetId...

# Access Token Secret
INVITATION_TOKEN_SECRET=your_secure_random_secret_string
```

### 3.3 Project: `research-government`
```env
# Google Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Target Spreadsheet ID
GOVERNMENT_SPREADSHEET_ID=1GovSheetId...

# Access Token Secret
INVITATION_TOKEN_SECRET=your_secure_random_secret_string
```

---

## 4. Google Sheets Configuration

### 4.1 Create Google Cloud Service Account
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (e.g. `academic-research-incubators`).
3. Enable the **Google Sheets API**.
4. Go to **IAM & Admin** -> **Service Accounts** -> **Create Service Account**.
5. Create a key in **JSON** format and download it.
6. Note the `client_email` and `private_key`.

### 4.2 Create the Four Spreadsheets
Create four new Google Sheets in your Google Drive:
1. `Research_Responses_Founders`
2. `Research_Responses_Institutional_Staff`
3. `Research_Responses_Institutional_Faculty`
4. `Research_Responses_Government`

### 4.3 Grant Edit Access to Service Account
Open each spreadsheet, click **Share**, and grant **Editor** permissions to your `client_email` (e.g., `your-service-account@project.iam.gserviceaccount.com`).

### 4.4 Set Up Spreadsheet Tabs
In each spreadsheet, ensure the following four tabs are present:

1. **`Sessions`**:
   - Row 1 Header: `Session ID | Respondent ID | Questionnaire ID | Respondent Group | Start Timestamp | Last Updated | Current Section | Current Question | Completion Status | Submission Timestamp`
2. **`Respondents`**:
   - Row 1 Header: `Respondent ID | Session ID | Full Name | Designation | Email | Phone Number | Consent Version | Created Timestamp`
3. **`Responses`**:
   - Row 1 Header: `Response Key | Session ID | Questionnaire ID | Section ID | Question ID | Question Number | Question Text | Answer | Answered Timestamp | Last Updated`
4. **`Submission Logs`**:
   - Row 1 Header: `Event ID | Session ID | Event Type | Timestamp | Status | Error Details`

---

## 5. Generating Participant Invitation Links

To invite respondents, generate signed invitation tokens:

```bash
# Generate tokens for all cohorts
node scripts/generate-invitation-token.js

# Or generate for a specific cohort
node scripts/generate-invitation-token.js founders
node scripts/generate-invitation-token.js staff
node scripts/generate-invitation-token.js faculty
node scripts/generate-invitation-token.js government
```

The script outputs ready-to-share URLs:
- `https://founders.yourdomain.com/?token=<TOKEN>`
- `https://institutional.yourdomain.com/staff?token=<TOKEN>`
- `https://institutional.yourdomain.com/faculty?token=<TOKEN>`
- `https://government.yourdomain.com/?token=<TOKEN>`

---

## 6. Resilience & Simulation Mode

If Google Sheets credentials are not configured (e.g. during local evaluation or staging), the platform operates seamlessly in **simulation mode**:
- Answers are verified and cached in memory.
- Sessions and respondents can be resumed using Session ID.
- PDF reports compile and download with 100% fidelity.
- Zero crashes occur due to missing cloud credentials.
