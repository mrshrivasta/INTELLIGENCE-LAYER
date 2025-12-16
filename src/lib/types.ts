export type UserType = 'school_student' | 'college_student' | 'job_seeker';
export type EducationLevel = string;
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type LearningPreference = 'visual' | 'textual' | 'practice-heavy' | 'mixed';
export type ConsistencyScore = 'low' | 'medium' | 'high';
export type ImprovementTrend = 'improving' | 'stagnant' | 'declining';
export type Priority = 'high' | 'medium' | 'low';
export type GoalType = 'exam' | 'skill' | 'placement' | 'career_switch';
export type GoalTimeline = 'short_term' | 'medium_term' | 'long_term';
export type BackgroundKnowledge = 'non_tech' | 'basic_tech' | 'cs_background';

export interface TopicAccuracy {
  topic: string;
  accuracy: number;
  totalAttempts: number;
}

export interface TestScore {
  testId: string;
  testName: string;
  score: number;
  maxScore: number;
  date: string;
  topics: string[];
}

export interface UserProfile {
  userId: string;
  userType: UserType;
  educationLevel: EducationLevel;
  domain: string;
  primaryGoal: GoalType;
  skillLevel: SkillLevel;
  learningPreference: LearningPreference;
  consistencyScore: ConsistencyScore;
  testScoreHistory: TestScore[];
  topicAccuracyMap: TopicAccuracy[];
  weakAreas: string[];
  strongAreas: string[];
  improvementTrend: ImprovementTrend;
  hoursPerWeek?: number;
  goalTimeline?: GoalTimeline;
  backgroundKnowledge?: BackgroundKnowledge;
  targetRole?: string;
}

export interface GuidanceRecommendation {
  recommendedTopic: string;
  reason: string;
  priority: Priority;
  suggestedTimeInvestment: string;
  commonMistake: string;
  improvementTip: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options?: string[];
  type: 'multiple_choice' | 'short_answer' | 'coding' | 'conceptual';
  difficulty: SkillLevel;
  topic: string;
  correctAnswer: string;
  explanation: string;
  errorPatternInsight: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  duration: number;
  targetTopics: string[];
  userLevel: SkillLevel;
}

export interface PerformanceAnalysis {
  improving: string[];
  stagnating: string[];
  rootCauses: {
    area: string;
    cause: 'conceptual_gap' | 'practice_gap' | 'carelessness';
    details: string;
  }[];
  improvementActions: string[];
  overallAssessment: string;
}

export interface AdaptiveLearningDecision {
  action: 'reduce_difficulty' | 'maintain' | 'increase_complexity';
  reasoning: string;
  recommendations: string[];
}

export interface ProfileFeedback {
  progressSummary: string;
  trendAnalysis: string;
  highImpactAction: string;
  encouragement: string;
}

export interface RoadmapPhase {
  name: string;
  topics: {
    name: string;
    importance: string;
    expectedOutcome: string;
    priority: Priority;
    dependencies?: string[];
  }[];
  duration: string;
  milestones: string[];
}

export interface LearningRoadmap {
  field: string;
  targetRole?: string;
  userLevel: SkillLevel;
  timeline: GoalTimeline;
  phases: {
    foundational: RoadmapPhase;
    intermediate: RoadmapPhase;
    advanced: RoadmapPhase;
  };
  practiceGuidance: {
    type: string;
    description: string;
    validationMethod: string;
    avoidOverFocus: string[];
  };
  commonMisconceptions: string[];
  learningMindset: string[];
}

export interface AIConfig {
  enableAdaptiveLearning: boolean;
  assessmentDifficulty: SkillLevel;
  feedbackTone: 'supportive' | 'direct' | 'balanced';
  focusAreas: string[];
  excludeTopics: string[];
}
