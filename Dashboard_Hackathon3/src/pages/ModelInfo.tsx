import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getModelInfo, getAnalytics, ApiError, type ModelInfoResponse, type AnalyticsResponse } from "@/services/api";
import { BrainCircuit, Calendar, Database, Hash, Loader2, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const classLabels = ["High", "Medium", "Low"];

export default function ModelInfoPage() {
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [modelData, analyticsData] = await Promise.all([
          getModelInfo(),
          getAnalytics(),
        ]);
        setModelInfo(modelData);
        setAnalytics(analyticsData);
      } catch (err) {
        let errorMessage = "Failed to load model information";
        if (err instanceof ApiError) {
          errorMessage = err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const featureImportanceData = useMemo(() => {
    if (!modelInfo) return [];
    const featureLabels: Record<string, string> = {
      attendance: "Attendance %",
      internal_score: "Internal Test Score",
      assignment_score: "Assignment Score",
      engagement: "Engagement Score",
      backlogs: "Number of Backlogs",
    };
    return Object.entries(modelInfo.feature_importance).map(([key, value]) => ({
      name: featureLabels[key] || key,
      value: Math.round(value * 100),
    }));
  }, [modelInfo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading model info...</span>
      </div>
    );
  }

  if (error || !modelInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive">{error || "Failed to load model information"}</p>
        </div>
      </div>
    );
  }

  // Feature descriptions for the table
  const featureDescriptions: Record<string, string> = {
    attendance: "Ratio of classes attended to total classes held",
    internal_score: "Average score from mid-semester examinations",
    assignment_score: "Average score from submitted assignments",
    engagement: "Composite metric of participation and activity",
    backlogs: "Previously failed courses pending completion",
  };

  const featureTypes: Record<string, string> = {
    attendance: "Numeric (0-100)",
    internal_score: "Numeric (0-100)",
    assignment_score: "Numeric (0-100)",
    engagement: "Numeric (0-100)",
    backlogs: "Integer (0-10)",
  };
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Model Information</h1>
        <p className="text-muted-foreground">Transparency about the ML model powering predictions</p>
      </div>

      {/* Model Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Model Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5"><BrainCircuit className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Algorithm</p>
                <p className="text-sm font-semibold">{modelInfo.algorithm}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5"><Hash className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Features</p>
                <p className="text-sm font-semibold">{modelInfo.features.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5"><Calendar className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-semibold">2026-03-05</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5"><Database className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Training Size</p>
                <p className="text-sm font-semibold">{modelInfo.training_size.toLocaleString()} samples</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Feature Importance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Feature Importance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={featureImportanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Bar dataKey="value" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confusion Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Distribution</CardTitle>
            <CardDescription>Training data class distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              {analytics && (
                <div className="flex gap-6">
                  {[
                    { label: "High", count: analytics.performance_distribution.high },
                    { label: "Medium", count: analytics.performance_distribution.medium },
                    { label: "Low", count: analytics.performance_distribution.low },
                  ].map(({ label, count }) => (
                    <div key={label} className="flex-1 rounded-lg border p-4 text-center">
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="text-2xl font-bold mt-1">{count.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{Math.round((count / analytics.total_students) * 100)}%</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Input Features</CardTitle>
          <CardDescription>All features used by the model with importance rankings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Feature</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelInfo.features.map((feature, index) => {
                const importance = modelInfo.feature_importance[feature] || 0;
                const sortedFeatures = Object.entries(modelInfo.feature_importance).sort((a, b) => b[1] - a[1]);
                const rank = sortedFeatures.findIndex(([k]) => k === feature) + 1;
                return (
                  <TableRow key={feature}>
                    <TableCell><Badge variant="secondary">#{rank}</Badge></TableCell>
                    <TableCell className="font-medium">{featureDescriptions[feature] || feature}</TableCell>
                    <TableCell className="text-muted-foreground">{featureDescriptions[feature] || ""}</TableCell>
                    <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{featureTypes[feature] || "Numeric"}</code></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Class Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Training Data Class Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            {analytics && [
              { label: "High", count: analytics.performance_distribution.high },
              { label: "Medium", count: analytics.performance_distribution.medium },
              { label: "Low", count: analytics.performance_distribution.low },
            ].map(({ label, count }) => (
              <div key={label} className="flex-1 rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold mt-1">{count.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{Math.round((count / analytics.total_students) * 100)}% of total</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
