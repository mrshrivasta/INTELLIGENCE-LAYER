import {
  UserProfile,
  GuidanceRecommendation,
  Assessment,
  AssessmentQuestion,
  PerformanceAnalysis,
  AdaptiveLearningDecision,
  ProfileFeedback,
  LearningRoadmap,
  AIConfig,
  Priority,
  SkillLevel,
} from './types';

const defaultConfig: AIConfig = {
  enableAdaptiveLearning: true,
  assessmentDifficulty: 'intermediate',
  feedbackTone: 'balanced',
  focusAreas: [],
  excludeTopics: [],
};

export function generateGuidance(
  profile: UserProfile,
  config: AIConfig = defaultConfig
): GuidanceRecommendation {
  const weakAreas = profile.weakAreas.filter(
    (area) => !config.excludeTopics.includes(area)
  );
  const focusTopics = config.focusAreas.length > 0 ? config.focusAreas : weakAreas;
  
  const recommendedTopic = focusTopics[0] || profile.domain;
  
  const priorityMap: Record<string, Priority> = {
    declining: 'high',
    stagnant: 'medium',
    improving: 'low',
  };
  
  const timeMap: Record<string, string> = {
    beginner: '2-3 hours daily',
    intermediate: '1.5-2 hours daily',
    advanced: '1 hour daily for specialization',
  };

  return {
    recommendedTopic,
    reason: `Based on your ${profile.improvementTrend} trend and ${profile.consistencyScore} consistency, focusing on ${recommendedTopic} will address your current knowledge gaps.`,
    priority: priorityMap[profile.improvementTrend],
    suggestedTimeInvestment: timeMap[profile.skillLevel],
    commonMistake: `Many learners at your level skip foundational concepts in ${recommendedTopic}. Ensure basics are solid before advancing.`,
    improvementTip: `Practice ${recommendedTopic} with real-world scenarios to reinforce understanding. Review mistakes systematically.`,
  };
}

export function generateAssessment(
  profile: UserProfile,
  config: AIConfig = defaultConfig
): Assessment {
  const targetTopics = config.focusAreas.length > 0 
    ? config.focusAreas 
    : [...profile.weakAreas, ...profile.strongAreas.slice(0, 2)];
  
  const difficultyLevel = config.enableAdaptiveLearning
    ? getAdaptedDifficulty(profile)
    : config.assessmentDifficulty;

  const questions = generateQuestions(targetTopics, difficultyLevel, profile);

  return {
    id: `assessment-${Date.now()}`,
    title: `${profile.domain} Assessment - ${new Date().toLocaleDateString()}`,
    description: `Personalized assessment covering: ${targetTopics.join(', ')}`,
    questions,
    duration: questions.length * 3,
    targetTopics,
    userLevel: difficultyLevel,
  };
}

function generateQuestions(
  topics: string[],
  difficulty: SkillLevel,
  profile: UserProfile
): AssessmentQuestion[] {
  const questionTemplates: Record<string, AssessmentQuestion[]> = {
    'Data Structures': [
      {
        id: 'q1',
        question: 'What is the time complexity of searching in a balanced binary search tree?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        type: 'multiple_choice',
        difficulty: 'intermediate',
        topic: 'Data Structures',
        correctAnswer: 'O(log n)',
        explanation: 'A balanced BST maintains height of log(n), ensuring search operations traverse at most log(n) nodes.',
        errorPatternInsight: 'Common mistake: confusing with unbalanced trees which can degrade to O(n).',
      },
      {
        id: 'q2',
        question: 'Which data structure uses LIFO (Last In First Out) principle?',
        options: ['Queue', 'Stack', 'Linked List', 'Tree'],
        type: 'multiple_choice',
        difficulty: 'beginner',
        topic: 'Data Structures',
        correctAnswer: 'Stack',
        explanation: 'Stack follows LIFO - the last element pushed is the first one to be popped.',
        errorPatternInsight: 'Often confused with Queue which uses FIFO.',
      },
    ],
    'Algorithms': [
      {
        id: 'q3',
        question: 'What is the best-case time complexity of Quick Sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        type: 'multiple_choice',
        difficulty: 'intermediate',
        topic: 'Algorithms',
        correctAnswer: 'O(n log n)',
        explanation: 'Quick Sort achieves O(n log n) when pivot consistently divides array into equal halves.',
        errorPatternInsight: 'Students often confuse best-case with average-case scenarios.',
      },
    ],
    'Web Development': [
      {
        id: 'q4',
        question: 'What does the "use client" directive indicate in Next.js?',
        options: ['Server-side rendering', 'Client-side component', 'API route', 'Static generation'],
        type: 'multiple_choice',
        difficulty: 'intermediate',
        topic: 'Web Development',
        correctAnswer: 'Client-side component',
        explanation: 'The "use client" directive marks a component as a Client Component in Next.js App Router.',
        errorPatternInsight: 'Learners often misunderstand when to use client vs server components.',
      },
    ],
    'Machine Learning': [
      {
        id: 'q5',
        question: 'Which technique helps prevent overfitting in neural networks?',
        options: ['Increasing model complexity', 'Dropout', 'Removing validation set', 'Training longer'],
        type: 'multiple_choice',
        difficulty: 'intermediate',
        topic: 'Machine Learning',
        correctAnswer: 'Dropout',
        explanation: 'Dropout randomly deactivates neurons during training, preventing co-adaptation.',
        errorPatternInsight: 'Beginners often think more training always improves performance.',
      },
    ],
    'Cyber Security': [
      {
        id: 'q6',
        question: 'What type of attack involves tricking users into revealing sensitive information?',
        options: ['DDoS', 'Phishing', 'Buffer Overflow', 'SQL Injection'],
        type: 'multiple_choice',
        difficulty: 'beginner',
        topic: 'Cyber Security',
        correctAnswer: 'Phishing',
        explanation: 'Phishing uses social engineering to deceive users into providing credentials or data.',
        errorPatternInsight: 'Often confused with technical attacks; phishing is primarily social engineering.',
      },
    ],
  };

  const questions: AssessmentQuestion[] = [];
  let questionIndex = 1;

  for (const topic of topics) {
    const topicQuestions = questionTemplates[topic] || generateGenericQuestion(topic, difficulty, questionIndex);
    const filteredQuestions = Array.isArray(topicQuestions) 
      ? topicQuestions.filter(q => matchesDifficulty(q.difficulty, difficulty))
      : [topicQuestions];
    
    questions.push(...filteredQuestions.map(q => ({
      ...q,
      id: `q${questionIndex++}`,
    })));
  }

  return questions.slice(0, 10);
}

function generateGenericQuestion(topic: string, difficulty: SkillLevel, index: number): AssessmentQuestion {
  return {
    id: `q${index}`,
    question: `Explain a key concept in ${topic} and its practical application.`,
    type: 'conceptual',
    difficulty,
    topic,
    correctAnswer: 'Evaluated based on conceptual understanding and practical relevance.',
    explanation: `This question tests foundational understanding of ${topic}.`,
    errorPatternInsight: 'Focus on both theory and application for comprehensive understanding.',
  };
}

function matchesDifficulty(questionDifficulty: string, targetDifficulty: SkillLevel): boolean {
  const levels = ['beginner', 'intermediate', 'advanced'];
  const questionLevel = levels.indexOf(questionDifficulty);
  const targetLevel = levels.indexOf(targetDifficulty);
  return Math.abs(questionLevel - targetLevel) <= 1;
}

function getAdaptedDifficulty(profile: UserProfile): SkillLevel {
  if (profile.improvementTrend === 'declining') {
    const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];
    const currentIndex = levels.indexOf(profile.skillLevel);
    return levels[Math.max(0, currentIndex - 1)];
  }
  if (profile.improvementTrend === 'improving') {
    const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];
    const currentIndex = levels.indexOf(profile.skillLevel);
    return levels[Math.min(2, currentIndex + 1)];
  }
  return profile.skillLevel;
}

export function analyzePerformance(profile: UserProfile): PerformanceAnalysis {
  const recentScores = profile.testScoreHistory.slice(-5);
  const scorePercentages = recentScores.map(s => (s.score / s.maxScore) * 100);
  
  const improving: string[] = [];
  const stagnating: string[] = [];
  
  profile.topicAccuracyMap.forEach(topic => {
    if (topic.accuracy >= 75) {
      improving.push(topic.topic);
    } else if (topic.accuracy < 50) {
      stagnating.push(topic.topic);
    }
  });

  const rootCauses = profile.weakAreas.map(area => {
    const topicData = profile.topicAccuracyMap.find(t => t.topic === area);
    let cause: 'conceptual_gap' | 'practice_gap' | 'carelessness' = 'practice_gap';
    
    if (topicData) {
      if (topicData.accuracy < 30) cause = 'conceptual_gap';
      else if (topicData.totalAttempts < 10) cause = 'practice_gap';
      else cause = 'carelessness';
    }
    
    return {
      area,
      cause,
      details: getCauseDetails(cause, area),
    };
  });

  const avgScore = scorePercentages.length > 0 
    ? scorePercentages.reduce((a, b) => a + b, 0) / scorePercentages.length 
    : 0;

  return {
    improving,
    stagnating,
    rootCauses,
    improvementActions: generateImprovementActions(rootCauses, profile),
    overallAssessment: `Performance is ${profile.improvementTrend}. Average recent score: ${avgScore.toFixed(1)}%. Focus areas: ${stagnating.join(', ') || 'None identified'}.`,
  };
}

function getCauseDetails(cause: string, area: string): string {
  const details: Record<string, string> = {
    conceptual_gap: `Foundational understanding of ${area} needs strengthening. Review core concepts before practice.`,
    practice_gap: `More hands-on practice with ${area} is needed. Increase problem-solving frequency.`,
    carelessness: `Errors in ${area} appear pattern-based. Slow down and double-check work.`,
  };
  return details[cause] || `Review ${area} systematically.`;
}

function generateImprovementActions(
  rootCauses: PerformanceAnalysis['rootCauses'],
  profile: UserProfile
): string[] {
  const actions: string[] = [];
  
  rootCauses.forEach(({ area, cause }) => {
    switch (cause) {
      case 'conceptual_gap':
        actions.push(`Revise fundamental concepts of ${area} before attempting advanced problems.`);
        break;
      case 'practice_gap':
        actions.push(`Complete 5-10 practice problems daily for ${area}.`);
        break;
      case 'carelessness':
        actions.push(`Implement a review checklist for ${area} problems.`);
        break;
    }
  });

  if (profile.consistencyScore === 'low') {
    actions.push('Establish a fixed daily study schedule to improve consistency.');
  }

  return actions;
}

export function getAdaptiveLearningDecision(profile: UserProfile): AdaptiveLearningDecision {
  if (profile.improvementTrend === 'declining') {
    return {
      action: 'reduce_difficulty',
      reasoning: 'Performance trend indicates difficulty level may be too high. Reinforcing fundamentals will rebuild confidence.',
      recommendations: [
        'Reduce problem complexity temporarily',
        'Increase revision frequency for weak areas',
        'Focus on conceptual clarity before speed',
      ],
    };
  }

  if (profile.improvementTrend === 'improving') {
    return {
      action: 'increase_complexity',
      reasoning: 'Strong improvement trend suggests readiness for more challenging material.',
      recommendations: [
        'Introduce exam-level or real-world scenarios',
        'Add time constraints to practice sessions',
        'Explore advanced topics within strong areas',
      ],
    };
  }

  return {
    action: 'maintain',
    reasoning: 'Performance is stable. Maintain current difficulty while introducing variety.',
    recommendations: [
      'Add mixed-topic practice sessions',
      'Vary question types to prevent plateau',
      'Review and consolidate recent learning',
    ],
  };
}

export function generateProfileFeedback(profile: UserProfile): ProfileFeedback {
  const recentScores = profile.testScoreHistory.slice(-3);
  const avgRecent = recentScores.length > 0
    ? recentScores.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / recentScores.length
    : 0;

  const trendDescriptions: Record<string, string> = {
    improving: 'Your scores show consistent improvement over recent assessments.',
    stagnant: 'Your performance has plateaued. Consider adjusting your study approach.',
    declining: 'Recent scores indicate a dip. This is recoverable with focused effort.',
  };

  const highImpactActions: Record<string, string> = {
    low: 'Prioritize consistency: commit to daily 30-minute focused sessions.',
    medium: 'Focus on your weakest area: dedicate extra time to one topic this week.',
    high: 'Challenge yourself: attempt one advanced problem daily.',
  };

  return {
    progressSummary: `Recent average: ${avgRecent.toFixed(1)}%. Strong areas: ${profile.strongAreas.join(', ')}. Areas needing work: ${profile.weakAreas.join(', ')}.`,
    trendAnalysis: trendDescriptions[profile.improvementTrend],
    highImpactAction: highImpactActions[profile.consistencyScore],
    encouragement: getEncouragement(profile),
  };
}

function getEncouragement(profile: UserProfile): string {
  if (profile.improvementTrend === 'improving') {
    return 'Excellent progress! Your dedication is paying off. Keep this momentum.';
  }
  if (profile.improvementTrend === 'declining') {
    return 'Temporary setbacks are part of learning. Focus on fundamentals and you will recover.';
  }
  return 'Steady progress builds strong foundations. Small consistent efforts lead to big results.';
}

export function generateLearningRoadmap(
  field: string,
  profile: UserProfile
): LearningRoadmap {
  const roadmapTemplates: Record<string, Partial<LearningRoadmap>> = {
    'Cyber Security': {
      phases: {
        foundational: {
          name: 'Security Fundamentals',
          topics: [
            { name: 'Networking Basics', importance: 'Foundation for understanding attack vectors', expectedOutcome: 'Understand TCP/IP, DNS, HTTP protocols', priority: 'high' },
            { name: 'Operating Systems', importance: 'Required for system-level security', expectedOutcome: 'Navigate Linux/Windows confidently', priority: 'high' },
            { name: 'Security Principles', importance: 'Core security mindset', expectedOutcome: 'Understand CIA triad, authentication, authorization', priority: 'high' },
          ],
          duration: '2-3 months',
          milestones: ['Complete networking certification prep', 'Set up home lab environment'],
        },
        intermediate: {
          name: 'Applied Security',
          topics: [
            { name: 'Vulnerability Assessment', importance: 'Identify security weaknesses', expectedOutcome: 'Use scanning tools effectively', priority: 'high', dependencies: ['Networking Basics'] },
            { name: 'Web Security', importance: 'Most common attack surface', expectedOutcome: 'Understand OWASP Top 10', priority: 'high' },
            { name: 'Cryptography', importance: 'Data protection foundation', expectedOutcome: 'Implement secure communication', priority: 'medium' },
          ],
          duration: '3-4 months',
          milestones: ['Complete CTF challenges', 'Build vulnerable app lab'],
        },
        advanced: {
          name: 'Specialization',
          topics: [
            { name: 'Penetration Testing', importance: 'Offensive security skills', expectedOutcome: 'Conduct structured security assessments', priority: 'high', dependencies: ['Vulnerability Assessment'] },
            { name: 'Incident Response', importance: 'Handle security breaches', expectedOutcome: 'Create incident response procedures', priority: 'medium' },
            { name: 'Security Architecture', importance: 'Design secure systems', expectedOutcome: 'Design defense-in-depth strategies', priority: 'medium' },
          ],
          duration: '4-6 months',
          milestones: ['Complete practical certification', 'Contribute to bug bounty'],
        },
      },
      practiceGuidance: {
        type: 'Hands-on Labs',
        description: 'Use platforms like HackTheBox, TryHackMe for practical experience',
        validationMethod: 'Complete challenges, document findings',
        avoidOverFocus: ['Memorizing tools without understanding', 'Skipping networking fundamentals'],
      },
      commonMisconceptions: [
        'Security is just about hacking - it includes defense, compliance, and policy',
        'Tools matter more than concepts - understanding beats tool proficiency',
        'Certifications guarantee jobs - practical skills are equally important',
      ],
      learningMindset: [
        'Adopt an adversarial thinking approach',
        'Stay current with threat landscape',
        'Practice ethical responsibility always',
      ],
    },
    'Web Development': {
      phases: {
        foundational: {
          name: 'Frontend Basics',
          topics: [
            { name: 'HTML & CSS', importance: 'Building blocks of web', expectedOutcome: 'Create responsive layouts', priority: 'high' },
            { name: 'JavaScript Fundamentals', importance: 'Core programming language', expectedOutcome: 'Write interactive features', priority: 'high' },
            { name: 'Version Control (Git)', importance: 'Essential collaboration tool', expectedOutcome: 'Manage code professionally', priority: 'high' },
          ],
          duration: '2-3 months',
          milestones: ['Build 3 responsive websites', 'Create GitHub portfolio'],
        },
        intermediate: {
          name: 'Modern Frameworks',
          topics: [
            { name: 'React/Next.js', importance: 'Industry-standard frameworks', expectedOutcome: 'Build production-ready apps', priority: 'high', dependencies: ['JavaScript Fundamentals'] },
            { name: 'Backend Development', importance: 'Full-stack capability', expectedOutcome: 'Create APIs and handle data', priority: 'high' },
            { name: 'Databases', importance: 'Data persistence', expectedOutcome: 'Design and query databases', priority: 'high' },
          ],
          duration: '3-4 months',
          milestones: ['Deploy full-stack application', 'Contribute to open source'],
        },
        advanced: {
          name: 'Production Skills',
          topics: [
            { name: 'Performance Optimization', importance: 'User experience quality', expectedOutcome: 'Optimize load times and rendering', priority: 'medium', dependencies: ['React/Next.js'] },
            { name: 'Testing', importance: 'Code reliability', expectedOutcome: 'Write comprehensive tests', priority: 'medium' },
            { name: 'DevOps Basics', importance: 'Deployment and maintenance', expectedOutcome: 'Set up CI/CD pipelines', priority: 'medium' },
          ],
          duration: '2-3 months',
          milestones: ['Launch production project', 'Achieve 90+ Lighthouse score'],
        },
      },
      practiceGuidance: {
        type: 'Project-based Learning',
        description: 'Build real projects that solve actual problems',
        validationMethod: 'Deploy projects, gather user feedback',
        avoidOverFocus: ['Tutorial hell', 'Learning frameworks before JavaScript basics'],
      },
      commonMisconceptions: [
        'More frameworks = better developer - depth beats breadth',
        'Frontend is easier than backend - both have unique challenges',
        'You need to know everything - specialize and expand gradually',
      ],
      learningMindset: [
        'Build consistently, even small projects count',
        'Read documentation as primary source',
        'Focus on user experience, not just code',
      ],
    },
    'Machine Learning': {
      phases: {
        foundational: {
          name: 'Mathematical Foundations',
          topics: [
            { name: 'Linear Algebra', importance: 'Core math for ML', expectedOutcome: 'Understand vectors, matrices, transformations', priority: 'high' },
            { name: 'Statistics & Probability', importance: 'Data understanding', expectedOutcome: 'Apply statistical concepts to data', priority: 'high' },
            { name: 'Python Programming', importance: 'Primary ML language', expectedOutcome: 'Write efficient data processing code', priority: 'high' },
          ],
          duration: '2-3 months',
          milestones: ['Complete math prerequisites', 'Build data analysis projects'],
        },
        intermediate: {
          name: 'Core ML Concepts',
          topics: [
            { name: 'Supervised Learning', importance: 'Most common ML paradigm', expectedOutcome: 'Implement classification and regression', priority: 'high', dependencies: ['Linear Algebra', 'Python Programming'] },
            { name: 'Unsupervised Learning', importance: 'Pattern discovery', expectedOutcome: 'Apply clustering and dimensionality reduction', priority: 'high' },
            { name: 'Model Evaluation', importance: 'Validate model performance', expectedOutcome: 'Select appropriate metrics and validation strategies', priority: 'high' },
          ],
          duration: '3-4 months',
          milestones: ['Complete Kaggle competitions', 'Build end-to-end ML pipeline'],
        },
        advanced: {
          name: 'Deep Learning & Specialization',
          topics: [
            { name: 'Neural Networks', importance: 'Modern ML foundation', expectedOutcome: 'Design and train neural architectures', priority: 'high', dependencies: ['Supervised Learning'] },
            { name: 'Domain Specialization', importance: 'Career focus', expectedOutcome: 'Expertise in NLP, CV, or other domains', priority: 'medium' },
            { name: 'MLOps', importance: 'Production deployment', expectedOutcome: 'Deploy and monitor ML systems', priority: 'medium' },
          ],
          duration: '4-6 months',
          milestones: ['Deploy ML model to production', 'Publish research or blog'],
        },
      },
      practiceGuidance: {
        type: 'Data Projects',
        description: 'Work with real datasets from Kaggle, UCI, or domain-specific sources',
        validationMethod: 'Benchmark against established baselines',
        avoidOverFocus: ['Collecting certifications without projects', 'Skipping math foundations'],
      },
      commonMisconceptions: [
        'More data always helps - quality and relevance matter more',
        'Deep learning is always better - simpler models often suffice',
        'ML is mostly coding - domain knowledge is equally critical',
      ],
      learningMindset: [
        'Understand the math, do not just use libraries',
        'Iterate quickly, fail fast, learn faster',
        'Focus on problem definition before solution',
      ],
    },
  };

  const template = roadmapTemplates[field] || roadmapTemplates['Web Development'];
  
  return {
    field,
    targetRole: profile.targetRole,
    userLevel: profile.skillLevel,
    timeline: profile.goalTimeline || 'medium_term',
    phases: template.phases!,
    practiceGuidance: template.practiceGuidance!,
    commonMisconceptions: template.commonMisconceptions!,
    learningMindset: template.learningMindset!,
  };
}
