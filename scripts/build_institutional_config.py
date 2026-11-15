import docx
import json

doc = docx.Document('Questionnaire_Faculty_and_Staff.docx')
text_lines = [p.text.strip() for p in doc.paragraphs if p.text.strip()]

group_a_lines = []
group_b_lines = []
current_group = None

for line in text_lines:
    if 'Group A:' in line:
        current_group = 'A'
        continue
    elif 'Group B:' in line:
        current_group = 'B'
        continue
    
    if current_group == 'A':
        group_a_lines.append(line)
    elif current_group == 'B':
        group_b_lines.append(line)

def parse_questions(lines, prefix, sec_id):
    questions = []
    curr_q = None
    for line in lines:
        if line.startswith('Q') and ':' in line[:5]:
            if curr_q:
                questions.append(curr_q)
            parts = line.split(':', 1)
            qnum = parts[0].strip()
            qtext = parts[1].strip()
            curr_q = {
                'id': f'{prefix}_{qnum.lower()}',
                'num': qnum,
                'sectionId': sec_id,
                'text': qtext,
                'type': 'single_select',
                'options': [],
                'required': True,
                'hasOther': False
            }
        elif curr_q and any(line.startswith(opt) for opt in ['A)', 'B)', 'C)', 'D)', 'E)']):
            opt_text = line[2:].strip() if line[1] == ')' else line
            curr_q['options'].append(opt_text)
    if curr_q:
        questions.append(curr_q)
    return questions

q_a = parse_questions(group_a_lines, 'staff', 'sec_staff')
q_b = parse_questions(group_b_lines, 'faculty', 'sec_faculty')

config = {
    'id': 'institutional',
    'title': 'Questionnaire for Incubator Managers and Operational Staff / Faculty Members',
    'shortTitle': 'Incubator Staff & Faculty Members',
    'targetGroup': 'Incubator Managers, Operational Staff & University Leadership',
    'description': 'This questionnaire investigates the factors influencing academic business incubator effectiveness from the perspective of incubator operational teams and university faculty leadership.',
    'instructions': [
        'Your responses will be used solely for academic research purposes and are completely anonymous.',
        'Please answer each question honestly based on your institutional experience.',
        'For each question, select the single most appropriate option.',
        'Your progress is continuously autosaved. You may safely resume at any time.'
    ],
    'confidentialityNotice': 'This survey is completely anonymous. No personally identifying information (such as your name, email address, or contact number) is collected or stored.',
    'consentStatement': 'I agree to participate in this anonymous academic research study. I understand that my responses are voluntary and will be analyzed in aggregate for academic research purposes.',
    'sections': [
        {
            'id': 'sec_staff',
            'title': 'Group A: Incubator Managers and Operational Staff',
            'description': 'Focuses on Build-Measure-Learn feedback loop implementation, joint venture agreements, validated metrics, and trilateral institutional networks.',
            'questions': q_a
        },
        {
            'id': 'sec_faculty',
            'title': 'Group B: Faculty Members (University Deans, HoDs, and VCs) associated with incubation programmes',
            'description': 'Evaluates university leadership support, IP commercialization, entrepreneurship curriculum integration, and institutional incentives.',
            'questions': q_b
        }
    ]
}

content = 'import { QuestionnaireConfig } from \'../lib/types\';\n\nexport const institutionalQuestionnaire: QuestionnaireConfig = ' + json.dumps(config, indent=2) + ';\n'

with open('institutional/config/questionnaire.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Generated institutional/config/questionnaire.ts with {len(q_a) + len(q_b)} total questions.')
