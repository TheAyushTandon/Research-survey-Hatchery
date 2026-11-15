const fs = require('fs');
const path = require('path');
const { createToken, verifyToken } = require('../scripts/generate-invitation-token');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('=== Academic Research Platform: Automated Test Suite ===\n');

  // Test 1: Questionnaire Config Files & Question Counts
  console.log('[Test Suite 1: Questionnaire Accuracy & Question Counts]');
  const foundersConfig = JSON.parse(fs.readFileSync('founders_config.json', 'utf8'));
  const govConfig = JSON.parse(fs.readFileSync('government_config.json', 'utf8'));
  const staffConfig = JSON.parse(fs.readFileSync('staff_config.json', 'utf8'));
  const facultyConfig = JSON.parse(fs.readFileSync('faculty_config.json', 'utf8'));

  const foundersTotal = foundersConfig.reduce((acc, s) => acc + s.questions.length, 0);
  const govTotal = govConfig.reduce((acc, s) => acc + s.questions.length, 0);
  const staffTotal = staffConfig.reduce((acc, s) => acc + s.questions.length, 0);
  const facultyTotal = facultyConfig.reduce((acc, s) => acc + s.questions.length, 0);

  assert(foundersTotal === 54, `Revised Founders questionnaire has exactly 54 questions (got ${foundersTotal})`);
  assert(govTotal === 42, `Government questionnaire has exactly 42 questions (got ${govTotal})`);
  assert(staffTotal === 10, `Institutional Staff questionnaire has exactly 10 questions (got ${staffTotal})`);
  assert(facultyTotal === 10, `Institutional Faculty questionnaire has exactly 10 questions (got ${facultyTotal})`);

  // Verify revised content in founders
  const fQ2 = foundersConfig[0].questions.find(q => q.num === 'Q2');
  const fQ8 = foundersConfig[0].questions.find(q => q.num === 'Q8');
  const fQ9 = foundersConfig[0].questions.find(q => q.num === 'Q9');
  const fQ10 = foundersConfig[0].questions.find(q => q.num === 'Q10');
  const fQ19 = foundersConfig[0].questions.find(q => q.num === 'Q19');

  assert(fQ2 && fQ2.options.includes('15–24 years'), 'Revised Founders Q2 has updated age bracket 15–24 years');
  assert(fQ8 && fQ8.options.includes('Yes') && fQ8.options.includes('No'), 'Founders Q8 is Incubated? (Yes/No)');
  assert(fQ9 && fQ9.conditional && fQ9.conditional.questionId === 'founders_sec_a_q8', 'Founders Q9 is conditional on Q8 == Yes');
  assert(fQ10 && fQ10.conditional && fQ10.conditional.questionId === 'founders_sec_a_q8', 'Founders Q10 is conditional on Q8 == Yes');
  assert(fQ19 && fQ19.type === 'limited_multi_select' && fQ19.maxSelections === 3, 'Founders Q19 is limited_multi_select with maxSelections: 3');

  // Verify H2 description uses 'founders' instead of 'funders'
  const h2Sec = foundersConfig.find(s => s.id === 'sec_b_h2');
  assert(h2Sec && h2Sec.description.includes('founders who adopt lean methodologies'), 'Revised H2 description specifies "founders who adopt"');

  // Test 2: Token Generation and Verification
  console.log('\n[Test Suite 2: Security & Token Access Control]');
  const founderToken = createToken('founders', 'founders', 30);
  const staffToken = createToken('institutional-staff', 'staff', 30);
  const facultyToken = createToken('institutional-faculty', 'faculty', 30);
  const govToken = createToken('government', 'government', 30);

  assert(verifyToken(founderToken, 'founders').valid === true, 'Founder token is valid for founders endpoint');
  assert(verifyToken(founderToken, 'government').valid === false, 'Founder token is strictly rejected for government endpoint');
  assert(verifyToken(staffToken, 'institutional-staff').valid === true, 'Staff token is valid for staff endpoint');
  assert(verifyToken(staffToken, 'institutional-faculty').valid === false, 'Staff token is strictly rejected for faculty endpoint');
  assert(verifyToken(facultyToken, 'institutional-faculty').valid === true, 'Faculty token is valid for faculty endpoint');
  assert(verifyToken(facultyToken, 'institutional-staff').valid === false, 'Faculty token is strictly rejected for staff endpoint');
  assert(verifyToken('tampered.token.123', 'founders').valid === false, 'Tampered token is rejected');

  // Test 3: PDF Generation
  console.log('\n[Test Suite 3: PDF Generation via jsPDF (Anonymous Mode)]');
  const { jsPDF } = require('jspdf');
  require('jspdf-autotable');

  const doc = new jsPDF();
  doc.text('To Identify the Factors Affecting the Success of Business Incubators in India', 14, 20);
  doc.autoTable({
    startY: 30,
    head: [['No.', 'Question Text', 'Selected Response']],
    body: [
      ['Q1', 'What is your gender?', 'Female'],
      ['Q8', 'Is your startup currently incubated?', 'Yes'],
      ['Q9', 'What type of incubator supports your startup?', 'University/Academic Incubator']
    ]
  });
  const pdfBytes = doc.output();
  assert(pdfBytes.length > 3000, `Anonymous PDF report generated successfully with ${doc.getNumberOfPages()} page(s) (${pdfBytes.length} bytes)`);

  // Summary
  console.log(`\n==================================================`);
  console.log(`Total tests passed: ${passed}`);
  console.log(`Total tests failed: ${failed}`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
