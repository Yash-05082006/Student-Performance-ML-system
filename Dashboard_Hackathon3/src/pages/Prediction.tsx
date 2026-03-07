import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { predictStudent, ApiError, type PredictionResponse } from "@/services/api";
import PerformanceBadge from "@/components/PerformanceBadge";
import { BrainCircuit, RotateCcw, Loader2, ArrowUp, ArrowDown, Minus, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

interface PredictionLog {
  id: number;
  input: { attendance: number; testScore: number; assignmentScore: number; backlogs: number; engagement: number };
  result: PredictionResponse;
}

export default function Prediction() {
  const [attendance, setAttendance] = useState(75);
  const [testScore, setTestScore] = useState(65);
  const [assignmentScore, setAssignmentScore] = useState(70);
  const [backlogs, setBacklogs] = useState("0");
  const [engagement, setEngagement] = useState(60);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [history, setHistory] = useState<PredictionLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isValid = attendance >= 0 && attendance <= 100 && testScore >= 0 && testScore <= 100 && assignmentScore >= 0 && assignmentScore <= 100 && engagement >= 0 && engagement <= 100;

  const handlePredict = useCallback(async () => {
    setLoading(true);
    setError(null);
    const input = { attendance, testScore, assignmentScore, backlogs: parseInt(backlogs), engagement };
    
    try {
      const res = await predictStudent(input);
      setResult(res);
      setHistory((prev) => [{ id: Date.now(), input, result: res }, ...prev].slice(0, 10));
    } catch (err) {
      let errorMessage: string;
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "Failed to get prediction. Please try again.";
      }
      setError(errorMessage);
      toast({
        title: "Prediction Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [attendance, testScore, assignmentScore, backlogs, engagement]);

  const handleReset = () => {
    setAttendance(75); setTestScore(65); setAssignmentScore(70); setBacklogs("0"); setEngagement(60);
    setResult(null);
  };

  const impactIcon = (impact: "positive" | "neutral" | "negative") => {
    if (impact === "positive") return <ArrowUp className="h-4 w-4 text-perf-high" />;
    if (impact === "negative") return <ArrowDown className="h-4 w-4 text-perf-low" />;
    return <Minus className="h-4 w-4 text-perf-medium" />;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Predict Performance</h1>
        <p className="text-muted-foreground">Enter student data to generate a performance prediction</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Student Information</CardTitle>
            <CardDescription>Adjust the values below and click predict</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Attendance */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Attendance Percentage</Label>
                <span className="text-sm font-medium text-primary">{attendance}%</span>
              </div>
              <Slider value={[attendance]} onValueChange={([v]) => setAttendance(v)} min={0} max={100} step={1} />
            </div>

            {/* Test Score */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Internal Test Score</Label>
                <span className="text-sm font-medium text-primary">{testScore}</span>
              </div>
              <Slider value={[testScore]} onValueChange={([v]) => setTestScore(v)} min={0} max={100} step={1} />
            </div>

            {/* Assignment */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Assignment Score</Label>
                <span className="text-sm font-medium text-primary">{assignmentScore}</span>
              </div>
              <Slider value={[assignmentScore]} onValueChange={([v]) => setAssignmentScore(v)} min={0} max={100} step={1} />
            </div>

            {/* Backlogs */}
            <div className="space-y-2">
              <Label>Number of Backlogs</Label>
              <Select value={backlogs} onValueChange={setBacklogs}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Engagement */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Engagement Score</Label>
                <span className="text-sm font-medium text-primary">{engagement}</span>
              </div>
              <Slider value={[engagement]} onValueChange={([v]) => setEngagement(v)} min={0} max={100} step={1} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handlePredict} disabled={!isValid || loading} className="flex-1">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <BrainCircuit className="h-4 w-4 mr-2" />}
                {loading ? "Predicting…" : "Predict Performance"}
              </Button>
              <Button variant="outline" onClick={handleReset}><RotateCcw className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                <Card className="border-destructive/50 bg-destructive/10">
                  <CardContent className="flex items-center gap-3 pt-6">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Prediction Result</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <PerformanceBadge level={result.level} size="lg" />
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="text-xl font-bold">{result.confidence}%</p>
                      </div>
                    </div>

                    {/* Confidence bar */}
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${result.level === "High" ? "bg-perf-high" : result.level === "Medium" ? "bg-perf-medium" : "bg-perf-low"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>

                    {/* Contributing Factors */}
                    <div>
                      <p className="text-sm font-medium mb-3">Contributing Factors</p>
                      <div className="grid grid-cols-2 gap-2">
                        {result.factors.map((f) => (
                          <div key={f.name} className="flex items-center gap-2 rounded-lg border p-2.5">
                            {impactIcon(f.impact)}
                            <span className="text-sm">{f.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feature Importance Chart */}
                    {result.feature_importance && result.feature_importance.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-3">Feature Impact on Prediction</p>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[...result.feature_importance]
                                .sort((a, b) => Math.abs(b.importance) - Math.abs(a.importance))
                                .map(fi => ({
                                  ...fi,
                                  importancePercent: Math.round(fi.importance * 100)
                                }))}
                              layout="vertical"
                              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" horizontal={false} />
                              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                              <YAxis 
                                dataKey="feature" 
                                type="category" 
                                width={75}
                                tick={{ fontSize: 12 }}
                              />
                              <Tooltip 
                                formatter={(value: number) => [`${value}%`, "Influence"]} 
                                contentStyle={{ fontSize: 12 }}
                              />
                              <Bar dataKey="importancePercent" radius={[0, 4, 4, 0]}>
                                {result.feature_importance.map((entry, index) => {
                                  // Determine color based on feature and threshold
                                  let fill = "hsl(214, 32%, 91%)"; // default grey
                                  const factor = result.factors.find(f => {
                                    const nameMap: Record<string, string> = {
                                      "Attendance": "Attendance",
                                      "Test Score": "Test Score", 
                                      "Assignments": "Assignment Score",
                                      "Backlogs": "Backlogs",
                                      "Engagement": "Engagement"
                                    };
                                    return nameMap[f.name] === entry.feature;
                                  });
                                  
                                  if (factor) {
                                    if (factor.impact === "positive") fill = "hsl(160, 84%, 39%)"; // green
                                    else if (factor.impact === "negative") fill = "hsl(0, 84%, 60%)"; // red
                                    else fill = "hsl(214, 32%, 91%)"; // grey
                                  }
                                  
                                  return <Cell key={`cell-${index}`} fill={fill} />;
                                })}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div>
                      <p className="text-sm font-medium mb-3">Recommendations</p>
                      <ul className="space-y-2">
                        {result.recommendations.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History */}
          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {history.map((h) => (
                    <div key={h.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Att: {h.input.attendance}% · Test: {h.input.testScore} · Asgn: {h.input.assignmentScore}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{h.result.confidence}%</span>
                        <PerformanceBadge level={h.result.level} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
