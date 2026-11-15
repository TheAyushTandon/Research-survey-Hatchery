import json

with open('government_config.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find sec_b_h2
h2_sec = next(s for s in data if s['id'] == 'sec_b_h2')
h2_sec['description'] = "H2: Strong collaboration among the government, industry, and academia reduces the time required for founders to plan and execute their business models."

h2_all_q = h2_sec['questions']
h2_q1_to_5 = h2_all_q[:5]
h2_q6_to_10 = h2_all_q[5:]

h2_sec['questions'] = h2_q1_to_5

h3_questions = []
for idx, q in enumerate(h2_q6_to_10):
    new_q = dict(q)
    new_q['id'] = f"gov_h3_q{idx+1}"
    new_q['number'] = f"Q{idx+1}"
    new_q['num'] = f"Q{idx+1}"
    h3_questions.append(new_q)

h3_sec = {
    "id": "sec_b_h3",
    "title": "Section B — Hypothesis 3",
    "description": "H3: Adoption of Lean Startup practices by startups enhances the effective utilisation of government support and improves the achievement of programme objectives.",
    "questions": h3_questions
}

# Insert h3 right after h2
h2_index = data.index(h2_sec)
data.insert(h2_index + 1, h3_sec)

with open('government_config.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Updated government_config.json! Total sections:", len(data))
print("Total questions:", sum(len(s['questions']) for s in data))
