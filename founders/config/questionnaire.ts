import { QuestionnaireConfig } from '../lib/types';

export const foundersQuestionnaire: QuestionnaireConfig = {
  id: 'founders',
  title: 'To Identify the Factors Affecting the Success of Business Incubators in India',
  shortTitle: 'Startup Founders & Entrepreneurs',
  targetGroup: 'Startup Founders, Co-founders, CEOs, Directors & Technical Founders',
  description: 'The objective of this questionnaire is to understand the factors that influence the effectiveness and success of business incubators from the perspective of startup founders and entrepreneurs.',
  instructions: [
    'Your responses will be used solely for academic research purposes and are completely anonymous.',
    'There are no right or wrong answers. Please answer each question honestly based on your experience.',
    'For questions marked \'Select all that apply\', you may choose more than one response. For all other questions, select one response.',
    'Questions regarding incubator affiliation adapt dynamically based on your incubation status.'
  ],
  confidentialityNotice: 'This survey is completely anonymous. No personally identifying information (such as your name, email address, or contact number) is collected or stored.',
  consentStatement: 'I agree to participate in this anonymous academic research study. I understand that my responses are voluntary and will be analyzed in aggregate for academic research purposes.',
  sections: [
  {
    "id": "sec_a",
    "title": "Section A: General Information",
    "questions": [
      {
        "num": "Q1",
        "text": "What is your gender?",
        "options": [
          "Male",
          "Female",
          "Non-binary/Third Gender"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q1",
        "required": true,
        "hasOther": false,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q2",
        "text": "What is your age group?",
        "options": [
          "15–24 years",
          "25–34 years",
          "35–44 years",
          "45 years and above"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q2",
        "required": true,
        "hasOther": false,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q3",
        "text": "What is your highest educational qualification?",
        "options": [
          "Diploma",
          "Bachelor's Degree",
          "Master's Degree",
          "Doctoral Degree (Ph.D.)",
          "Professional Qualification",
          "Other (please specify)"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q3",
        "required": true,
        "hasOther": true,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q4",
        "text": "What is your role in the startup?",
        "options": [
          "Founder",
          "Co-founder",
          "CEO",
          "Director",
          "Managing Partner",
          "Technical Founder",
          "Other (please specify)"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q4",
        "required": true,
        "hasOther": true,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q5",
        "text": "How long has your startup been operating?",
        "options": [
          "Less than 1 year",
          "1–3 years",
          "4–6 years",
          "7–10 years",
          "More than 10 years"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q5",
        "required": true,
        "hasOther": false,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q6",
        "text": "Which stage best describes your startup?",
        "options": [
          "Idea Stage",
          "Prototype Development",
          "Validation/Pilot Testing",
          "Early Revenue Stage",
          "Growth Stage",
          "Scaling Stage"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q6",
        "required": true,
        "hasOther": false,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q7",
        "text": "Which sector does your startup primarily operate in?",
        "options": [
          "Biotechnology & Life Sciences",
          "Healthcare & Medical Technology",
          "Agriculture & AgriTech",
          "Artificial Intelligence & DeepTech",
          "Information Technology & Software",
          "Education & EdTech",
          "Financial Technology (FinTech)",
          "Clean Energy & Environmental Technology",
          "Manufacturing & Engineering",
          "Electronics & Internet of Things (IoT)",
          "Food Processing & Food Technology",
          "Social Entrepreneurship",
          "Other (please specify)"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q7",
        "required": true,
        "hasOther": true,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q8",
        "text": "Is your startup currently incubated?",
        "options": [
          "Yes",
          "No"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q8",
        "required": true,
        "hasOther": false,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q9",
        "text": "What type of incubator supports your startup?",
        "options": [
          "University/Academic Incubator",
          "Government-supported Incubator (Central Government/State Government)",
          "Private Incubator",
          "Corporate-backed Incubator",
          "Accelerator Programme",
          "Biotechnology Incubator",
          "Other (please specify)"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q9",
        "required": true,
        "hasOther": true,
        "type": "single_select",
        "conditional": {
          "questionId": "founders_sec_a_q8",
          "equals": "Yes"
        }
      },
      {
        "num": "Q10",
        "text": "How long have you been associated with the incubator?",
        "options": [
          "Less than 6 months",
          "6–12 months",
          "1–2 years",
          "2–3 years",
          "More than 3 years"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q10",
        "required": true,
        "hasOther": false,
        "type": "single_select",
        "conditional": {
          "questionId": "founders_sec_a_q8",
          "equals": "Yes"
        }
      },
      {
        "num": "Q11",
        "text": "How did you first learn about the incubator?",
        "options": [
          "University/College",
          "Government Programme",
          "Startup Event",
          "Social Media",
          "Friends & Family",
          "Professional Network",
          "Incubator Website",
          "Faculty Mentor",
          "Other (please specify)"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q11",
        "required": true,
        "hasOther": true,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q12",
        "text": "Why did you choose this incubator? (Select all that apply)",
        "options": [
          "Funding opportunities",
          "Mentorship",
          "Infrastructure",
          "Laboratory facilities",
          "Business networking",
          "Investor access",
          "Technology support",
          "Government recognition",
          "Market access",
          "Intellectual Property support",
          "Training programmes",
          "Reputation of the incubator",
          "Other (please specify)"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q12",
        "required": true,
        "hasOther": true,
        "type": "multi_select",
        "conditional": null
      },
      {
        "num": "Q13",
        "text": "Which services have you received from the incubator? (Select all that apply)",
        "options": [
          "Office space",
          "Laboratory facilities",
          "Prototype development support",
          "Business mentoring",
          "Technical mentoring",
          "Legal & Regulatory support",
          "Patent/IP assistance",
          "Funding assistance",
          "Investor connections",
          "Marketing support",
          "Export guidance",
          "Networking events",
          "Entrepreneurship training/Bootcamp/Hackathon/EDP etc.",
          "International exposure",
          "Other (please specify)"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q13",
        "required": true,
        "hasOther": true,
        "type": "multi_select",
        "conditional": null
      },
      {
        "num": "Q14",
        "text": "Which source provided your initial funding?",
        "options": [
          "Self-funded (Bootstrapping)",
          "Family/Friends",
          "Government Grant",
          "Incubator Seed Fund",
          "Angel Investor",
          "Venture Capital",
          "Bank Loan",
          "CSR Funding",
          "Crowdfunding",
          "Other (please specify)"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q14",
        "required": true,
        "hasOther": true,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q15",
        "text": "What is the current size of your startup?",
        "options": [
          "1–5 employees",
          "6–10 employees",
          "11–25 employees",
          "26–50 employees",
          "More than 50 employees"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q15",
        "required": true,
        "hasOther": false,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q16",
        "text": "Has your startup received Intellectual Property (IP) support? (Select all that apply)",
        "options": [
          "Patent Filing",
          "Trademark Registration",
          "Copyright Registration",
          "Design Registration",
          "Technology Licensing",
          "No IP Support Received"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q16",
        "required": true,
        "hasOther": false,
        "type": "multi_select",
        "conditional": null
      },
      {
        "num": "Q17",
        "text": "Which of the following best describes your primary customer?",
        "options": [
          "Individual Consumers (B2C)",
          "Businesses (B2B)",
          "Government",
          "Educational Institutions",
          "Healthcare Organizations",
          "Export Market",
          "Mixed Customer Base"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q17",
        "required": true,
        "hasOther": false,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q18",
        "text": "How often do you interact with your incubator mentors?",
        "options": [
          "Weekly",
          "Twice a month",
          "Monthly",
          "Quarterly",
          "Rarely"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q18",
        "required": true,
        "hasOther": false,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q19",
        "text": "What is the biggest challenge faced by your startup? (Select up to three)",
        "options": [
          "Funding",
          "Product Development",
          "Customer Acquisition",
          "Market Validation",
          "Regulatory Approval",
          "Skilled Workforce",
          "Technology Development",
          "Manufacturing",
          "Intellectual Property",
          "Scaling Operations",
          "Competition",
          "Export Readiness",
          "Other (please specify)"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q19",
        "required": true,
        "hasOther": true,
        "type": "limited_multi_select",
        "conditional": null,
        "maxSelections": 3
      },
      {
        "num": "Q20",
        "text": "What outcomes has your startup achieved through incubation? (Select all that apply)",
        "options": [
          "Product Prototype Developed",
          "Commercial Product Launched",
          "Revenue Generation",
          "Patent Filed",
          "Patent Granted",
          "Investment Raised",
          "Employment Created",
          "Strategic Partnerships",
          "Export Initiated",
          "Research Collaboration",
          "Technology Commercialized",
          "Business Expansion",
          "None of the Above"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q20",
        "required": true,
        "hasOther": false,
        "type": "multi_select",
        "conditional": null
      },
      {
        "num": "Q21",
        "text": "What type of collaboration has most benefited your startup?",
        "options": [
          "University Researchers",
          "Industry Experts",
          "Government Agencies",
          "Investors",
          "Customers",
          "Other Startups",
          "International Partners"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q21",
        "required": true,
        "hasOther": true,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q22",
        "text": "What is your future business goal?",
        "options": [
          "Product Commercialization",
          "Market Expansion",
          "International Trade Expansion",
          "Investment Raising",
          "Technology Licensing",
          "Strategic Acquisition",
          "Sustainable Growth",
          "IPO",
          "Other (please specify)"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q22",
        "required": true,
        "hasOther": true,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q23",
        "text": "Would you recommend your incubator to other entrepreneurs?",
        "options": [
          "Definitely Yes",
          "Probably Yes",
          "Not Sure",
          "Probably No",
          "Definitely No"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q23",
        "required": true,
        "hasOther": false,
        "type": "single_select",
        "conditional": null
      },
      {
        "num": "Q24",
        "text": "How satisfied are you with your incubation experience?",
        "options": [
          "Very Satisfied",
          "Satisfied",
          "Neutral",
          "Dissatisfied",
          "Very Dissatisfied"
        ],
        "sectionId": "sec_a",
        "id": "founders_sec_a_q24",
        "required": true,
        "hasOther": false,
        "type": "single_select",
        "conditional": null
      }
    ]
  },
  {
    "id": "sec_b_h1",
    "title": "Section B: Study Hypothesis H1 — Lean Startup Theory based Mentorship",
    "questions": [
      {
        "num": "Q1",
        "text": "Mentors at our incubator heavily teach \"Lean Start-up\" ideas, like testing early products and learning from customer feedback.",
        "options": [
          "Rarely or never",
          "Occasionally",
          "Frequently",
          "Always"
        ],
        "sectionId": "sec_b_h1",
        "id": "founders_sec_b_h1_q1",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q2",
        "text": "Using Lean strategies like knowing when to change direction (pivot) helps our start-ups stay in business longer.",
        "options": [
          "Strongly Disagree",
          "Disagree",
          "Agree",
          "Strongly Agree"
        ],
        "sectionId": "sec_b_h1",
        "id": "founders_sec_b_h1_q2",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q3",
        "text": "Start-ups that follow the Lean advice given by their mentors handle market challenges and changes much better.",
        "options": [
          "Not at all effectively",
          "Slightly effectively",
          "Moderately effectively",
          "Extremely effectively"
        ],
        "sectionId": "sec_b_h1",
        "id": "founders_sec_b_h1_q3",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q4",
        "text": "Regular mentor advice focused on customer feedback helps start-ups build products that people actually want to buy.",
        "options": [
          "Not at all",
          "To a small extent",
          "To a moderate extent",
          "To a great extent"
        ],
        "sectionId": "sec_b_h1",
        "id": "founders_sec_b_h1_q4",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q5",
        "text": "Start-ups using Lean methods fail much less often compared to those using old-fashioned, traditional business planning.",
        "options": [
          "Much higher failure rate",
          "Same failure rate",
          "Lower failure rate",
          "Much lower failure rate"
        ],
        "sectionId": "sec_b_h1",
        "id": "founders_sec_b_h1_q5",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q6",
        "text": "How often do mentors encourage your startup to validate business ideas with potential customers before making major investments?",
        "options": [
          "Never",
          "Occasionally",
          "Frequently",
          "Always"
        ],
        "sectionId": "sec_b_h1",
        "id": "founders_sec_b_h1_q6",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q7",
        "text": "To what extent has mentorship on developing a Minimum Viable Product (MVP) helped your startup reduce the risk of product failure?",
        "options": [
          "Not at all",
          "To a small extent",
          "To a moderate extent",
          "To a great extent"
        ],
        "sectionId": "sec_b_h1",
        "id": "founders_sec_b_h1_q7",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q8",
        "text": "How effective has mentor guidance been in helping your startup quickly adapt its business model based on market feedback?",
        "options": [
          "Not effective",
          "Slightly effective",
          "Moderately effective",
          "Highly effective"
        ],
        "sectionId": "sec_b_h1",
        "id": "founders_sec_b_h1_q8",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q9",
        "text": "Which best describes the impact of Lean Startup mentoring on your startup's ability to make informed business decisions?",
        "options": [
          "No noticeable impact",
          "Limited impact",
          "Moderate impact",
          "Significant impact"
        ],
        "sectionId": "sec_b_h1",
        "id": "founders_sec_b_h1_q9",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q10",
        "text": "How much has Lean Startup-oriented mentorship contributed to the long-term sustainability of your startup?",
        "options": [
          "Not at all",
          "To a limited extent",
          "To a considerable extent",
          "To a very great extent"
        ],
        "sectionId": "sec_b_h1",
        "id": "founders_sec_b_h1_q10",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      }
    ],
    "description": "H1: Academic business incubators provide mentorship based on 'Lean Start-up Theory,' which increases the market survival rate of the incubated start-ups."
  },
  {
    "id": "sec_b_h2",
    "title": "Section B: Study Hypothesis H2 — Lean Practices and Government Support",
    "questions": [
      {
        "num": "Q1",
        "text": "Founders who use Lean methods are better at making the most of government grants and money without wasting it.",
        "options": [
          "Strongly Disagree",
          "Disagree",
          "Agree",
          "Strongly Agree"
        ],
        "sectionId": "sec_b_h2",
        "id": "founders_sec_b_h2_q1",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q2",
        "text": "Traditional planners often waste or misuse government support because their spending plans are too strict and rigid.",
        "options": [
          "Strongly Disagree",
          "Disagree",
          "Agree",
          "Strongly Agree"
        ],
        "sectionId": "sec_b_h2",
        "id": "founders_sec_b_h2_q2",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q3",
        "text": "Lean founders use government-backed perks (like tax breaks or funds) for product testing much faster than traditional founders.",
        "options": [
          "Much Slower",
          "Slower",
          "Faster",
          "Much Faster"
        ],
        "sectionId": "sec_b_h2",
        "id": "founders_sec_b_h2_q3",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q4",
        "text": "The flexible nature of Lean methods makes it easier for founders to meet government rules and milestone requirements.",
        "options": [
          "Very Difficult",
          "Difficult",
          "Easy",
          "Very Easy"
        ],
        "sectionId": "sec_b_h2",
        "id": "founders_sec_b_h2_q4",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q5",
        "text": "Founders who use Lean principles get a better return on investment from government support programs than those using traditional business methods.",
        "options": [
          "Much Worse",
          "Worse",
          "Better",
          "Much Better"
        ],
        "sectionId": "sec_b_h2",
        "id": "founders_sec_b_h2_q5",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q6",
        "text": "How effectively do Lean Startup practices help founders utilize government funding for validating customer needs before large-scale investment?",
        "options": [
          "Not effective at all",
          "Slightly effective",
          "Moderately effective",
          "Highly effective"
        ],
        "sectionId": "sec_b_h2",
        "id": "founders_sec_b_h2_q6",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q7",
        "text": "Compared with traditional approaches, how efficiently does the Lean Startup approach help founders achieve the milestones required by government-funded programmes?",
        "options": [
          "Much less efficiently",
          "Less efficiently",
          "More efficiently",
          "Much more efficiently"
        ],
        "sectionId": "sec_b_h2",
        "id": "founders_sec_b_h2_q7",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q8",
        "text": "To what extent does the Lean Startup approach reduce unnecessary expenditure when using government grants or financial assistance?",
        "options": [
          "Not at all",
          "To a small extent",
          "To a moderate extent",
          "To a great extent"
        ],
        "sectionId": "sec_b_h2",
        "id": "founders_sec_b_h2_q8",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q9",
        "text": "How helpful are Lean Startup practices in enabling founders to quickly respond to changes in government policies, funding guidelines, or compliance requirements?",
        "options": [
          "Not helpful",
          "Slightly helpful",
          "Moderately helpful",
          "Highly helpful"
        ],
        "sectionId": "sec_b_h2",
        "id": "founders_sec_b_h2_q9",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q10",
        "text": "How much has the Lean Startup approach improved your startup's ability to maximize the benefits of government support programmes?",
        "options": [
          "Not at all",
          "To a limited extent",
          "To a considerable extent",
          "To a very great extent"
        ],
        "sectionId": "sec_b_h2",
        "id": "founders_sec_b_h2_q10",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      }
    ],
    "description": "H2: The founders who adopt lean methodologies utilize government support and backing more efficiently than those founders who use traditional methods."
  },
  {
    "id": "sec_c",
    "title": "Section C: Triple Helix-Based Institutional Collaboration",
    "questions": [
      {
        "num": "Q1",
        "text": "Does the incubator facilitate interactions between university researchers and a start-up?",
        "options": [
          "Strongly Disagree",
          "Disagree",
          "Agree",
          "Strongly Agree"
        ],
        "sectionId": "sec_c",
        "id": "founders_sec_c_q1",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q2",
        "text": "Does the incubator offer university research, technical expertise, and lab facilities?",
        "options": [
          "Strongly Disagree",
          "Disagree",
          "Agree",
          "Strongly Agree"
        ],
        "sectionId": "sec_c",
        "id": "founders_sec_c_q2",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q3",
        "text": "Does the incubator offer good access to the industry partners and markets?",
        "options": [
          "Strongly Disagree",
          "Disagree",
          "Agree",
          "Strongly Agree"
        ],
        "sectionId": "sec_c",
        "id": "founders_sec_c_q3",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q4",
        "text": "Do corporate mentors provide valuable insight into the market entry and commercialization process?",
        "options": [
          "Strongly Disagree",
          "Disagree",
          "Agree",
          "Strongly Agree"
        ],
        "sectionId": "sec_c",
        "id": "founders_sec_c_q4",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q5",
        "text": "Does the incubator facilitate connections to relevant government programs and grants?",
        "options": [
          "Strongly Disagree",
          "Disagree",
          "Agree",
          "Strongly Agree"
        ],
        "sectionId": "sec_c",
        "id": "founders_sec_c_q5",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q6",
        "text": "Does incubator support help your start-up comply with policy and legal regulations?",
        "options": [
          "Strongly Disagree",
          "Disagree",
          "Agree",
          "Strongly Agree"
        ],
        "sectionId": "sec_c",
        "id": "founders_sec_c_q6",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q7",
        "text": "Do government programs in the incubator help you build relationships with researchers and industry partners?",
        "options": [
          "Strongly Disagree",
          "Disagree",
          "Agree",
          "Strongly Agree"
        ],
        "sectionId": "sec_c",
        "id": "founders_sec_c_q7",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q8",
        "text": "Does the incubator effectively bridge university, industry, and government resources, thus accelerating start up development?",
        "options": [
          "Strongly Disagree",
          "Disagree",
          "Agree",
          "Strongly Agree"
        ],
        "sectionId": "sec_c",
        "id": "founders_sec_c_q8",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q9",
        "text": "Do collaborative projects help shorten product development cycles?",
        "options": [
          "Strongly Disagree",
          "Disagree",
          "Agree",
          "Strongly Agree"
        ],
        "sectionId": "sec_c",
        "id": "founders_sec_c_q9",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      },
      {
        "num": "Q10",
        "text": "Does the cooperation between university, industry, and government contribute to start up’s capacity building?",
        "options": [
          "Strongly Disagree",
          "Disagree",
          "Agree",
          "Strongly Agree"
        ],
        "sectionId": "sec_c",
        "id": "founders_sec_c_q10",
        "required": true,
        "hasOther": false,
        "type": "likert_4",
        "conditional": null
      }
    ]
  }
]
};
