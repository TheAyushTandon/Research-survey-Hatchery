import { QuestionnaireConfig } from '../lib/types';

export const staffQuestionnaire: QuestionnaireConfig = {
  id: "institutional-staff",
  title: "Questionnaire for Incubator Managers and Operational Staff / Faculty Members",
  shortTitle: "Group A: Incubator Heads, Managers & Operational Staff",
  targetGroup: "Incubator Heads, Managers and Operational Staff",
  description: "This research evaluates Lean Startup feedback loop implementation (Build-Measure-Learn), validated metrics, and trilateral institutional networks from the perspective of incubator leadership and staff.",
  instructions: [
    "Please answer the following questions based on your experience. All responses will be kept confidential and used only for academic research purposes.",
    "Please select the most appropriate option for each question.",
    "Your progress is continuously autosaved. You may safely resume at any time."
  ],
  confidentialityNotice: "This survey is completely anonymous. No personally identifying information (such as your name, email address, or contact number) is collected or stored.",
  consentStatement: "I agree to participate in this anonymous academic research study. I understand that my responses are voluntary and will be analyzed in aggregate for academic research purposes.",
  sections: [
    {
      id: "group_a",
      title: "Group A: Incubator Managers and Operational Staff",
      description: "Operational workflows, startup feedback loops, and trilateral institutional networks.",
      questions: [
        {
          id: "staff_q1",
          sectionId: "group_a",
          number: "Q1",
          text: "How systematically does your incubator train startups to implement the Build-Measure-Learn feedback loop?",
          type: "single_select",
          options: [
            "Not at all systematically",
            "Slightly systematically",
            "Moderately systematically",
            "Very systematically",
            "Extremely systematically"
          ],
          hasOther: false,
          required: true
        },
        {
          id: "staff_q2",
          sectionId: "group_a",
          number: "Q2",
          text: "Do you actively facilitate formal joint venture agreements between your incubated startups and external industry partners?",
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
          id: "staff_q3",
          sectionId: "group_a",
          number: "Q3",
          text: "How heavily does your operational staff rely on validated learning metrics over traditional financial metrics when evaluating early-stage startups?",
          type: "single_select",
          options: [
            "Not at all heavily",
            "Slightly heavily",
            "Moderately heavily",
            "Very heavily",
            "Extremely heavily"
          ],
          hasOther: false,
          required: true
        },
        {
          id: "staff_q4",
          sectionId: "group_a",
          number: "Q4",
          text: "Do you regularly collaborate with regional government bodies to align your incubator's goals with public innovation funding guidelines?",
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
          id: "staff_q5",
          sectionId: "group_a",
          number: "Q5",
          text: "How effectively do your incubator's resources support founders when they need to execute a strategic business model pivot?",
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
          id: "staff_q6",
          sectionId: "group_a",
          number: "Q6",
          text: "Do university-led lab research projects form the primary technology pipeline for new startups entering your incubator?",
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
          id: "staff_q7",
          sectionId: "group_a",
          number: "Q7",
          text: "What level of influence do active industry mentors have on shaping the product-market fit strategies of your startups?",
          type: "single_select",
          options: [
            "No influence",
            "Low influence",
            "Moderate influence",
            "High influence",
            "Very high influence"
          ],
          hasOther: false,
          required: true
        },
        {
          id: "staff_q8",
          sectionId: "group_a",
          number: "Q8",
          text: "Do administrative or bureaucratic compliance bottlenecks from the host university significantly delay your daily incubator operations?",
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
          id: "staff_q9",
          sectionId: "group_a",
          number: "Q9",
          text: "How consistently do your operational workflows require empirical customer discovery evidence before you allocate internal seed funding?",
          type: "single_select",
          options: [
            "Not at all consistently",
            "Slightly consistently",
            "Moderately consistently",
            "Very consistently",
            "Extremely consistently"
          ],
          hasOther: false,
          required: true
        },
        {
          id: "staff_q10",
          sectionId: "group_a",
          number: "Q10",
          text: "What is the overall extent of your incubator's reliance on trilateral networks (University-Industry-Government) to sustain its operational model?",
          type: "single_select",
          options: [
            "Not at all",
            "To a small extent",
            "To a moderate extent",
            "To a great extent",
            "To a very great extent"
          ],
          hasOther: false,
          required: true
        }
      ]
    }
  ]
};
