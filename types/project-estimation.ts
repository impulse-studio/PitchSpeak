export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  dailyRate?: number;
}

export interface TaskAssignment {
  task: string;
  assignedTo: string;
  phase: string;
  duration: string;
  complexity: "essential" | "obligatory" | "accidental";
}

export interface SimilarProject {
  name: string;
  url: string;
  description: string;
  avatar: string;
  relevanceScore: number;
}

export interface ComplexityBreakdown {
  essential: { duration: number; description: string };
  obligatory: { duration: number; multiplier: number; description: string };
  accidental: { duration: number; description: string };
  total: number;
}

export interface TechnicalCosts {
  infrastructure: {
    gpu?: number;
    api?: number;
    storage?: number;
    description: string;
  };
  development: { frontend: number; backend: number; ai: number };
  operations: { monitoring: number; maintenance: number; scaling: number };
  total: number;
}

export interface ProjectEstimate {
  title: string;
  description: string;
  timeline: string;
  budget: string;
  confidence: number;
  methodology: string;
  complexity: ComplexityBreakdown;
  technicalCosts: TechnicalCosts;
  phases: Array<{
    name: string;
    duration: string;
    description: string;
    complexity: "essential" | "obligatory" | "accidental";
    risks: string[];
  }>;
  risks: Array<{
    level: "low" | "medium" | "high";
    description: string;
    mitigation: string;
  }>;
  recommendations: Array<{
    priority: "high" | "medium" | "low";
    description: string;
    impact: string;
  }>;
  validationQuestions: string[];
  team?: TeamMember[];
  taskAssignments?: TaskAssignment[];
  similarProjects?: SimilarProject[];
}

export interface ConversationSession {
  id: string;
  date: string;
  messages: Array<{ role: "user" | "ai"; content: string }>;
  estimate?: ProjectEstimate;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
