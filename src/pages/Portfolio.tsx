import { Layout } from "@/components/layout/Layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { TiltCard, HoverLiftCard } from "@/components/ui/tilt-card";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { CountUp } from "@/components/ui/animated-gradient-text";
import { Coins, TrendingUp, Leaf, TreeDeciduous, ArrowUpRight, ArrowDownRight, Flame } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const activities = [
  { type: "minted", amount: 12.5, date: "2 hours ago", txHash: "0x742d...1a8" },
  { type: "sold", amount: 5.0, date: "1 day ago", txHash: "0x8f14...f0b", buyer: "ESG Corp Ltd", price: 1500 },
  { type: "burned", amount: 3.0, date: "3 days ago", txHash: "0x5c6d...2e9" },
  { type: "minted", amount: 8.2, date: "5 days ago", txHash: "0x9a7b...4d1" },
  { type: "minted", amount: 15.0, date: "1 week ago", txHash: "0x3e2f...8c7" },
];

// Chart data
const earningsData = [
  { month: "Jul", credits: 8.2, value: 2460 },
  { month: "Aug", credits: 10.5, value: 3150 },
  { month: "Sep", credits: 12.0, value: 3600 },
  { month: "Oct", credits: 9.8, value: 2940 },
  { month: "Nov", credits: 15.2, value: 4560 },
  { month: "Dec", credits: 18.5, value: 5550 },
  { month: "Jan", credits: 22.3, value: 6690 },
];

const impactData = [
  { month: "Jul", co2: 820, trees: 41 },
  { month: "Aug", co2: 1050, trees: 52 },
  { month: "Sep", co2: 1200, trees: 60 },
  { month: "Oct", co2: 980, trees: 49 },
  { month: "Nov", co2: 1520, trees: 76 },
  { month: "Dec", co2: 1850, trees: 92 },
  { month: "Jan", co2: 2230, trees: 111 },
];

const marketTrendData = [
  { day: "Mon", price: 285 },
  { day: "Tue", price: 292 },
  { day: "Wed", price: 288 },
  { day: "Thu", price: 305 },
  { day: "Fri", price: 315 },
  { day: "Sat", price: 310 },
  { day: "Sun", price: 320 },
];

const distributionData = [
  { name: "Minted", value: 35.7, color: "hsl(var(--primary))" },
  { name: "Sold", value: 5.0, color: "hsl(var(--secondary))" },
  { name: "Retired", value: 3.0, color: "hsl(24, 95%, 53%)" },
  { name: "Available", value: 47.7, color: "hsl(var(--muted))" },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "minted":
      return <ArrowUpRight className="h-5 w-5 text-primary" />;
    case "sold":
      return <ArrowDownRight className="h-5 w-5 text-secondary" />;
    case "burned":
      return <Flame className="h-5 w-5 text-orange-500" />;
    default:
      return null;
  }
};

const getActivityLabel = (type: string) => {
  switch (type) {
    case "minted":
      return "Minted";
    case "sold":
      return "Sold";
    case "burned":
      return "Retired";
    default:
      return type;
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-border/50">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            {entry.name.includes("Credits") || entry.name === "credits" ? " SRC" : ""}
            {entry.name.includes("CO₂") || entry.name === "co2" ? " kg" : ""}
            {entry.name.includes("Value") || entry.name.includes("Price") || entry.name === "value" || entry.name === "price" ? " ₹" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Portfolio() {
  const stats = [
    { title: "Total SRC Balance", value: 47.7, icon: Coins, subtitle: "Carbon Credits", decimals: 1 },
    { title: "Market Value", value: 14310, prefix: "₹", icon: TrendingUp, trend: { value: 12.5, positive: true } },
    { title: "CO₂ Offset", value: 4770, suffix: " kg", icon: Leaf, subtitle: "Lifetime Impact" },
    { title: "Trees Equivalent", value: 238, icon: TreeDeciduous, subtitle: "Based on 20kg/tree/year" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <AnimatedWrapper animation="fade-up" className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Portfolio</h1>
          <p className="text-muted-foreground">
            Track your carbon credits, impact metrics, and transaction history
          </p>
        </AnimatedWrapper>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <AnimatedWrapper key={stat.title} animation="scale-in" delay={index * 100}>
              <TiltCard 
                className={`glass-card p-6 ${index === 0 ? 'bg-gradient-to-br from-primary/10 to-secondary/10' : ''}`}
                intensity={5}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  {stat.trend && (
                    <span className={`text-xs font-medium ${stat.trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.trend.positive ? '+' : '-'}{stat.trend.value}%
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold mb-1">
                  {stat.prefix}
                  <CountUp end={stat.value} decimals={stat.decimals || 0} duration={2000} />
                  {stat.suffix}
                </p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                )}
              </TiltCard>
            </AnimatedWrapper>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Credit Earnings Chart */}
          <AnimatedWrapper animation="fade-up" delay={200}>
            <HoverLiftCard className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6">Credit Earnings Over Time</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData}>
                    <defs>
                      <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="credits"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#creditGradient)"
                      name="Credits"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </HoverLiftCard>
          </AnimatedWrapper>

          {/* Market Trend Chart */}
          <AnimatedWrapper animation="fade-up" delay={300}>
            <HoverLiftCard className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6">Market Price Trend (₹/SRC)</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--secondary))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "hsl(var(--secondary))" }}
                      name="Price"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </HoverLiftCard>
          </AnimatedWrapper>
        </div>

        {/* Environmental Impact & Distribution Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Environmental Impact */}
          <AnimatedWrapper animation="fade-up" delay={400}>
            <HoverLiftCard className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6">Environmental Impact</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="co2" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="CO₂ Offset (kg)" />
                    <Bar dataKey="trees" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Trees Equivalent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </HoverLiftCard>
          </AnimatedWrapper>

          {/* Credit Distribution */}
          <AnimatedWrapper animation="fade-up" delay={500}>
            <HoverLiftCard className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6">Credit Distribution</h2>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {distributionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </HoverLiftCard>
          </AnimatedWrapper>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <AnimatedWrapper animation="fade-up" delay={600}>
              <HoverLiftCard className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-6">Activity Feed</h2>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="p-3 rounded-xl bg-card">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{getActivityLabel(activity.type)}</span>
                          <span className="text-primary font-bold">{activity.amount} SRC</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{activity.date}</span>
                          <span>•</span>
                          <span className="font-mono">{activity.txHash}</span>
                        </div>
                        {activity.type === "sold" && (
                          <div className="text-sm text-muted-foreground mt-1">
                            To: {activity.buyer} • ₹{activity.price}
                          </div>
                        )}
                      </div>
                      <StatusBadge status="verified" showIcon={false} className="hidden sm:flex" />
                    </div>
                  ))}
                </div>
              </HoverLiftCard>
            </AnimatedWrapper>
          </div>

          {/* Impact Summary */}
          <div className="space-y-6">
            <AnimatedWrapper animation="fade-up" delay={700}>
              <HoverLiftCard className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Impact Summary</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Credits Minted</span>
                      <span className="font-medium">35.7 SRC</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[75%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Credits Sold</span>
                      <span className="font-medium">5.0 SRC</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[10%] rounded-full bg-secondary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Credits Retired</span>
                      <span className="font-medium">3.0 SRC</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[6%] rounded-full bg-orange-500" />
                    </div>
                  </div>
                </div>
              </HoverLiftCard>
            </AnimatedWrapper>

            <AnimatedWrapper animation="fade-up" delay={800}>
              <HoverLiftCard className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Environmental Impact</h2>
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 border-4 border-primary/30 mb-4 animate-pulse-glow">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">
                        <CountUp end={4.77} decimals={2} duration={2000} />
                      </p>
                      <p className="text-sm text-muted-foreground">Tonnes CO₂</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    You've offset the equivalent of driving{" "}
                    <span className="font-semibold text-foreground">
                      <CountUp end={19500} duration={2500} /> km
                    </span>{" "}
                    in a petrol car
                  </p>
                </div>
              </HoverLiftCard>
            </AnimatedWrapper>

            <AnimatedWrapper animation="fade-up" delay={900}>
              <HoverLiftCard className="glass-card p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="flex items-center gap-3 mb-3">
                  <Leaf className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold">Carbon Positive</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your solar generation is making a real difference. Keep it up!
                </p>
              </HoverLiftCard>
            </AnimatedWrapper>
          </div>
        </div>
      </div>
    </Layout>
  );
}
