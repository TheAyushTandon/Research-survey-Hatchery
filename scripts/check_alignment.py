with open('google-apps-scripts/AppsScript_Government.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('const QUESTION_COLUMNS = [')
end = text.find('];', start)
import json
cols = json.loads(text[start + len('const QUESTION_COLUMNS = '):end + 1])
print('Total columns:', len(cols))
for i, c in enumerate(cols):
    print(str(i+1) + ". id=" + c['id'] + ", header=" + c['header'])
