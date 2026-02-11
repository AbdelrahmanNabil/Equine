
export interface Question {
  id: number;
  question_de: string;
  answer_de: string;
  question_en: string;
  answer_en: string;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  STUDY = 'STUDY',
  SUMMARY = 'SUMMARY'
}

export interface ProgressState {
  masteredIds: number[];
  reviewQueue: number[];
}
