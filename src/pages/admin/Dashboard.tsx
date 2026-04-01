import { Building2, Users, CreditCard, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const stats = [
  { title: "Total Properties", value: "2,847", trend: "+12.5%", up: true, icon: Building2 },
  { title: "Active Users", value: "18,392", trend: "+8.2%", up: true, icon: Users },
  { title: "Monthly Revenue", value: "₦45.2M", trend: "+23.1%", up: true, icon: CreditCard },
  { title: "Open Disputes", value: "24", trend: "-5.4%", up: false, icon: AlertTriangle },
];

const recentActivity = [
  { id: 1, action: "New property listed", user: "Adebayo Johnson", time: "2 min ago", type: "property" },
  { id: 2, action: "KYC verification submitted", user: "Chioma Okafor", time: "15 min ago", type: "user" },
  { id: 3, action: "Payment completed", user: "Emeka Nwankwo", time: "32 min ago", type: "transaction" },
  { id: 4, action: "Dispute opened", user: "Fatima Abdullahi", time: "1 hr ago", type: "dispute" },
  { id: 5, action: "Property approved", user: "Admin", time: "2 hrs ago", type: "property" },
  { id: 6, action: "Payout processed", user: "System", time: "3 hrs ago", type: "transaction" },
];

const typeColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  property: "default",
  user: "secondary",
  transaction: "outline",
  dispute: "destructive",
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="text-muted-foreground">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={`flex items-center text-xs mt-1 ${stat.up ? "text-green-600" : "text-red-500"}`}>
                {stat.up ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {stat.trend} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.action}</TableCell>
                  <TableCell>{item.user}</TableCell>
                  <TableCell>
                    <Badge variant={typeColors[item.type]}>{item.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
