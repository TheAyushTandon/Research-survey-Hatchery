import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { QuestionnaireConfig, RespondentInfo, ResponseValue } from './types';

export function generatePdfReport(
  config: QuestionnaireConfig,
  respondent: RespondentInfo,
  responses: Record<string, ResponseValue>,
  sessionId: string,
  submissionDate: string
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const darkTextColor = [31, 41, 55];
  const grayBorder = [229, 231, 235];

  // 1. Header Banner
  doc.setFillColor(121, 173, 220); // Cool Horizon #79addc
  doc.rect(0, 0, 210, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('ACADEMIC RESEARCH QUESTIONNAIRE PLATFORM', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Official Verified Response Report · Research Record', 14, 18);

  // 2. Study Title & Subtitle
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  const splitTitle = doc.splitTextToSize(config.title, 182);
  doc.text(splitTitle, 14, 33);

  let currentY = 33 + splitTitle.length * 5.5;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Stakeholder Stream: ${config.targetGroup}`, 14, currentY);
  currentY += 7;

  // 3. Respondent & Session Card
  doc.setDrawColor(grayBorder[0], grayBorder[1], grayBorder[2]);
  doc.setFillColor(252, 252, 252);
  doc.roundedRect(14, currentY, 182, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('PARTICIPANT PROFILE & VERIFICATION', 18, currentY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Full Name: ${respondent.fullName || 'N/A'}`, 18, currentY + 13);
  doc.text(`Designation: ${respondent.designation || 'N/A'}`, 18, currentY + 18.5);
  doc.text(`Email: ${respondent.email || 'N/A'}`, 18, currentY + 24);

  doc.text(`Session ID: ${sessionId}`, 108, currentY + 13);
  doc.text(`Submitted On: ${new Date(submissionDate).toLocaleString()}`, 108, currentY + 18.5);
  doc.text(`Status: Verified Academic Submission`, 108, currentY + 24);

  currentY += 36;

  // 4. Calculate stats
  let totalEligibleQuestions = 0;
  let answeredCount = 0;

  config.sections.forEach((sec) => {
    sec.questions.forEach((q) => {
      if (q.conditional) {
        const parentAns = responses[q.conditional.questionId]?.value;
        if (parentAns !== q.conditional.equals) return;
      }
      totalEligibleQuestions++;
      if (responses[q.id]?.value !== undefined && responses[q.id]?.value !== '') {
        answeredCount++;
      }
    });
  });

  const completionPct = totalEligibleQuestions > 0 ? Math.round((answeredCount / totalEligibleQuestions) * 100) : 100;

  // Stat summary pill
  doc.setFillColor(240, 246, 252);
  doc.roundedRect(14, currentY, 182, 9, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 58, 138);
  doc.text(
    `Total Applicable Questions: ${totalEligibleQuestions}   |   Answered: ${answeredCount}   |   Completion Rate: ${completionPct}%`,
    18,
    currentY + 5.8
  );

  currentY += 14;

  // 5. Sections and Responses Table
  config.sections.forEach((sec) => {
    const tableBody: any[] = [];

    sec.questions.forEach((q) => {
      if (q.conditional) {
        const parentAns = responses[q.conditional.questionId]?.value;
        if (parentAns !== q.conditional.equals) {
          tableBody.push([q.number, q.text, '[Not applicable - condition not met]']);
          return;
        }
      }

      const resObj = responses[q.id];
      let answerText = '[Unanswered / Skipped]';
      if (resObj && resObj.value !== undefined) {
        if (Array.isArray(resObj.value)) {
          answerText = resObj.value.join('\n• ');
          if (resObj.value.length > 0) answerText = '• ' + answerText;
        } else {
          answerText = String(resObj.value);
        }
        if (resObj.otherText) {
          answerText += `\n(Specified: ${resObj.otherText})`;
        }
      }

      tableBody.push([q.number, q.text, answerText]);
    });

    (doc as any).autoTable({
      startY: currentY,
      margin: { left: 14, right: 14 },
      head: [
        [
          {
            content: `${sec.title}`,
            colSpan: 3,
            styles: {
              fillColor: [121, 173, 220],
              textColor: [255, 255, 255],
              fontStyle: 'bold',
              fontSize: 9,
            },
          },
        ],
        ['No.', 'Question Text', 'Selected Response'],
      ],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [243, 244, 246],
        textColor: [31, 41, 55],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [31, 41, 55],
        valign: 'top',
        cellPadding: 2.2,
      },
      columnStyles: {
        0: { cellWidth: 14, fontStyle: 'bold' },
        1: { cellWidth: 108 },
        2: { cellWidth: 60, fontStyle: 'bold', textColor: [40, 60, 90] },
      },
      didDrawPage: (data: any) => {
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(7);
        doc.setTextColor(156, 163, 175);
        doc.text(
          `Academic Research Questionnaire · Session: ${sessionId} · Page ${data.pageNumber} of ${pageCount}`,
          14,
          290
        );
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
    if (currentY > 260) {
      doc.addPage();
      currentY = 16;
    }
  });

  return doc;
}
