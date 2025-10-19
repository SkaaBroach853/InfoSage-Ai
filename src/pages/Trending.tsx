import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Trending = () => {
  // Mock data for charts
  const trendData = [
    { date: "Mon", reports: 45 },
    { date: "Tue", reports: 62 },
    { date: "Wed", reports: 58 },
    { date: "Thu", reports: 73 },
    { date: "Fri", reports: 89 },
    { date: "Sat", reports: 95 },
    { date: "Sun", reports: 78 },
  ];

  const categoryData = [
    { name: "Politics", value: 35, color: "hsl(217, 91%, 60%)" },
    { name: "Health", value: 28, color: "hsl(173, 58%, 39%)" },
    { name: "Economy", value: 18, color: "hsl(142, 76%, 36%)" },
    { name: "Education", value: 12, color: "hsl(38, 92%, 50%)" },
    { name: "Entertainment", value: 7, color: "hsl(0, 84%, 60%)" },
  ];

  const topMisinfo = [
    {
      title: "False claim about new government policy",
      category: "Politics",
      reports: 234,
      accuracy: 12,
    },
    {
      title: "Misleading health remedy spreading on social media",
      category: "Health",
      reports: 189,
      accuracy: 23,
    },
    {
      title: "Fake news about economic indicators",
      category: "Economy",
      reports: 156,
      accuracy: 18,
    },
    {
      title: "Doctored images of celebrity statements",
      category: "Entertainment",
      reports: 143,
      accuracy: 8,
    },
    {
      title: "Unverified educational scholarship scam",
      category: "Education",
      reports: 127,
      accuracy: 15,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg gradient-primary">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Misinformation Radar</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Real-time tracking of trending misinformation and fake news
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today's Reports", value: "1,247", change: "+23%" },
            { label: "Active Cases", value: "89", change: "+12%" },
            { label: "Verified False", value: "734", change: "+18%" },
            { label: "Awareness Reach", value: "2.4M", change: "+35%" },
          ].map((stat, index) => (
            <Card key={index} className="p-6 gradient-card border-2 animate-fade-in">
              <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <Badge className="gradient-primary">{stat.change}</Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Trend */}
          <Card className="p-6 border-2">
            <h3 className="text-lg font-bold text-foreground mb-4">Weekly Report Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="reports"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={3}
                  dot={{ fill: "hsl(217, 91%, 60%)", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6 border-2">
            <h3 className="text-lg font-bold text-foreground mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top Misinformation List */}
        <Card className="p-6 border-2">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <h3 className="text-xl font-bold text-foreground">
              Top Trending Misinformation
            </h3>
          </div>
          <div className="space-y-4">
            {topMisinfo.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth border border-border"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-primary">#{index + 1}</span>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <h4 className="text-base font-semibold text-foreground mb-2">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{item.reports} reports</span>
                      <span className="text-destructive font-semibold">
                        {item.accuracy}% accuracy
                      </span>
                    </div>
                  </div>
                  <Badge variant="destructive" className="shrink-0">
                    Active
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Trending;
