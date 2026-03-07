// API service for communicating with the FastAPI backend

import type { Student } from "@/data/mockData";

const API_URL = "http://localhost:8000";

export interface StudentInput {
  attendance: number;
  testScore: number;
  assignmentScore: number;
  backlogs: number;
  engagement: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface PredictionResponse {
  level: "High" | "Medium" | "Low";
  confidence: number;
  recommendations: string[];
  factors: { name: string; impact: "positive" | "neutral" | "negative" }[];
  feature_importance: FeatureImportance[];
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
}

export interface PerformanceDistribution {
  high: number;
  medium: number;
  low: number;
}

export interface AnalyticsResponse {
  total_students: number;
  avg_attendance: number;
  avg_test_score: number;
  avg_assignment_score: number;
  avg_engagement: number;
  performance_distribution: PerformanceDistribution;
  backlog_distribution: Record<string, number>;
}

export interface ModelInfoResponse {
  algorithm: string;
  training_size: number;
  features: string[];
  feature_importance: Record<string, number>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function predictStudent(
  input: StudentInput
): Promise<PredictionResponse> {
  const response = await fetch(`${API_URL }/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      attendance: Math.round(input.attendance),
      testScore: Math.round(input.testScore),
      assignmentScore: Math.round(input.assignmentScore),
      backlogs: Math.round(input.backlogs),
      engagement: Math.round(input.engagement),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.detail || `HTTP error! status: ${response.status}`,
      response.status
    );
  }

  return response.json();
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_URL }/health`);

  if (!response.ok) {
    throw new ApiError(`Health check failed: ${response.status}`);
  }

  return response.json();
}

export async function getStudents(): Promise<Student[]> {
  const response = await fetch(`${API_URL}/students`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.detail || `HTTP error! status: ${response.status}`,
      response.status
    );
  }

  return response.json();
}

export async function getAnalytics(): Promise<AnalyticsResponse> {
  const response = await fetch(`${API_URL}/analytics`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.detail || `HTTP error! status: ${response.status}`,
      response.status
    );
  }

  return response.json();
}

export async function getModelInfo(): Promise<ModelInfoResponse> {
  const response = await fetch(`${API_URL}/model-info`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.detail || `HTTP error! status: ${response.status}`,
      response.status
    );
  }

  return response.json();
}
