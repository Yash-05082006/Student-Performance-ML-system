import { useState, useEffect } from "react";
import { Users, Percent, BookOpen, TrendingUp, AlertTriangle, Activity, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import { getAnalytics, getStudents, type AnalyticsResponse, ApiError } from "@/services/api";
import type { Student } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, PieChart, Pie, Cell, Legend,
} from "recharts";

const perfColors: Record<string, string> = {
  High: "hsl(160,84%,39%)",
  Medium: "hsl(38,92%,50%)",
  Low: "hsl(0,84%,60%)",
};

export default function Overview() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [analyticsData, studentsData] = await Promise.all([
          getAnalytics(),
          getStudents(),
        ]);
        setAnalytics(analyticsData);
        setStudents(studentsData);
      } catch (err) {
        let errorMessage = "Failed to load dashboard data";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading dashboard data...</span>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive">{error || "Failed to load data"}</p>
        </div>
      </div>
    );
  }

  const perfDistData = [
    { name: "High", value: analytics.performance_distribution.high, fill: "hsl(160, 84%, 39%)" },
    { name: "Medium", value: analytics.performance_distribution.medium, fill: "hsl(38, 92%, 50%)" },
    { name: "Low", value: analytics.performance_distribution.low, fill: "hsl(0, 84%, 60%)" },
  ];

  const testScoreHistogram = [
    { range: "0-20", count: students.filter((s) => s.testScore <= 20).length },
    { range: "21-40", count: students.filter((s) => s.testScore > 20 && s.testScore <= 40).length },
    { range: "41-60", count: students.filter((s) => s.testScore > 40 && s.testScore <= 60).length },
    { range: "61-80", count: students.filter((s) => s.testScore > 60 && s.testScore <= 80).length },
    { range: "81-100", count: students.filter((s) => s.testScore > 80).length },
  ];

  const lowAttendance = students.filter((s) => s.attendance < 60).length;
  const highBacklogs = students.filter((s) => s.backlogs >= 3).length;
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground">At-a-glance insights into student performance data</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={analytics.total_students} icon={Users} subtitle="Analyzed this semester" />
        <StatCard title="Avg Attendance" value={`${analytics.avg_attendance}%`} icon={Percent} variant="success" subtitle="Across all students" />
        <StatCard title="Avg Test Score" value={analytics.avg_test_score} icon={BookOpen} variant="warning" subtitle="Internal examinations" />
        <StatCard
          title="High Performers"
          value={analytics.performance_distribution.high}
          icon={TrendingUp}
          variant="success"
          subtitle={`${Math.round((analytics.performance_distribution.high / analytics.total_students) * 100)}% of total`}
        />
      </div>

      {/* Attendance vs Internal Score Correlation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attendance vs Internal Score Correlation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis
                type="number"
                dataKey="attendance"
                name="Attendance %"
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fontSize: 12 }}
                label={{ value: "Attendance %", position: "insideBottomRight", offset: -10, style: { fontSize: 12 } }}
              />
              <YAxis
                type="number"
                dataKey="testScore"
                name="Internal Score"
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                label={{ value: "Internal Score", angle: -90, position: "insideLeft", style: { fontSize: 12 } }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const p = payload[0].payload as Student;
                  return (
                    <div className="rounded-md border bg-background px-3 py-2 text-xs shadow-sm">
                      <div className="font-medium mb-1">Student</div>
                      <div>Attendance: {p.attendance}%</div>
                      <div>Internal Score: {p.testScore}</div>
                      <div>Performance: {p.performance}</div>
                    </div>
                  );
                }}
              />
              <Scatter data={students}>
                {students.map((s, i) => (
                  <Cell key={i} fill={perfColors[s.performance]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={perfDistData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {perfDistData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance vs Performance Scatter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attendance vs Test Score</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis type="number" dataKey="attendance" name="Attendance %" domain={[30, 100]} tick={{ fontSize: 12 }} />
                <YAxis type="number" dataKey="testScore" name="Test Score" domain={[20, 100]} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={students} fill="hsl(217, 91%, 60%)" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Test Score Histogram */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Test Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={testScoreHistogram}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-destructive/10 p-2.5">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium">Low Attendance Students</p>
                <p className="text-2xl font-bold">{lowAttendance}</p>
                <p className="text-xs text-muted-foreground">Below 60% attendance</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-perf-medium/10 p-2.5">
                <BookOpen className="h-5 w-5 text-perf-medium" />
              </div>
              <div>
                <p className="text-sm font-medium">High Backlog Count</p>
                <p className="text-2xl font-bold">{highBacklogs}</p>
                <p className="text-xs text-muted-foreground">3 or more backlogs</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Average Engagement</p>
                <p className="text-2xl font-bold">{analytics.avg_engagement}%</p>
                <p className="text-xs text-muted-foreground">Composite engagement metric</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
