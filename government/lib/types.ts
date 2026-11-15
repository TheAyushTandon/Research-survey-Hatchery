// Core TypeScript Type Definitions for Research Questionnaire Platform

export type QuestionType =
  | 'single_select'
  | 'multi_select'
  | 'limited_multi_select'
  | 'likert_4'
  | 'likert_5'
  | 'text';

export interface QuestionCondition {
  questionId: string;
  equals: string | boolean;
}

export interface Question {
  id: string;
  sectionId: string;
  number: string;
  text: string;
  type: QuestionType;
  options: string[];
  hasOther?: boolean;
  otherPlaceholder?: string;
  maxSelections?: number;
  conditional?: QuestionCondition;
  required: boolean;
  scaleMetadata?: {
    minLabel?: string;
    maxLabel?: string;
    points?: number;
  };
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface QuestionnaireConfig {
  id: string;
  title: string;
  shortTitle: string;
  targetGroup: string;
  description: string;
  instructions: string[];
  confidentialityNotice: string;
  consentStatement: string;
  sections: Section[];
}

export interface RespondentInfo {
  fullName: string;
  designation: string;
  email: string;
  phone: string;
  consentGiven: boolean;
  consentTimestamp: string;
}

export interface ResponseValue {
  value: string | string[];
  otherText?: string;
  answeredAt: string;
}

export interface SessionData {
  sessionId: string;
  respondentId: string;
  questionnaireId: string;
  respondentGroup: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';
  currentSectionId: string;
  currentQuestionId: string;
  startedAt: string;
  lastUpdatedAt: string;
  submittedAt?: string;
  resumeToken: string;
  respondent?: RespondentInfo;
  responses: Record<string, ResponseValue>;
}

export interface SaveResponsePayload {
  sessionId: string;
  questionId: string;
  sectionId: string;
  questionNumber: string;
  questionText: string;
  value: string | string[];
  otherText?: string;
  currentQuestionId?: string;
  currentSectionId?: string;
}
