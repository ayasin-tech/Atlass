export interface Curriculum {
    journey: string;
    year: string;
    department: string;
    impactTitle: string;
    fellowResponsibility: string;
}

export interface Objective {
    intro: string;
    endGoal: string;
    points: string[];
}

export interface Competencies {
    description: string;
    items: string[];
}

export interface CrossCurricular {
    description: string;
}

export interface Differentiation {
    description: string;
    levels: string[];
    notes: string;
}

export interface Assessment {
    description: string;
    items: string[];
    standard: string;
}

export interface IntroductionStep {
    step: string;
    details: string[];
}

export interface IntroductionContent {
    title: string;
    content: string | string[] | IntroductionStep[];
}

export interface ActivityGame {
    title: string;
    steps: string[];
}

export interface ScenarioStep {
    name: string;
    details: string[];
}

export interface Scenario {
    title: string;
    overview: string;
    steps: ScenarioStep[];
}

export interface Debrief {
    points: string[];
    outcome: string;
}

export interface Activity {
    title: string;
    description: string;
    points?: string[];
    game?: ActivityGame;
    scenario?: Scenario;
    debrief?: Debrief;
}

export interface Faq {
    description: string;
    time: string;
}

export interface Closure {
    duration: string;
    superpowerTitle: string;
    superpowerQuestion: string;
}

export interface SessionFeedback {
    description: string;
    attachments: string[];
}


export interface UnitPlanData {
    facilitator: string;
    curriculum: Curriculum;
    objectives: Objective;
    competencies: Competencies;
    crossCurricular: CrossCurricular;
    differentiation: Differentiation;
    assessment: Assessment;
    prework: string;
    strategy: string;
    introduction: IntroductionContent[];
    activities: Activity[];
    faq: Faq;
    furtherReading: string;
    closure: Closure;
    feedbackOnPlan: string;
    sessionFeedback: SessionFeedback;
}

export interface UnitPlan {
    id: string;
    fileName: string;
    data: UnitPlanData;
}