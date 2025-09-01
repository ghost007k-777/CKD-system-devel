
export enum Step {
  ProjectInfo = 1,
  SafetyTraining = 2,
  RiskAssessment = 3,
  WorkPermit = 4,
  SafetyPledge = 5,
  Confirmation = 6,
  Submitted = 7,
}

export interface ProjectInfo {
  location: string;
  locationOther?: string;
  constructionName: string;
  companyName: string;
  contactPerson: string;
}

export interface SafetyTraining {
  completed: boolean;
  completionDate: Date | null;
}

export interface RiskItem {
  id: string;
  location: string;
  task: string;
  hazard: string;
  safetyMeasures: string;
  likelihood: number;
  severity: number;
  reductionMeasures: string;
}

export type RiskAssessment = RiskItem[];

export interface WorkPermit {
  type: 'general' | 'hazardous' | '';
  workDate: string;
  workStartTime: string;
  workEndTime: string;
  location: string;
  description: string;
  workerCount: number;
  hasProcedureDoc: boolean;
  hasRiskAssessment: boolean;
  safetyChecks: string[];
}

export interface SafetyPledge {
  agreements: { [key: string]: boolean };
  agreeToAll: boolean;
  name: string;
  signature: string;
}

export interface FormData {
  projectInfo: ProjectInfo;
  safetyTraining: SafetyTraining;
  riskAssessment: RiskAssessment;
  workPermit: WorkPermit;
  safetyPledge: SafetyPledge;
}