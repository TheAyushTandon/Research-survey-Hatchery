import { QuestionnaireConfig } from '../lib/types';

export const facultyQuestionnaire: QuestionnaireConfig = {
  id: "institutional-faculty",
  title: "Questionnaire for Incubator Managers and Operational Staff / Faculty Members",
  shortTitle: "Group B: Faculty Members & University Leadership",
  targetGroup: "Faculty Members (University Deans, HoDs, and VCs)",
  description: "This research segment assesses academic entrepreneurship culture, faculty incentive structures, IP commercialization, and university executive leadership commitment to local innovation ecosystems.",
  instructions: [
    "Please answer the following questions based on your experience. All responses will be kept confidential and used only for academic research purposes.",
    "Please select the most appropriate option for each question.",
    "Your progress is continuously autosaved. You may safely resume at any time."
  ],
  confidentialityNotice: "This survey is completely anonymous. No personally identifying information (such as your name, email address, or contact number) is collected or stored.",
  consentStatement: "I agree to participate in this anonymous academic research study. I understand that my responses are voluntary and will be analyzed in aggregate for academic research purposes.",
  sections: [
    {
      id: "group_b",
      title: "Group B: Faculty Members (University Deans, HoDs, and VCs)",
      description: "Academic entrepreneurship, curriculum integration, and institutional alignment with incubation programmes.",
      questions: [
        {
          id: "faculty_q1",
          sectionId: "group_b",
          number: "Q1",
          text: "How actively does your faculty or department leadership promote an entrepreneurial culture alongside traditional basic research academic tracks?",
          type: "single_select",
          options: [
            "Not at all actively",
            "Slightly actively",
            "Moderately actively",
            "Very actively",
            "Extremely actively"
          ],
          hasOther: false,
          required: true
        },
        {
          id: "faculty_q2",
          sectionId: "group_b",
          number: "Q2",
          text: "Do you believe your university’s current tenure and promotion policies sufficiently reward faculty who actively engage in academic entrepreneurship?",
          type: "single_select",
          options: [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree"
          ],
          hasOther: false,
          required: true
        },
        {
          id: "faculty_q3",
          sectionId: "group_b",
          number: "Q3",
          text: "How effectively does your university transfer intellectual property and scientific research to commercial marketplace buyers?",
          type: "single_select",
          options: [
            "Not at all effectively",
            "Slightly effectively",
            "Moderately effectively",
            "Very effectively",
            "Extremely effectively"
          ],
          hasOther: false,
          required: true
        },
        {
          id: "faculty_q4",
          sectionId: "group_b",
          number: "Q4",
          text: "Do you systematically encourage student researchers to test their technological concepts via customer discovery interviews before submitting peer-reviewed papers?",
          type: "single_select",
          options: [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree"
          ],
          hasOther: false,
          required: true
        },
        {
          id: "faculty_q5",
          sectionId: "group_b",
          number: "Q5",
          text: "What level of structural support does your university leadership receive from government policy frameworks to operationalize incubation infrastructure?",
          type: "single_select",
          options: [
            "No support",
            "Low support",
            "Moderate support",
            "High support",
            "Very high support"
          ],
          hasOther: false,
          required: true
        },
        {
          id: "faculty_q6",
          sectionId: "group_b",
          number: "Q6",
          text: "Do your engineering or business curricula explicitly incorporate Lean Startup methodology concepts like Minimum Viable Product (MVP) design?",
          type: "single_select",
          options: [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree"
          ],
          hasOther: false,
          required: true
        },
        {
          id: "faculty_q7",
          sectionId: "group_b",
          number: "Q7",
          text: "How frequently do active industry experts serve on your academic department's steering committees to co-create market-relevant research agendas?",
          type: "single_select",
          options: [
            "Never",
            "Rarely",
            "Sometimes",
            "Often",
            "Always"
          ],
          hasOther: false,
          required: true
        },
        {
          id: "faculty_q8",
          sectionId: "group_b",
          number: "Q8",
          text: "Do you face institutional stress between meeting academic publication targets and delivering commercially viable spinoff metrics for the incubator?",
          type: "single_select",
          options: [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree"
          ],
          hasOther: false,
          required: true
        },
        {
          id: "faculty_q9",
          sectionId: "group_b",
          number: "Q9",
          text: "How open is your current executive leadership team to relaxing university equity-share rules to attract private venture capitalist investment?",
          type: "single_select",
          options: [
            "Not at all open",
            "Slightly open",
            "Moderately open",
            "Very open",
            "Extremely open"
          ],
          hasOther: false,
          required: true
        },
        {
          id: "faculty_q10",
          sectionId: "group_b",
          number: "Q10",
          text: "What is the overall commitment level of top-tier university administration to building an active local Triple Helix innovation ecosystem?",
          type: "single_select",
          options: [
            "No commitment",
            "Low commitment",
            "Moderate commitment",
            "High commitment",
            "Very high commitment"
          ],
          hasOther: false,
          required: true
        }
      ]
    }
  ]
};
