import { Search, MoreHorizontal, ShieldCheck, Clock, ShieldX } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const users = [
  { id: "U-001", name: "Adebayo Johnson", email: "adebayo@mail.com", role: "Agent", verification: "Verified", joined: "2024-01-10" },
  { id: "U-002", name: "Chioma Okafor", email: "chioma@mail.com", role: "Landlord", verification: "Pending", joined: "2024-02-15" },
  { id: "U-003", name: "Emeka Nwankwo", email: "emeka@mail.com", role: "Tenant", verification: "Verified", joined: "2024-01-22" },
  { id: "U-004", name: "Fatima Abdullahi", email: "fatima@mail.com", role: "Tenant", verification: "Unverified", joined: "2024-03-01" },
  { id: "U-005", name: "Oluwaseun Bakare", email: "seun@mail.com", role: "Agent", verification: "Verified", joined: "2023-11-05" },
  { id: "U-006", name: "Ibrahim Yusuf", email: "ibrahim@mail.com", role: "Landlord", verification: "Pending", joined: "2024-02-28" },
];

const verificationIcon: Record<string, React.ReactNode> = {
  Verified: <ShieldCheck className="h-4 w-4 text-green-600" />, 
  Pending: <Clock className="h-4 w-4 text-yellow-600" />,
  Unverified: <ShieldX className="h-4 w-4 text-red-500" />,
};

const roleVariant: Record<string, "default" | "secondary" | "outline"> = {
  Agent: "default",
  Landlord: "secondary",
  Tenant: "outline",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Users & Providers</h2>
          <p className="text-muted-foreground">Manage tenants, agents, and landlords</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-9" />
            </div>
            <Button variant="outline" size="sm">All</Button>
            <Button variant="outline" size="sm">Agents</Button>
            <Button variant="outline" size="sm">Landlords</Button>
            <Button variant="outline" size="sm">Tenants</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {u.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge variant={roleVariant[u.role]}>{u.role}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {verificationIcon[u.verification]}
                      <span className="text-sm">{u.verification}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.joined}</TableCell>
                  <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
