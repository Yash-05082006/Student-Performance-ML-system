// Mock data for the Student Performance Prediction Dashboard

export interface Student {
  attendance: number;
  testScore: number;
  assignmentScore: number;
  backlogs: number;
  engagement: number;
  performance: "High" | "Medium" | "Low";
}

export const students: Student[] = [
  { attendance: 92, testScore: 88, assignmentScore: 91, backlogs: 0, engagement: 85, performance: "High" },
  { attendance: 78, testScore: 72, assignmentScore: 68, backlogs: 1, engagement: 65, performance: "Medium" },
  { attendance: 55, testScore: 45, assignmentScore: 50, backlogs: 3, engagement: 40, performance: "Low" },
  { attendance: 88, testScore: 82, assignmentScore: 85, backlogs: 0, engagement: 80, performance: "High" },
  { attendance: 65, testScore: 58, assignmentScore: 62, backlogs: 2, engagement: 55, performance: "Low" },
  { attendance: 95, testScore: 90, assignmentScore: 93, backlogs: 0, engagement: 92, performance: "High" },
  { attendance: 70, testScore: 65, assignmentScore: 70, backlogs: 1, engagement: 60, performance: "Medium" },
  { attendance: 82, testScore: 75, assignmentScore: 78, backlogs: 0, engagement: 72, performance: "Medium" },
  { attendance: 48, testScore: 40, assignmentScore: 42, backlogs: 4, engagement: 35, performance: "Low" },
  { attendance: 91, testScore: 86, assignmentScore: 89, backlogs: 0, engagement: 88, performance: "High" },
  { attendance: 73, testScore: 68, assignmentScore: 65, backlogs: 1, engagement: 62, performance: "Medium" },
  { attendance: 60, testScore: 52, assignmentScore: 55, backlogs: 2, engagement: 48, performance: "Low" },
  { attendance: 87, testScore: 80, assignmentScore: 83, backlogs: 0, engagement: 78, performance: "High" },
  { attendance: 76, testScore: 70, assignmentScore: 72, backlogs: 1, engagement: 66, performance: "Medium" },
  { attendance: 52, testScore: 43, assignmentScore: 47, backlogs: 3, engagement: 38, performance: "Low" },
  { attendance: 94, testScore: 91, assignmentScore: 90, backlogs: 0, engagement: 90, performance: "High" },
  { attendance: 68, testScore: 60, assignmentScore: 63, backlogs: 2, engagement: 57, performance: "Medium" },
  { attendance: 85, testScore: 79, assignmentScore: 81, backlogs: 0, engagement: 75, performance: "High" },
  { attendance: 58, testScore: 48, assignmentScore: 51, backlogs: 3, engagement: 42, performance: "Low" },
  { attendance: 80, testScore: 74, assignmentScore: 76, backlogs: 1, engagement: 70, performance: "Medium" },
  { attendance: 90, testScore: 85, assignmentScore: 87, backlogs: 0, engagement: 83, performance: "High" },
  { attendance: 62, testScore: 54, assignmentScore: 58, backlogs: 2, engagement: 50, performance: "Low" },
  { attendance: 75, testScore: 69, assignmentScore: 71, backlogs: 1, engagement: 64, performance: "Medium" },
  { attendance: 50, testScore: 38, assignmentScore: 44, backlogs: 4, engagement: 33, performance: "Low" },
  { attendance: 89, testScore: 84, assignmentScore: 86, backlogs: 0, engagement: 82, performance: "High" },
  { attendance: 77, testScore: 71, assignmentScore: 73, backlogs: 1, engagement: 67, performance: "Medium" },
  { attendance: 96, testScore: 93, assignmentScore: 95, backlogs: 0, engagement: 94, performance: "High" },
  { attendance: 63, testScore: 55, assignmentScore: 57, backlogs: 2, engagement: 49, performance: "Low" },
  { attendance: 83, testScore: 77, assignmentScore: 79, backlogs: 0, engagement: 74, performance: "Medium" },
  { attendance: 45, testScore: 35, assignmentScore: 40, backlogs: 5, engagement: 30, performance: "Low" },
];

export const overviewStats = {
  totalStudents: students.length,
  avgAttendance: Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length),
  avgTestScore: Math.round(students.reduce((a, s) => a + s.testScore, 0) / students.length),
  performanceDistribution: {
    high: students.filter((s) => s.performance === "High").length,
    medium: students.filter((s) => s.performance === "Medium").length,
    low: students.filter((s) => s.performance === "Low").length,
  },
};

export const quickStats = {
  lowAttendance: students.filter((s) => s.attendance < 60).length,
  highBacklogs: students.filter((s) => s.backlogs >= 3).length,
  avgEngagement: Math.round(students.reduce((a, s) => a + s.engagement, 0) / students.length),
};

export const featureImportance = [
  { feature: "Attendance %", importance: 0.28 },
  { feature: "Internal Test Score", importance: 0.25 },
  { feature: "Assignment Score", importance: 0.20 },
  { feature: "Engagement Score", importance: 0.15 },
  { feature: "Number of Backlogs", importance: 0.12 },
];

export const modelInfo = {
  name: "Random Forest Classifier",
  version: "2.1.0",
  lastUpdated: "2026-01-15",
  trainingSize: 4850,
  algorithm: "Random Forest with 150 estimators",
  metrics: {
    accuracy: 87.34,
    precision: 86.12,
    recall: 85.67,
    f1Score: 85.89,
  },
  confusionMatrix: [
    [142, 8, 3],
    [12, 128, 10],
    [5, 14, 148],
  ],
  features: [
    { name: "Attendance Percentage", description: "Ratio of classes attended to total classes held", type: "Numeric (0-100)", importance: 1 },
    { name: "Internal Test Score", description: "Average score from mid-semester examinations", type: "Numeric (0-100)", importance: 2 },
    { name: "Assignment Score", description: "Average score from submitted assignments", type: "Numeric (0-100)", importance: 3 },
    { name: "Engagement Score", description: "Composite metric of participation and activity", type: "Numeric (0-100)", importance: 4 },
    { name: "Number of Backlogs", description: "Previously failed courses pending completion", type: "Integer (0-10)", importance: 5 },
  ],
  classDistribution: { High: 1620, Medium: 1580, Low: 1650 },
};

export type PredictionResult = {
  level: "High" | "Medium" | "Low";
  confidence: number;
  recommendations: string[];
  factors: { name: string; impact: "positive" | "neutral" | "negative" }[];
};

export function mockPredict(input: {
  attendance: number;
  testScore: number;
  assignmentScore: number;
  backlogs: number;
  engagement: number;
}): PredictionResult {
  const score =
    input.attendance * 0.28 +
    input.testScore * 0.25 +
    input.assignmentScore * 0.2 +
    input.engagement * 0.15 -
    input.backlogs * 8;

  const normalized = Math.min(100, Math.max(0, score));

  let level: "High" | "Medium" | "Low";
  let confidence: number;
  if (normalized >= 70) {
    level = "High";
    confidence = 75 + Math.random() * 20;
  } else if (normalized >= 45) {
    level = "Medium";
    confidence = 65 + Math.random() * 20;
  } else {
    level = "Low";
    confidence = 70 + Math.random() * 25;
  }

  const recommendations: Record<string, string[]> = {
    High: [
      "Student is performing well — encourage participation in mentoring programs.",
      "Consider recommending advanced coursework or research opportunities.",
      "Continue monitoring to maintain current trajectory.",
    ],
    Medium: [
      "Schedule a check-in meeting to discuss academic goals.",
      "Recommend study groups or tutoring resources.",
      "Monitor attendance and assignment submissions closely.",
    ],
    Low: [
      "Immediate academic counseling is recommended.",
      "Connect student with tutoring and support services.",
      "Review attendance barriers and develop an improvement plan.",
      "Consider reduced course load for the next semester.",
    ],
  };

  const factors: PredictionResult["factors"] = [
    { name: "Attendance", impact: input.attendance >= 75 ? "positive" : input.attendance >= 60 ? "neutral" : "negative" },
    { name: "Test Score", impact: input.testScore >= 70 ? "positive" : input.testScore >= 50 ? "neutral" : "negative" },
    { name: "Assignments", impact: input.assignmentScore >= 70 ? "positive" : input.assignmentScore >= 50 ? "neutral" : "negative" },
    { name: "Backlogs", impact: input.backlogs === 0 ? "positive" : input.backlogs <= 2 ? "neutral" : "negative" },
    { name: "Engagement", impact: input.engagement >= 70 ? "positive" : input.engagement >= 50 ? "neutral" : "negative" },
  ];

  return { level, confidence: Math.round(confidence * 100) / 100, recommendations: recommendations[level], factors };
}
