import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PerformanceBadge from "@/components/PerformanceBadge";
import { students, featureImportance, type Student } from "@/data/mockData";
import { Download, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell,
} from "recharts";

const ROWS_PER_PAGE = 10;
const perfColors: Record<string, string> = { High: "hsl(160,84%,39%)", Medium: "hsl(38,92%,50%)", Low: "hsl(0,84%,60%)" };

export default function Analytics() {
  const [perfFilter, setPerfFilter] = useState<string>("all");
  const [attendanceFilter, setAttendanceFilter] = useState<string>("all");
  const [sortCol, setSortCol] = useState<keyof Student>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let data = [...students];
    if (perfFilter !== "all") data = data.filter((s) => s.performance === perfFilter);
    if (attendanceFilter === "low") data = data.filter((s) => s.attendance < 60);
    else if (attendanceFilter === "mid") data = data.filter((s) => s.attendance >= 60 && s.attendance < 80);
    else if (attendanceFilter === "high") data = data.filter((s) => s.attendance >= 80);
    data.sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [perfFilter, attendanceFilter, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paged = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  const handleSort = (col: keyof Student) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  const resetFilters = () => { setPerfFilter("all"); setAttendanceFilter("all"); setPage(0); };

  const exportCsv = () => {
    const header = "ID,Attendance,Test Score,Assignment Score,Backlogs,Engagement,Performance\n";
    const rows = filtered.map((s) => `${s.id},${s.attendance},${s.testScore},${s.assignmentScore},${s.backlogs},${s.engagement},${s.performance}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "student_data.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const SortIndicator = ({ col }: { col: keyof Student }) => (
    <span className="ml-1 text-xs text-muted-foreground">{sortCol === col ? (sortDir === "asc" ? "↑" : "↓") : ""}</span>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Deep-dive into correlations and trends</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 py-4">
          <Select value={perfFilter} onValueChange={(v) => { setPerfFilter(v); setPage(0); }}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Performance" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Performance</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={attendanceFilter} onValueChange={(v) => { setAttendanceFilter(v); setPage(0); }}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Attendance" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Attendance</SelectItem>
              <SelectItem value="high">≥80%</SelectItem>
              <SelectItem value="mid">60–79%</SelectItem>
              <SelectItem value="low">&lt;60%</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={resetFilters}><RotateCcw className="h-3.5 w-3.5 mr-1.5" />Reset</Button>
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-3.5 w-3.5 mr-1.5" />Export CSV</Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Feature Importance */}
        <Card>
          <CardHeader><CardTitle className="text-base">Feature Importance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={featureImportance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis type="number" domain={[0, 0.35]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="feature" type="category" width={130} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
                <Bar dataKey="importance" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Scatter by performance */}
        <Card>
          <CardHeader><CardTitle className="text-base">Attendance vs Engagement (by Performance)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis type="number" dataKey="attendance" name="Attendance %" domain={[30, 100]} tick={{ fontSize: 12 }} />
                <YAxis type="number" dataKey="engagement" name="Engagement" domain={[20, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Scatter data={filtered} fillOpacity={0.8}>
                  {filtered.map((s, i) => <Cell key={i} fill={perfColors[s.performance]} />)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Student Data ({filtered.length} records)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {(["id", "attendance", "testScore", "assignmentScore", "backlogs", "engagement", "performance"] as (keyof Student)[]).map((col) => (
                    <TableHead key={col} className="cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort(col)}>
                      {col === "id" ? "ID" : col === "testScore" ? "Test Score" : col === "assignmentScore" ? "Assignment" : col.charAt(0).toUpperCase() + col.slice(1)}
                      <SortIndicator col={col} />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.id}</TableCell>
                    <TableCell>{s.attendance}%</TableCell>
                    <TableCell>{s.testScore}</TableCell>
                    <TableCell>{s.assignmentScore}</TableCell>
                    <TableCell>{s.backlogs}</TableCell>
                    <TableCell>{s.engagement}</TableCell>
                    <TableCell><PerformanceBadge level={s.performance} size="sm" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
