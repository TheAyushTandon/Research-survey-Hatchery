import { QuestionnaireConfig } from '../lib/types';

export const institutionalQuestionnaire: QuestionnaireConfig = {
  "id": "institutional",
  "title": "Questionnaire for Incubator Managers and Operational Staff / Faculty Members",
  "shortTitle": "Incubator Staff & Faculty Members",
  "targetGroup": "Incubator Managers, Operational Staff & University Leadership",
  "description": "This questionnaire investigates the factors influencing academic business incubator effectiveness from the perspective of incubator operational teams and university faculty leadership.",
  "instructions": [
    "Your responses will be used solely for academic research purposes and are completely anonymous.",
    "Please answer each question honestly based on your institutional experience.",
    "For each question, select the single most appropriate option."
  ],
  "confidentialityNotice": "This survey is completely anonymous. No personally identifying information (such as your name, email address, or contact number) is collected or stored.",
  "consentStatement": "I agree to participate in this anonymous academic research study. I understand that my responses are voluntary and will be analyzed in aggregate for academic research purposes.",
  "sections": [
    {
      "id": "sec_staff",
      "title": "Group A: Incubator Managers and Operational Staff",
      "description": "Focuses on Build-Measure-Learn feedback loop implementation, joint venture agreements, validated metrics, and trilateral institutional networks.",
      "questions": [
        {
          "id": "staff_q1",
          "num": "Q1",
          "sectionId": "sec_staff",
          "text": "How systematically does your incubator train startups to implement the Build-Measure-Learn feedback loop?",
          "type": "single_select",
          "options": [
            "Not at all systematically",
            "Slightly systematically",
            "Moderately systematically",
            "Very systematically",
            "Extremely systematically"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "staff_q2",
          "num": "Q2",
          "sectionId": "sec_staff",
          "text": "Do you actively facilitate formal joint venture agreements between your incubated startups and external industry partners?",
          "type": "single_select",
          "options": [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "staff_q3",
          "num": "Q3",
          "sectionId": "sec_staff",
          "text": "How heavily does your operational staff rely on validated learning metrics over traditional financial metrics when evaluating early-stage startups?",
          "type": "single_select",
          "options": [
            "Not at all heavily",
            "Slightly heavily",
            "Moderately heavily",
            "Very heavily",
            "Extremely heavily"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "staff_q4",
          "num": "Q4",
          "sectionId": "sec_staff",
          "text": "Do you regularly collaborate with regional government bodies to align your incubator's goals with public innovation funding guidelines?",
          "type": "single_select",
          "options": [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "staff_q5",
          "num": "Q5",
          "sectionId": "sec_staff",
          "text": "How effectively do your incubator's resources support founders when they need to execute a strategic business model pivot?",
          "type": "single_select",
          "options": [
            "Not at all effectively",
            "Slightly effectively",
            "Moderately effectively",
            "Very effectively",
            "Extremely effectively"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "staff_q6",
          "num": "Q6",
          "sectionId": "sec_staff",
          "text": "Do university-led lab research projects form the primary technology pipeline for new startups entering your incubator?",
          "type": "single_select",
          "options": [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "staff_q7",
          "num": "Q7",
          "sectionId": "sec_staff",
          "text": "What level of influence do active industry mentors have on shaping the product-market fit strategies of your startups?",
          "type": "single_select",
          "options": [
            "No influence",
            "Low influence",
            "Moderate influence",
            "High influence",
            "Very high influence"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "staff_q8",
          "num": "Q8",
          "sectionId": "sec_staff",
          "text": "Do administrative or bureaucratic compliance bottlenecks from the host university significantly delay your daily incubator operations?",
          "type": "single_select",
          "options": [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "staff_q9",
          "num": "Q9",
          "sectionId": "sec_staff",
          "text": "How consistently do your operational workflows require empirical customer discovery evidence before you allocate internal seed funding?",
          "type": "single_select",
          "options": [
            "Not at all consistently",
            "Slightly consistently",
            "Moderately consistently",
            "Very consistently",
            "Extremely consistently"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "staff_q10",
          "num": "Q10",
          "sectionId": "sec_staff",
          "text": "What is the overall extent of your incubator's reliance on trilateral networks (University-Industry-Government) to sustain its operational model?",
          "type": "single_select",
          "options": [
            "Not at all",
            "To a small extent",
            "To a moderate extent",
            "To a great extent",
            "To a very great extent"
          ],
          "required": true,
          "hasOther": false
        }
      ]
    },
    {
      "id": "sec_faculty",
      "title": "Group B: Faculty Members (University Deans, HoDs, and VCs) associated with incubation programmes",
      "description": "Evaluates university leadership support, IP commercialization, entrepreneurship curriculum integration, and institutional incentives.",
      "questions": [
        {
          "id": "faculty_q1",
          "num": "Q1",
          "sectionId": "sec_faculty",
          "text": "How actively does your faculty or department leadership promote an entrepreneurial culture alongside traditional basic research academic tracks?",
          "type": "single_select",
          "options": [
            "Not at all actively",
            "Slightly actively",
            "Moderately actively",
            "Very actively",
            "Extremely actively"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "faculty_q2",
          "num": "Q2",
          "sectionId": "sec_faculty",
          "text": "Do you believe your university\u2019s current tenure and promotion policies sufficiently reward faculty who actively engage in academic entrepreneurship?",
          "type": "single_select",
          "options": [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "faculty_q3",
          "num": "Q3",
          "sectionId": "sec_faculty",
          "text": "How effectively does your university transfer intellectual property and scientific research to commercial marketplace buyers?",
          "type": "single_select",
          "options": [
            "Not at all effectively",
            "Slightly effectively",
            "Moderately effectively",
            "Very effectively",
            "Extremely effectively"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "faculty_q4",
          "num": "Q4",
          "sectionId": "sec_faculty",
          "text": "Do you systematically encourage student researchers to test their technological concepts via customer discovery interviews before submitting peer-reviewed papers?",
          "type": "single_select",
          "options": [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "faculty_q5",
          "num": "Q5",
          "sectionId": "sec_faculty",
          "text": "What level of structural support does your university leadership receive from government policy frameworks to operationalize incubation infrastructure?",
          "type": "single_select",
          "options": [
            "No support",
            "Low support",
            "Moderate support",
            "High support",
            "Very high support"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "faculty_q6",
          "num": "Q6",
          "sectionId": "sec_faculty",
          "text": "Do your engineering or business curricula explicitly incorporate Lean Startup methodology concepts like Minimum Viable Product (MVP) design?",
          "type": "single_select",
          "options": [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "faculty_q7",
          "num": "Q7",
          "sectionId": "sec_faculty",
          "text": "How frequently do active industry experts serve on your academic department's steering committees to co-create market-relevant research agendas?",
          "type": "single_select",
          "options": [
            "Never",
            "Rarely",
            "Sometimes",
            "Often",
            "Always"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "faculty_q8",
          "num": "Q8",
          "sectionId": "sec_faculty",
          "text": "Do you face institutional stress between meeting academic publication targets and delivering commercially viable spinoff metrics for the incubator?",
          "type": "single_select",
          "options": [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "faculty_q9",
          "num": "Q9",
          "sectionId": "sec_faculty",
          "text": "How open is your current executive leadership team to relaxing university equity-share rules to attract private venture capitalist investment?",
          "type": "single_select",
          "options": [
            "Not at all open",
            "Slightly open",
            "Moderately open",
            "Very open",
            "Extremely open"
          ],
          "required": true,
          "hasOther": false
        },
        {
          "id": "faculty_q10",
          "num": "Q10",
          "sectionId": "sec_faculty",
          "text": "What is the overall commitment level of top-tier university administration to building an active local Triple Helix innovation ecosystem?",
          "type": "single_select",
          "options": [
            "No commitment",
            "Low commitment",
            "Moderate commitment",
            "High commitment",
            "Very high commitment"
          ],
          "required": true,
          "hasOther": false
        }
      ]
    }
  ]
};
