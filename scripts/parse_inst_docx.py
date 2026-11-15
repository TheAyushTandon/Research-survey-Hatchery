import zipfile
import xml.etree.ElementTree as ET

with zipfile.ZipFile('Questionnaire_Faculty_and_Staff.docx') as docx:
    tree = ET.fromstring(docx.read('word/document.xml'))
    namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = []
    for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
        text = ''.join([t.text for t in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text])
        if text.strip():
            paragraphs.append(text.strip())

for i, p in enumerate(paragraphs):
    print(f"{i}: {p}")
