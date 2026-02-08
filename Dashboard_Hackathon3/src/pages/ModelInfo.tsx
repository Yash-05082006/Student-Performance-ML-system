import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { modelInfo } from "@/data/mockData";
import { BrainCircuit, Calendar, Database, Hash } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const metricsData = [
  { name: "Accuracy", value: modelInfo.metrics.accuracy },
  { name: "Precision", value: modelInfo.metrics.precision },
  { name: "Recall", value: modelInfo.metrics.recall },
  { name: "F1-Score", value: modelInfo.metrics.f1Score },
];

const classLabels = ["High", "Medium", "Low"];

export default function ModelInfoPage() {
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
                <p className="text-sm font-semibold">{modelInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5"><Hash className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Version</p>
                <p className="text-sm font-semibold">v{modelInfo.version}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5"><Calendar className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-semibold">{modelInfo.lastUpdated}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5"><Database className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Training Size</p>
                <p className="text-sm font-semibold">{modelInfo.trainingSize.toLocaleString()} samples</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Metrics Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[75, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
                <Bar dataKey="value" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confusion Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Confusion Matrix</CardTitle>
            <CardDescription>Predicted vs Actual classifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full text-center text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-muted-foreground text-xs">Actual ↓ / Predicted →</th>
                    {classLabels.map((l) => <th key={l} className="p-2 font-medium">{l}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {modelInfo.confusionMatrix.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 font-medium">{classLabels[i]}</td>
                      {row.map((val, j) => (
                        <td key={j} className={`p-2 ${i === j ? "font-bold text-primary bg-primary/5 rounded" : "text-muted-foreground"}`}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
              {modelInfo.features.map((f) => (
                <TableRow key={f.name}>
                  <TableCell><Badge variant="secondary">#{f.importance}</Badge></TableCell>
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell className="text-muted-foreground">{f.description}</TableCell>
                  <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{f.type}</code></TableCell>
                </TableRow>
              ))}
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
            {Object.entries(modelInfo.classDistribution).map(([label, count]) => (
              <div key={label} className="flex-1 rounded-lg border p-4 text-center">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold mt-1">{count.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
